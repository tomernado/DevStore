import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, ShoppingBag, Package } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

export default function Profile() {
  const { user, clearUser } = useStore()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/'); return }
    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setOrders(data ?? []); setLoading(false) })
  }, [user, navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    clearUser()
    navigate('/')
  }

  const initials = user?.email?.[0]?.toUpperCase() ?? 'U'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-slate-50 pt-28 pb-16 px-4"
    >
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-violet">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">הפרופיל שלי</h1>
              <p className="text-slate-400 text-sm mt-0.5">{user?.email}</p>
            </div>
          </div>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm font-semibold transition-colors"
          >
            <LogOut size={15} />
            התנתקות
          </motion.button>
        </div>

        {/* Orders */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <ShoppingBag size={18} className="text-violet-600" />
            <h2 className="text-lg font-bold text-slate-900">היסטוריית הזמנות</h2>
          </div>

          {loading ? (
            <div className="text-center py-16 text-slate-400">טוען...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package size={44} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 font-semibold">אין הזמנות עדיין</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-400" style={{ fontFamily: 'var(--font-mono)' }}>
                      {new Date(order.created_at).toLocaleDateString('he-IL', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </span>
                    <span className="text-violet-600 font-bold text-base" style={{ fontFamily: 'var(--font-mono)' }}>
                      ₪{order.total_amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {(order.items ?? []).map((item, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.nameHe}
                          className="w-9 h-9 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                        />
                        <span className="text-slate-700 text-sm font-medium">{item.nameHe}</span>
                        <span className="text-slate-400 text-xs mr-auto" style={{ fontFamily: 'var(--font-mono)' }}>
                          ×{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
