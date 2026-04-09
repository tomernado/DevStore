import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Phone, MapPin, ChevronLeft } from 'lucide-react'

const FIELDS = [
  { key: 'name',    label: 'שם מלא',          icon: User,    type: 'text',  placeholder: 'ישראל ישראלי' },
  { key: 'email',   label: 'כתובת מייל',       icon: Mail,    type: 'email', placeholder: 'israel@email.com' },
  { key: 'phone',   label: 'מספר טלפון',       icon: Phone,   type: 'tel',   placeholder: '050-0000000' },
  { key: 'address', label: 'כתובת מגורים',     icon: MapPin,  type: 'text',  placeholder: 'רחוב הרצל 1, תל אביב' },
]

export default function ShippingModal({ onConfirm, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'שדה חובה'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'מייל לא תקין'
    if (!form.phone.trim()) e.phone = 'שדה חובה'
    if (!form.address.trim()) e.address = 'שדה חובה'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onConfirm(form)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-slate-900/50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <h2 className="text-slate-900 font-bold text-lg">פרטי משלוח</h2>
              <p className="text-slate-400 text-xs mt-0.5">נדרש לפני המעבר לתשלום</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {FIELDS.map(({ key, label, icon: Icon, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                      setErrors((er) => ({ ...er, [key]: undefined }))
                    }}
                    placeholder={placeholder}
                    className={`w-full pr-10 pl-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors[key]
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-slate-200 focus:border-violet-400 focus:ring-violet-100'
                    }`}
                  />
                </div>
                {errors[key] && (
                  <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
                )}
              </div>
            ))}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-base shadow-violet transition-colors duration-150 mt-2"
            >
              <span>המשך לתשלום</span>
              <ChevronLeft size={18} />
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
