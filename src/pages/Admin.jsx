import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Plus, X, Package, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { categories } from '../data/products'

const EMPTY = { name: '', nameHe: '', price: '', category: 'peripherals', image: '', description: '', badge: '', in_stock: true }

const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all'

function Field({ label, children, required }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}{required && <span className="text-red-400 mr-1">*</span>}
        </label>
      )}
      {children}
    </div>
  )
}

function ProductModal({ initial, isEdit, onSave, onClose }) {
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    const payload = {
      name: form.name,
      name_he: form.nameHe,
      price: Number(form.price),
      category: form.category,
      image: form.image,
      description: form.description,
      badge: form.badge || null,
      in_stock: form.in_stock,
    }
    const { error } = isEdit
      ? await supabase.from('products').update(payload).eq('id', form.id)
      : await supabase.from('products').insert([payload])
    setLoading(false)
    if (error) { setStatus('error'); console.error(error); return }
    setStatus('success')
    setTimeout(() => { onSave(); onClose() }, 900)
  }

  return (
    // Backdrop
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isEdit ? 'bg-amber-50' : 'bg-violet-50'}`}>
              {isEdit
                ? <Pencil size={15} className="text-amber-500" />
                : <Plus size={15} className="text-violet-600" />
              }
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {isEdit ? 'עריכת מוצר' : 'הוספת מוצר חדש'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-7 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="שם באנגלית" required>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Keychron Q1 Pro" required className={inputCls} />
            </Field>
            <Field label="שם בעברית" required>
              <input value={form.nameHe} onChange={e => set('nameHe', e.target.value)} placeholder="מקלדת מכנית" required className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="מחיר (₪)" required>
              <input type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="549" required className={inputCls} />
            </Field>
            <Field label="קטגוריה" required>
              <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </Field>
          </div>

          <Field label="כתובת תמונה (URL)" required>
            <input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://images.unsplash.com/..." required className={inputCls} />
          </Field>

          {form.image && (
            <img
              src={form.image}
              alt="preview"
              className="w-full h-36 object-cover rounded-2xl border border-slate-100"
              onError={e => e.target.style.display = 'none'}
            />
          )}

          <Field label="תיאור">
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="תיאור המוצר בעברית..." className={`${inputCls} resize-none`} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="תווית (badge)">
              <input value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="חדש / מומלץ / מבצע" className={inputCls} />
            </Field>
            <Field label="">
              <label className="flex items-center gap-3 cursor-pointer mt-6">
                <input type="checkbox" checked={form.in_stock} onChange={e => set('in_stock', e.target.checked)} className="w-4 h-4 accent-violet-600" />
                <span className="text-slate-700 font-medium text-sm">במלאי</span>
              </label>
            </Field>
          </div>

          {status === 'success' && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-sm">
              <CheckCircle2 size={16} />
              {isEdit ? 'המוצר עודכן בהצלחה!' : 'המוצר נוסף בהצלחה!'}
            </motion.div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold text-sm">
              <AlertCircle size={16} />
              שגיאה — בדוק את הקונסול
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-7 pb-6 pt-3 flex-shrink-0 border-t border-slate-100">
          <motion.button
            type="submit"
            form="product-form-inner"
            onClick={handleSubmit}
            disabled={loading || status === 'success'}
            whileHover={loading ? {} : { scale: 1.02 }}
            whileTap={loading ? {} : { scale: 0.98 }}
            className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-colors ${
              loading || status === 'success'
                ? 'bg-violet-400 cursor-not-allowed'
                : isEdit
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-violet-600 hover:bg-violet-700'
            }`}
          >
            {loading ? 'שומר...' : status === 'success' ? '✓ נשמר' : isEdit ? 'שמור שינויים' : 'הוסף מוצר'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Admin() {
  const [products, setProducts] = useState([])
  const [modal, setModal] = useState(null) // null | { mode: 'add' | 'edit', data: object }

  const load = () =>
    supabase.from('products').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setProducts(data ?? []))

  useEffect(() => { load() }, [])

  const openAdd = () => setModal({ mode: 'add', data: EMPTY })

  const openEdit = (p) => setModal({
    mode: 'edit',
    data: {
      id: p.id,
      name: p.name,
      nameHe: p.name_he || '',
      price: p.price,
      category: p.category,
      image: p.image || '',
      description: p.description || '',
      badge: p.badge || '',
      in_stock: p.in_stock,
    }
  })

  const closeModal = () => setModal(null)

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">ניהול מוצרים</h1>
            <p className="text-slate-400 text-sm mt-0.5">{products.length} מוצרים במערכת</p>
          </div>
          <motion.button
            onClick={openAdd}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors shadow-sm"
          >
            <Plus size={16} />
            מוצר חדש
          </motion.button>
        </div>

        {/* Product list */}
        <div className="space-y-2.5">
          {products.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <Package size={40} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-semibold">אין מוצרים עדיין</p>
              <button onClick={openAdd} className="mt-3 text-violet-600 text-sm font-bold hover:underline">
                הוסף את המוצר הראשון
              </button>
            </div>
          )}

          {products.map(p => (
            <motion.div key={p.id} layout
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4 group"
            >
              {p.image
                ? <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-slate-100" />
                : <div className="w-14 h-14 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center"><Package size={20} className="text-slate-300" /></div>
              }
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 text-sm truncate">{p.name_he || p.name}</p>
                <p className="text-slate-400 text-xs mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
                  ₪{p.price?.toLocaleString()} · {categories.find(c => c.id === p.category)?.label ?? p.category}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-semibold ${p.in_stock ? 'text-emerald-600' : 'text-red-400'}`}>
                    {p.in_stock ? '● במלאי' : '● אזל'}
                  </span>
                  {p.badge && (
                    <span className="text-xs bg-violet-50 text-violet-600 font-semibold px-2 py-0.5 rounded-full border border-violet-100">
                      {p.badge}
                    </span>
                  )}
                </div>
              </div>
              <motion.button
                onClick={() => openEdit(p)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-500 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50 text-xs font-semibold transition-all"
              >
                <Pencil size={13} />
                ערוך
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <ProductModal
            key={modal.mode === 'edit' ? `edit-${modal.data.id}` : 'add'}
            initial={modal.data}
            isEdit={modal.mode === 'edit'}
            onSave={load}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
