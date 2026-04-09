import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { categories } from '../data/products'

const EMPTY = { name: '', nameHe: '', price: '', category: 'peripherals', image: '', description: '', badge: '', in_stock: true }

export default function Admin() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState(null) // 'success' | 'error'
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    const { error } = await supabase.from('products').insert([{
      name: form.name,
      name_he: form.nameHe,
      price: Number(form.price),
      category: form.category,
      image: form.image,
      description: form.description,
      badge: form.badge || null,
      in_stock: form.in_stock,
    }])
    setLoading(false)
    if (error) { setStatus('error'); console.error(error); return }
    setStatus('success')
    setForm(EMPTY)
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-8">ניהול — הוספת מוצר</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-5">

          <div className="grid grid-cols-2 gap-4">
            <Field label="שם באנגלית" required>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Keychron Q1 Pro" required className={input} />
            </Field>
            <Field label="שם בעברית" required>
              <input value={form.nameHe} onChange={e => set('nameHe', e.target.value)} placeholder="מקלדת מכנית" required className={input} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="מחיר (₪)" required>
              <input type="number" min="1" value={form.price} onChange={e => set('price', e.target.value)} placeholder="549" required className={input} />
            </Field>
            <Field label="קטגוריה" required>
              <select value={form.category} onChange={e => set('category', e.target.value)} className={input}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </Field>
          </div>

          <Field label="כתובת תמונה (URL)" required>
            <input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://images.unsplash.com/..." required className={input} />
          </Field>

          {form.image && (
            <img src={form.image} alt="preview" className="w-full h-48 object-cover rounded-2xl border border-slate-100" onError={e => e.target.style.display='none'} />
          )}

          <Field label="תיאור">
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="תיאור המוצר בעברית..." className={`${input} resize-none`} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="תווית (badge)">
              <input value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="חדש / מומלץ / מבצע" className={input} />
            </Field>
            <Field label="">
              <label className="flex items-center gap-3 cursor-pointer mt-6">
                <input type="checkbox" checked={form.in_stock} onChange={e => set('in_stock', e.target.checked)} className="w-4 h-4 accent-violet-600" />
                <span className="text-slate-700 font-medium text-sm">במלאי</span>
              </label>
            </Field>
          </div>

          {status === 'success' && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-sm">
              המוצר נוסף בהצלחה!
            </motion.div>
          )}
          {status === 'error' && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold text-sm">
              שגיאה בהוספת המוצר — בדוק את הקונסול
            </div>
          )}

          <motion.button type="submit" disabled={loading}
            whileHover={loading ? {} : { scale: 1.02 }} whileTap={loading ? {} : { scale: 0.98 }}
            className={`w-full py-4 rounded-2xl text-white font-bold text-base transition-colors shadow-violet ${loading ? 'bg-violet-400 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'}`}>
            {loading ? 'מוסיף...' : 'הוסף מוצר'}
          </motion.button>
        </form>
      </div>
    </div>
  )
}

const input = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all'

function Field({ label, children, required }) {
  return (
    <div>
      {label && <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}{required && <span className="text-red-400 mr-1">*</span>}</label>}
      {children}
    </div>
  )
}
