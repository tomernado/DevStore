import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Pencil, Plus, X, Package, CheckCircle2, AlertCircle,
  Search, TrendingUp, ShoppingBag, Award, ChevronDown,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { categories } from '../data/products'

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY = { name: '', nameHe: '', price: '', category: 'peripherals', image: '', description: '', badge: '', in_stock: true }

const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all'

const ORDER_STATUSES = ['בטיפול', 'נשלח', 'הושלם']

const STATUS_STYLE = {
  'בטיפול': 'bg-amber-50 text-amber-700 border-amber-200',
  'נשלח':   'bg-blue-50 text-blue-700 border-blue-200',
  'הושלם':  'bg-emerald-50 text-emerald-700 border-emerald-200',
}

// ─── Small helpers ────────────────────────────────────────────────────────────

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

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-start gap-4"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-slate-900 text-2xl font-extrabold tracking-tight truncate">{value}</p>
        {sub && <p className="text-slate-400 text-xs mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  )
}

// ─── Product Modal ────────────────────────────────────────────────────────────

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
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
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
              {isEdit ? <Pencil size={15} className="text-amber-500" /> : <Plus size={15} className="text-violet-600" />}
            </div>
            <h2 className="text-base font-bold text-slate-900">{isEdit ? 'עריכת מוצר' : 'הוספת מוצר חדש'}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
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
            <img src={form.image} alt="preview" className="w-full h-36 object-cover rounded-2xl border border-slate-100" onError={e => e.target.style.display = 'none'} />
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
              <CheckCircle2 size={16} />{isEdit ? 'המוצר עודכן בהצלחה!' : 'המוצר נוסף בהצלחה!'}
            </motion.div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold text-sm">
              <AlertCircle size={16} />שגיאה — בדוק את הקונסול
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-7 pb-6 pt-3 flex-shrink-0 border-t border-slate-100">
          <motion.button
            onClick={handleSubmit}
            disabled={loading || status === 'success'}
            whileHover={loading ? {} : { scale: 1.02 }}
            whileTap={loading ? {} : { scale: 0.98 }}
            className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-colors ${
              loading || status === 'success' ? 'bg-violet-400 cursor-not-allowed'
                : isEdit ? 'bg-amber-500 hover:bg-amber-600' : 'bg-violet-600 hover:bg-violet-700'
            }`}
          >
            {loading ? 'שומר...' : status === 'success' ? '✓ נשמר' : isEdit ? 'שמור שינויים' : 'הוסף מוצר'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Status Dropdown ──────────────────────────────────────────────────────────

function StatusDropdown({ orderId, current, onChange }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const select = async (s) => {
    if (s === current) { setOpen(false); return }
    setSaving(true)
    await supabase.from('orders').update({ status: s }).eq('id', orderId)
    setSaving(false)
    setOpen(false)
    onChange(orderId, s)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={saving}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${STATUS_STYLE[current] ?? 'bg-slate-50 text-slate-600 border-slate-200'} ${saving ? 'opacity-60' : 'hover:opacity-80'}`}
      >
        {saving ? '...' : current}
        <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full mt-1 w-28 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-20"
          >
            {ORDER_STATUSES.map(s => (
              <button
                key={s}
                onClick={() => select(s)}
                className={`w-full text-right px-3 py-2 text-xs font-semibold transition-colors ${s === current ? 'bg-slate-50 text-slate-400' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Admin() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')

  const loadProducts = () =>
    supabase.from('products').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setProducts(data ?? []))

  const loadOrders = () =>
    supabase.from('orders').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setOrders(data ?? []))

  useEffect(() => { loadProducts(); loadOrders() }, [])

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalRevenue = orders.reduce((s, o) => s + (o.total_amount ?? 0), 0)

  const topProduct = (() => {
    const freq = {}
    orders.forEach(o => {
      (o.items ?? []).forEach(item => {
        const name = item.nameHe || item.name || 'לא ידוע'
        freq[name] = (freq[name] ?? 0) + (item.quantity ?? 1)
      })
    })
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1])
    return sorted[0] ? `${sorted[0][0]} (${sorted[0][1]})` : '—'
  })()

  // ── Product modal helpers ──────────────────────────────────────────────────
  const openAdd = () => setModal({ mode: 'add', data: EMPTY })
  const openEdit = (p) => setModal({
    mode: 'edit',
    data: { id: p.id, name: p.name, nameHe: p.name_he || '', price: p.price, category: p.category, image: p.image || '', description: p.description || '', badge: p.badge || '', in_stock: p.in_stock },
  })
  const closeModal = () => setModal(null)

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
  }

  // ── Product filtering ──────────────────────────────────────────────────────
  const filtered = products.filter(p => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return p.name?.toLowerCase().includes(q) || p.name_he?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q) || p.badge?.toLowerCase().includes(q)
  })

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 px-4">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* ── Page title ── */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">לוח בקרה</h1>
          <p className="text-slate-400 text-sm mt-0.5">ניהול הזמנות, מוצרים וסטטיסטיקות</p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={TrendingUp}
            label='סה"כ הכנסות'
            value={`₪${totalRevenue.toLocaleString()}`}
            sub={`מ-${orders.length} הזמנות`}
            color="bg-violet-50 text-violet-600"
          />
          <StatCard
            icon={ShoppingBag}
            label="כמות הזמנות"
            value={orders.length}
            sub={`${orders.filter(o => o.status === 'בטיפול').length} ממתינות לטיפול`}
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            icon={Award}
            label="המוצר הנמכר ביותר"
            value={topProduct}
            color="bg-amber-50 text-amber-600"
          />
        </div>

        {/* ── Orders ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">הזמנות</h2>
            <span className="text-xs text-slate-400 font-semibold">{orders.length} סה"כ</span>
          </div>

          {orders.length === 0 ? (
            <div className="py-14 text-center text-slate-400 text-sm">אין הזמנות עדיין</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-right border-b border-slate-100">
                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">מזהה</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">תאריך</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">לקוח</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">סכום</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">סטטוס</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map((o, i) => (
                    <motion.tr
                      key={o.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-6 py-3.5 font-mono text-xs text-slate-400">
                        #{String(o.id).slice(0, 8)}…
                      </td>
                      <td className="px-6 py-3.5 text-slate-600 text-xs whitespace-nowrap">
                        {new Date(o.created_at).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-3.5 text-slate-700 text-xs max-w-[140px] truncate">
                        {o.shipping?.name || o.shipping?.email || '—'}
                      </td>
                      <td className="px-6 py-3.5 font-bold text-slate-900 font-mono text-sm">
                        ₪{(o.total_amount ?? 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusDropdown
                          orderId={o.id}
                          current={o.status ?? 'בטיפול'}
                          onChange={handleStatusChange}
                        />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Products ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-base font-bold text-slate-900">מוצרים</h2>
              <p className="text-slate-400 text-xs mt-0.5">{products.length} מוצרים במערכת</p>
            </div>
            <motion.button
              onClick={openAdd}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors shadow-sm"
            >
              <Plus size={15} />
              מוצר חדש
            </motion.button>
          </div>

          {/* Search */}
          <div className="px-6 py-3 border-b border-slate-100">
            <div className="relative">
              <Search size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="חפש לפי שם, קטגוריה או תווית..."
                className="w-full pr-10 pl-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-slate-50">
            {products.length === 0 && (
              <div className="py-14 text-center">
                <Package size={36} className="text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm font-semibold">אין מוצרים עדיין</p>
                <button onClick={openAdd} className="mt-2 text-violet-600 text-sm font-bold hover:underline">הוסף את המוצר הראשון</button>
              </div>
            )}
            {products.length > 0 && filtered.length === 0 && (
              <div className="py-10 text-center text-slate-400 text-sm">לא נמצאו מוצרים עבור "{search}"</div>
            )}
            {filtered.map(p => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                {p.image
                  ? <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-slate-100" />
                  : <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center"><Package size={18} className="text-slate-300" /></div>
                }
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{p.name_he || p.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    ₪{p.price?.toLocaleString()} · {categories.find(c => c.id === p.category)?.label ?? p.category}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-semibold ${p.in_stock ? 'text-emerald-600' : 'text-red-400'}`}>
                      {p.in_stock ? '● במלאי' : '● אזל'}
                    </span>
                    {p.badge && (
                      <span className="text-xs bg-violet-50 text-violet-600 font-semibold px-2 py-0.5 rounded-full border border-violet-100">{p.badge}</span>
                    )}
                  </div>
                </div>
                <motion.button
                  onClick={() => openEdit(p)}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-500 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50 text-xs font-semibold transition-all flex-shrink-0"
                >
                  <Pencil size={13} />
                  ערוך
                </motion.button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {modal && (
          <ProductModal
            key={modal.mode === 'edit' ? `edit-${modal.data.id}` : 'add'}
            initial={modal.data}
            isEdit={modal.mode === 'edit'}
            onSave={() => { loadProducts(); loadOrders() }}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
