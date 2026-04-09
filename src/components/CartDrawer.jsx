import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus, Trash2, CreditCard, ArrowLeft, Loader2 } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import ShippingModal from './ShippingModal'

async function handleCheckout({ cart, shipping, clearCart, closeCart, setProcessing }) {
  setProcessing(true)

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const items = cart.map((i) => `${i.nameHe} ×${i.quantity} — ₪${(i.price * i.quantity).toLocaleString()}`).join('\n')

  // Send notification email with shipping details
  try {
    await emailjs.send(
      'service_ifdx81g',
      'template_q17npkm',
      {
        items,
        total: `₪${total.toLocaleString()}`,
        to_email: 'tomernado1233@gmail.com',
        customer_name: shipping.name,
        customer_email: shipping.email,
        customer_phone: shipping.phone,
        customer_address: shipping.address,
      },
      'puqZNBkJ-_xa9TNMX'
    )
  } catch (err) {
    console.error('EmailJS error:', err)
  }

  // Create Stripe Checkout Session
  try {
    const base = import.meta.env.BASE_URL
    const origin = window.location.origin
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: {
        cart: cart.map((i) => ({ nameHe: i.nameHe, image: i.image, price: i.price, quantity: i.quantity })),
        successUrl: `${origin}${base}success`,
        cancelUrl: `${origin}${base}`,
      },
    })
    if (error || !data?.url) throw new Error(error?.message ?? 'No URL')
    clearCart()
    closeCart()
    window.location.href = data.url
  } catch (err) {
    console.error('Stripe error:', err)
    setProcessing(false)
    alert('שגיאה ביצירת דף התשלום. נסה שוב.')
  }
}

export default function CartDrawer() {
  const {
    cart, isCartOpen, closeCart,
    removeFromCart, updateQuantity, clearCart,
    getCartTotal, getCartCount,
  } = useStore()

  const [isProcessing, setProcessing] = useState(false)
  const [showShipping, setShowShipping] = useState(false)

  const total = getCartTotal()
  const count = getCartCount()

  return (
    <>
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-slate-900/40"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-full max-w-md bg-white border-r border-slate-200 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-violet-600" />
                <div>
                  <h2 className="text-slate-900 font-bold text-lg leading-tight">עגלת קניות</h2>
                  <p className="text-slate-400 text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
                    {count} פריטים
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-slate-400 hover:text-red-500 text-xs transition-colors px-2 py-1 rounded-lg hover:bg-red-50 font-medium"
                  >
                    נקה הכל
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence initial={false}>
                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-20"
                  >
                    <ShoppingBag size={44} className="text-slate-200 mb-4" />
                    <p className="text-slate-500 text-lg font-semibold">העגלה ריקה</p>
                    <p className="text-slate-400 text-sm mt-1">הוסף מוצרים כדי להתחיל</p>
                    <button
                      onClick={closeCart}
                      className="mt-6 flex items-center gap-2 text-violet-600 hover:text-violet-700 text-sm font-semibold transition-colors"
                    >
                      <ArrowLeft size={15} />
                      המשך קניות
                    </button>
                  </motion.div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -60 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100"
                    >
                      {/* Thumb */}
                      <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-slate-200">
                        <img src={item.image} alt={item.nameHe} className="w-full h-full object-cover" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-900 font-semibold text-sm truncate">{item.nameHe}</p>
                        <p className="text-slate-400 text-xs mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
                          ₪{item.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-900 transition-all"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-slate-900 text-sm font-bold w-6 text-center" style={{ fontFamily: 'var(--font-mono)' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-900 transition-all"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal + remove */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                        <span className="text-slate-900 font-bold text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
                          ₪{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-sm">סה"כ לתשלום</span>
                  <span className="text-slate-900 text-2xl font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
                    ₪{total.toLocaleString()}
                  </span>
                </div>

                <motion.button
                  onClick={() => setShowShipping(true)}
                  disabled={isProcessing}
                  whileHover={isProcessing ? {} : { scale: 1.02 }}
                  whileTap={isProcessing ? {} : { scale: 0.98 }}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-200 ${
                    isProcessing
                      ? 'bg-violet-400 cursor-not-allowed'
                      : 'bg-violet-600 hover:bg-violet-700 shadow-violet'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      מעבד...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      לתשלום עכשיו
                    </>
                  )}
                </motion.button>

                <p className="text-center text-slate-400 text-xs">
                  תשלום מאובטח עם Stripe · SSL מוצפן
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {showShipping && (
      <ShippingModal
        onClose={() => setShowShipping(false)}
        onConfirm={(shipping) => {
          setShowShipping(false)
          handleCheckout({ cart, shipping, clearCart, closeCart, setProcessing })
        }}
      />
    )}
    </>
  )
}
