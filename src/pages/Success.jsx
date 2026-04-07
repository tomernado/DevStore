import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { CheckCircle2, ArrowLeft, ShoppingBag } from 'lucide-react'

export default function Success() {
  useEffect(() => {
    // Burst confetti from both sides
    const fire = (particleRatio, opts) => {
      confetti({
        origin: { y: 0.6 },
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
      })
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#7c3aed', '#a78bfa'] })
    fire(0.2,  { spread: 60, colors: ['#6d28d9', '#c4b5fd'] })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#8b5cf6', '#ddd6fe'] })
    fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fire(0.1,  { spread: 120, startVelocity: 45, colors: ['#7c3aed', '#ede9fe'] })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-white flex items-center justify-center px-4"
    >
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.1 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-violet-50 border-4 border-violet-100 flex items-center justify-center">
            <CheckCircle2 size={52} className="text-violet-600" />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            תודה על הרכישה שלך!
          </h1>
          <p className="text-slate-500 text-lg mb-2">
            פרטי ההזמנה נשלחו למייל
          </p>
          <p className="text-slate-400 text-sm mb-10">
            ההזמנה שלך בטיפול — תקבל אישור תוך מספר דקות
          </p>
        </motion.div>

        {/* Order summary card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 text-right"
        >
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag size={18} className="text-violet-600" />
            <span className="text-slate-700 font-semibold text-sm">פרטי הזמנה</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-500">
              <span className="text-slate-400">סטטוס</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                אושרה
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span className="text-slate-400">אספקה משוערת</span>
              <span className="font-medium text-slate-700">1–3 ימי עסקים</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span className="text-slate-400">תשלום</span>
              <span className="font-medium text-slate-700">Stripe · מאובטח</span>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.45 }}
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-base shadow-violet transition-colors duration-150"
            >
              <ArrowLeft size={17} />
              חזור לחנות
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
