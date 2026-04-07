import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ShoppingCart, Heart, Check, Star,
  Shield, Truck, RotateCcw, Plus, Minus, Zap,
} from 'lucide-react'
import { products, categories } from '../data/products'
import { useStore } from '../store/useStore'
import RelatedProducts from '../components/RelatedProducts'
import TestimonialTicker from '../components/TestimonialTicker'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find((p) => p.id === Number(id))

  const { addToCart, toggleFavorite, isFavorite, user, openAuthModal } = useStore()
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const fav = product ? isFavorite(product.id) : false

  useEffect(() => {
    if (!product) navigate('/', { replace: true })
    setSelectedVariant(0)
    setQuantity(1)
  }, [product, navigate, id])

  if (!product) return null

  const categoryLabel = categories.find((c) => c.id === product.category)?.label

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleFavorite = () => {
    if (!user) { openAuthModal(); return }
    toggleFavorite(product)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white"
    >
      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-2">
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link to="/" className="hover:text-slate-700 transition-colors font-medium">ראשי</Link>
          <ChevronLeft size={13} className="rotate-180" />
          <span className="text-slate-500">{categoryLabel}</span>
          <ChevronLeft size={13} className="rotate-180" />
          <span className="text-slate-700 truncate max-w-[180px] font-medium">{product.nameHe}</span>
        </nav>
      </div>

      {/* ── Main PDP Layout ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
        <div className="lg:grid lg:grid-cols-2 lg:gap-20 xl:gap-28">

          {/* ── LEFT: Sticky Image ─────────────────────────────── */}
          <div className="lg:sticky lg:top-28 lg:self-start mb-10 lg:mb-0">
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 aspect-square shadow-sm">
              <img
                key={product.image}
                src={product.image}
                alt={product.nameHe}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
              {product.badge && (
                <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-violet-600 text-white text-xs font-bold shadow-sm">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: 'משלוח חינם', sub: 'מעל ₪300' },
                { icon: Shield, label: 'אחריות', sub: '2 שנים' },
                { icon: RotateCcw, label: 'החזרה', sub: '30 יום' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 py-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <Icon size={18} className="text-violet-600" />
                  <span className="text-slate-800 text-xs font-semibold">{label}</span>
                  <span className="text-slate-400 text-xs">{sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Scrollable Content ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Category */}
            <p className="text-violet-600 text-xs uppercase tracking-[0.2em] mb-3 font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>
              {categoryLabel}
            </p>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl lg:text-[2.8rem] font-extrabold text-slate-900 leading-tight tracking-tight mb-1">
              {product.nameHe}
            </h1>
            <p className="text-slate-400 text-sm mb-5" style={{ fontFamily: 'var(--font-mono)' }}>
              {product.name}
            </p>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < 4 ? 'text-amber-400' : 'text-slate-200'} fill={i < 4 ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-slate-500 text-sm">4.8 <span className="text-slate-300">(124)</span></span>
            </div>

            {/* Price */}
            <div className="mb-7 pb-7 border-b border-slate-100">
              <span className="text-4xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-mono)' }}>
                ₪{product.price.toLocaleString()}
              </span>
              <span className="text-slate-400 text-sm mr-3">כולל מע״מ</span>
            </div>

            {/* Description */}
            <div className="mb-7 pb-7 border-b border-slate-100">
              <p className="text-slate-600 text-base leading-relaxed">{product.description}</p>
            </div>

            {/* Color variants */}
            {product.colorVariants?.length > 0 && (
              <div className="mb-7 pb-7 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-900 text-sm font-semibold">גוון / חומר</p>
                  <p className="text-violet-600 text-sm font-medium" style={{ fontFamily: 'var(--font-mono)' }}>
                    {product.colorVariants[selectedVariant].name}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colorVariants.map((v, i) => (
                    <motion.button
                      key={v.name}
                      onClick={() => setSelectedVariant(i)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.93 }}
                      title={v.name}
                      className={`relative w-10 h-10 rounded-xl transition-all duration-200 ${
                        selectedVariant === i
                          ? 'ring-2 ring-violet-600 ring-offset-2'
                          : 'ring-1 ring-slate-200 hover:ring-slate-300'
                      }`}
                      style={{ backgroundColor: v.hex }}
                    >
                      {selectedVariant === i && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check size={13} className={
                            ['#fafafa', '#fafaf9', '#f5f5f4', '#e4e4e7', '#fafaf0', '#d4d4d8'].includes(v.hex)
                              ? 'text-slate-900'
                              : 'text-white'
                          } />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-slate-900 text-sm font-semibold mb-4">כמות</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-10 text-center text-slate-900 font-bold text-lg" style={{ fontFamily: 'var(--font-mono)' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <span className="text-slate-400 text-sm">
                  סה״כ: <span className="text-slate-900 font-bold" style={{ fontFamily: 'var(--font-mono)' }}>₪{(product.price * quantity).toLocaleString()}</span>
                </span>
              </div>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex gap-3 mb-10">
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-200 ${
                  addedToCart
                    ? 'bg-emerald-500'
                    : 'bg-violet-600 hover:bg-violet-700 shadow-violet'
                }`}
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.span key="added" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <Check size={20} /> נוסף לעגלה!
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <ShoppingCart size={20} /> הוסף לעגלה
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                onClick={handleFavorite}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-14 h-14 flex items-center justify-center rounded-2xl border-2 transition-all duration-200 ${
                  fav
                    ? 'bg-violet-600 border-violet-600 text-white'
                    : 'border-slate-200 text-slate-400 hover:border-violet-400 hover:text-violet-500'
                }`}
              >
                <Heart size={22} fill={fav ? 'currentColor' : 'none'} />
              </motion.button>
            </div>

            {/* Specs */}
            {product.specs?.length > 0 && (
              <div className="mb-8 pb-8 border-b border-slate-100">
                <h3 className="text-slate-900 font-bold text-base mb-4 flex items-center gap-2">
                  <Zap size={16} className="text-violet-600" />
                  מפרט טכני
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="flex items-center justify-between px-4 py-3 bg-white">
                      <span className="text-slate-500 text-sm">{spec.label}</span>
                      <span className="text-slate-900 text-sm font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span style={{ fontFamily: 'var(--font-mono)' }}>במלאי — נשלח תוך 1-3 ימי עסקים</span>
            </div>
          </motion.div>
        </div>

        {/* ── Related Products ────────────────────────────────── */}
        <RelatedProducts category={product.category} currentId={product.id} />

        {/* ── Testimonials ────────────────────────────────────── */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">מה אומרים הלקוחות שלנו</h2>
          <TestimonialTicker />
        </div>
      </div>

      {/* ── Mobile sticky CTA ──────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/95 border-t border-slate-200 shadow-lg" style={{ backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-slate-400 text-xs truncate">{product.nameHe}</p>
            <p className="text-slate-900 font-bold text-lg" style={{ fontFamily: 'var(--font-mono)' }}>
              ₪{(product.price * quantity).toLocaleString()}
            </p>
          </div>
          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white font-bold transition-all ${
              addedToCart ? 'bg-emerald-500' : 'bg-violet-600 shadow-violet'
            }`}
          >
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.span key="added" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                  <Check size={17} /> נוסף!
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                  <ShoppingCart size={17} /> הוסף לעגלה
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <div className="md:hidden h-24" />
    </motion.div>
  )
}
