import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Pencil, Plus, X, Package, CheckCircle2, AlertCircle,
  Search, TrendingUp, ShoppingBag, Award, ChevronDown,
  Upload, Link as LinkIcon, Tag, Trash2,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { categories } from '../data/products'

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY = {
  name: '', nameHe: '', price: '', sale_price: '', category: 'peripherals',
  image: '', description: '', badge: '', in_stock: true,
  color_variants: [], specs: [],
}

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
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <p className="text-slate-400 text-[11px] font-semibold mb-0.5">{label}</p>
        <p className="text-slate-900 text-lg font-semibold truncate leading-tight" style={{ direction: 'ltr', textAlign: 'right' }}>{value}</p>
        {sub && <p className="text-slate-400 text-[11px] mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  )
}

// ─── Color Variants Editor ────────────────────────────────────────────────────

function ColorVariantsEditor({ variants, onChange }) {
  const add = () => onChange([...variants, { name: '', hex: '#7c3aed' }])
  const remove = (i) => onChange(variants.filter((_, j) => j !== i))
  const update = (i, field, val) => onChange(variants.map((v, j) => j === i ? { ...v, [field]: val } : v))

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-sm font-semibold text-slate-700">גוני צבע</span>
        <button type="button" onClick={add}
          className="flex items-center gap-1 text-xs text-violet-600 font-bold hover:text-violet-800 transition-colors">
          <Plus size={12} /> הוסף צבע
        </button>
      </div>
      <div className="space-y-2">
        {variants.length === 0 && (
          <div className="text-center py-3 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
            אין צבעים — לחץ "הוסף צבע"
          </div>
        )}
        {variants.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="color"
              value={v.hex || '#7c3aed'}
              onChange={e => update(i, 'hex', e.target.value)}
              className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white flex-shrink-0"
            />
            <input
              value={v.name}
              onChange={e => update(i, 'name', e.target.value)}
              placeholder="שם הצבע (שחור, כסוף...)"
              className={`${inputCls} flex-1`}
            />
            <button type="button" onClick={() => remove(i)}
              className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0 p-1">
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Specs Editor ─────────────────────────────────────────────────────────────

function SpecsEditor({ specs, onChange }) {
  const add = () => onChange([...specs, { key: '', value: '' }])
  const remove = (i) => onChange(specs.filter((_, j) => j !== i))
  const update = (i, field, val) => onChange(specs.map((s, j) => j === i ? { ...s, [field]: val } : s))

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-sm font-semibold text-slate-700">מפרט טכני</span>
        <button type="button" onClick={add}
          className="flex items-center gap-1 text-xs text-violet-600 font-bold hover:text-violet-800 transition-colors">
          <Plus size={12} /> הוסף שורה
        </button>
      </div>
      <div className="space-y-2">
        {specs.length === 0 && (
          <div className="text-center py-3 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
            אין מפרט — לחץ "הוסף שורה"
          </div>
        )}
        {specs.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={s.key}
              onChange={e => update(i, 'key', e.target.value)}
              placeholder="מאפיין (RAM, חיבור...)"
              className={`${inputCls} flex-1`}
            />
            <input
              value={s.value}
              onChange={e => update(i, 'value', e.target.value)}
              placeholder="ערך (16GB, USB-C...)"
              className={`${inputCls} flex-1`}
            />
            <button type="button" onClick={() => remove(i)}
              className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0 p-1">
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Product Modal ────────────────────────────────────────────────────────────

function ProductModal({ initial, isEdit, onSave, onClose }) {
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imageMode, setImageMode] = useState('url')
  const [uploading, setUploading] = useState(false)
  const [tab, setTab] = useState('basic') // 'basic' | 'colors' | 'specs'
  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const fileRef = useRef(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `products/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
    if (error) { console.error(error); setUploading(false); return }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    set('image', data.publicUrl)
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setLoading(true)
    setStatus(null)
    const payload = {
      name: form.name,
      name_he: form.nameHe,
      price: Number(form.price),
      sale_price: form.sale_price !== '' && form.sale_price != null ? Number(form.sale_price) : null,
      category: form.category,
      image: form.image,
      description: form.description,
      badge: form.badge || null,
      in_stock: form.in_stock,
      color_variants: form.color_variants || [],
      specs: form.specs || [],
    }
    const { error } = isEdit
      ? await supabase.from('products').update(payload).eq('id', form.id)
      : await supabase.from('products').insert([payload])
    setLoading(false)
    if (error) { setStatus('error'); console.error(error); return }
    setStatus('success')
    setTimeout(() => { onSave(); onClose() }, 900)
  }

  const TABS = [
    { id: 'basic', label: 'פרטים' },
    { id: 'colors', label: 'צבעים' },
    { id: 'specs', label: 'מפרט' },
  ]

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
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
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

        {/* Tabs */}
        <div className="flex border-b border-slate-100 flex-shrink-0">
          {TABS.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                tab === t.id
                  ? 'text-violet-600 border-b-2 border-violet-600 bg-violet-50/40'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t.label}
              {t.id === 'colors' && form.color_variants.length > 0 && (
                <span className="mr-1.5 text-xs bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full">{form.color_variants.length}</span>
              )}
              {t.id === 'specs' && form.specs.length > 0 && (
                <span className="mr-1.5 text-xs bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full">{form.specs.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-7 py-5 space-y-4">
          {/* ── TAB: Basic ── */}
          {tab === 'basic' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="שם באנגלית" required>
                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Keychron Q1 Pro" required className={inputCls} />
                </Field>
                <Field label="שם בעברית" required>
                  <input value={form.nameHe} onChange={e => set('nameHe', e.target.value)} placeholder="מקלדת מכנית" required className={inputCls} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="מחיר מקורי (₪)" required>
                  <input type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="549" required className={inputCls} />
                </Field>
                <Field label="מחיר מבצע (₪)">
                  <input type="number" min="0" value={form.sale_price} onChange={e => set('sale_price', e.target.value)} placeholder="ריק = ללא מבצע" className={inputCls} />
                </Field>
              </div>

              <Field label="קטגוריה" required>
                <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                  {categories.filter(c => c.id !== 'sale').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </Field>

              <Field label="תמונה" required>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden mb-2 bg-slate-50">
                  <button type="button" onClick={() => setImageMode('url')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-all ${imageMode === 'url' ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                    <LinkIcon size={13} /> קישור URL
                  </button>
                  <button type="button" onClick={() => setImageMode('upload')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-all ${imageMode === 'upload' ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Upload size={13} /> העלאת קובץ
                  </button>
                </div>

                {imageMode === 'url' ? (
                  <input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://images.unsplash.com/..." className={inputCls} />
                ) : (
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-200 rounded-xl py-6 flex flex-col items-center gap-2 cursor-pointer hover:border-violet-400 hover:bg-violet-50/40 transition-all"
                  >
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    {uploading ? (
                      <div className="w-5 h-5 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <Upload size={20} className="text-slate-400" />
                        <span className="text-slate-500 text-xs font-medium">לחץ לבחירת קובץ</span>
                        <span className="text-slate-300 text-xs">PNG, JPG, WEBP</span>
                      </>
                    )}
                  </div>
                )}
              </Field>

              {form.image && (
                <div className="relative">
                  <img src={form.image} alt="preview" className="w-full h-36 object-cover rounded-2xl border border-slate-100" onError={e => e.target.style.display = 'none'} />
                  <button type="button" onClick={() => set('image', '')}
                    className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                    <X size={12} />
                  </button>
                </div>
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
            </>
          )}

          {/* ── TAB: Colors ── */}
          {tab === 'colors' && (
            <ColorVariantsEditor
              variants={form.color_variants}
              onChange={v => set('color_variants', v)}
            />
          )}

          {/* ── TAB: Specs ── */}
          {tab === 'specs' && (
            <SpecsEditor
              specs={form.specs}
              onChange={s => set('specs', s)}
            />
          )}

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
        <div className="px-7 pb-6 pt-3 flex-shrink-0 border-t border-slate-100 space-y-2">
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
          {isEdit && (
            <>
              <button
                type="button"
                disabled={loading}
                onClick={() => { setPin(''); setPinError(false); setShowPinModal(true) }}
                className="w-full py-2.5 rounded-2xl text-red-500 hover:bg-red-50 border border-red-100 hover:border-red-300 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={14} />
                מחק מוצר
              </button>

              <AnimatePresence>
                {showPinModal && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/90 backdrop-blur-sm"
                  >
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 w-72 text-center space-y-4">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                        <Trash2 size={18} className="text-red-500" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">אישור מחיקה</p>
                        <p className="text-slate-400 text-xs mt-1">הזן קוד אישור למחיקת המוצר</p>
                      </div>
                      <input
                        autoFocus
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={pin}
                        onChange={e => { setPin(e.target.value.replace(/\D/g, '')); setPinError(false) }}
                        onKeyDown={async e => {
                          if (e.key !== 'Enter') return
                          if (pin !== '0000') { setPinError(true); setPin(''); return }
                          setShowPinModal(false)
                          setLoading(true)
                          const { error } = await supabase.from('products').delete().eq('id', form.id)
                          setLoading(false)
                          if (error) { console.error(error); setStatus('error'); return }
                          onSave(); onClose()
                        }}
                        placeholder="• • • •"
                        className={`w-full text-center tracking-[0.5em] px-4 py-3 rounded-xl border text-slate-900 text-lg font-bold focus:outline-none focus:ring-2 transition-all ${pinError ? 'border-red-400 ring-red-100 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-violet-400 focus:ring-violet-100'}`}
                      />
                      {pinError && <p className="text-red-500 text-xs">קוד שגוי, נסה שנית</p>}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowPinModal(false)}
                          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                        >
                          ביטול
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (pin !== '0000') { setPinError(true); setPin(''); return }
                            setShowPinModal(false)
                            setLoading(true)
                            const { error } = await supabase.from('products').delete().eq('id', form.id)
                            setLoading(false)
                            if (error) { console.error(error); setStatus('error'); return }
                            onSave(); onClose()
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors"
                        >
                          מחק
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Sale Price Modal ─────────────────────────────────────────────────────────

function SalePriceModal({ product, onSave, onClose }) {
  const [salePrice, setSalePrice] = useState(product.sale_price ?? '')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!salePrice || Number(salePrice) <= 0) return
    setSaving(true)
    await supabase.from('products').update({ sale_price: Number(salePrice) }).eq('id', product.id)
    setSaving(false)
    onSave()
    onClose()
  }

  const removeSale = async () => {
    setSaving(true)
    await supabase.from('products').update({ sale_price: null }).eq('id', product.id)
    setSaving(false)
    onSave()
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-7"
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
            <Tag size={15} className="text-rose-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">הגדרת מבצע</h2>
            <p className="text-slate-400 text-xs truncate max-w-[200px]">{product.name_he || product.name}</p>
          </div>
          <button onClick={onClose} className="mr-auto w-7 h-7 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition-all">
            <X size={15} />
          </button>
        </div>

        <div className="mb-1">
          <p className="text-xs text-slate-500 mb-1">
            מחיר מקורי: <span className="font-semibold text-slate-700">₪{product.price?.toLocaleString()}</span>
          </p>
        </div>

        <div className="relative mb-4">
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">₪</span>
          <input
            type="number"
            min="1"
            max={product.price - 1}
            value={salePrice}
            onChange={e => setSalePrice(e.target.value)}
            placeholder="מחיר מבצע"
            className="w-full pr-9 pl-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
            autoFocus
          />
        </div>

        {salePrice && Number(salePrice) < product.price && (
          <div className="mb-4 px-3 py-2 bg-rose-50 rounded-xl text-xs text-rose-600 font-semibold">
            הנחה: {Math.round((1 - Number(salePrice) / product.price) * 100)}% | חיסכון: ₪{(product.price - Number(salePrice)).toLocaleString()}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={saving || !salePrice || Number(salePrice) >= product.price}
            className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold transition-colors"
          >
            {saving ? 'שומר...' : 'שמור מבצע'}
          </button>
          {product.sale_price && (
            <button
              onClick={removeSale}
              disabled={saving}
              className="px-4 py-3 rounded-xl border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 text-sm font-semibold transition-all"
            >
              <Trash2 size={15} />
            </button>
          )}
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
  const [saleModal, setSaleModal] = useState(null)
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
    data: {
      id: p.id,
      name: p.name,
      nameHe: p.name_he || '',
      price: p.price,
      sale_price: p.sale_price ?? '',
      category: p.category,
      image: p.image || '',
      description: p.description || '',
      badge: p.badge || '',
      in_stock: p.in_stock,
      color_variants: Array.isArray(p.color_variants) ? p.color_variants : [],
      specs: Array.isArray(p.specs) ? p.specs : [],
    },
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

  const saleProducts = products.filter(p => p.sale_price != null)

  const productCategoryLabel = (p) => categories.find(c => c.id === p.category)?.label ?? p.category

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
          <StatCard icon={TrendingUp} label='סה"כ הכנסות' value={`${totalRevenue.toLocaleString()} ₪`} sub={`מ-${orders.length} הזמנות`} color="bg-violet-50 text-violet-600" />
          <StatCard icon={ShoppingBag} label="כמות הזמנות" value={String(orders.length)} sub={`${orders.filter(o => o.status === 'בטיפול').length} ממתינות לטיפול`} color="bg-blue-50 text-blue-600" />
          <StatCard icon={Award} label="המוצר הנמכר ביותר" value={topProduct} color="bg-amber-50 text-amber-600" />
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
            <div className="overflow-x-auto overflow-y-auto max-h-[300px]" style={{ direction: 'rtl' }}>
              <table className="w-full min-w-[600px]" style={{ direction: 'rtl' }}>
                <thead>
                  <tr className="text-right border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 w-32">מזהה הזמנה</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 w-36">תאריך</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500">לקוח</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 w-28">סכום</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 w-32">סטטוס</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o, i) => (
                    <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5 text-xs text-slate-400 font-medium whitespace-nowrap">#{String(o.id).slice(0, 8)}…</td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-slate-700 text-sm">{new Date(o.created_at).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' })}</span>
                        <span className="text-slate-400 text-xs block">{new Date(o.created_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-slate-800 text-sm font-medium block">{o.shipping?.name || '—'}</span>
                        {o.shipping?.phone && <span className="text-slate-400 text-xs">{o.shipping.phone}</span>}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-slate-900 text-sm font-semibold" style={{ direction: 'ltr', display: 'inline-block' }}>{(o.total_amount ?? 0).toLocaleString()} ₪</span>
                      </td>
                      <td className="px-6 py-5">
                        <StatusDropdown orderId={o.id} current={o.status ?? 'בטיפול'} onChange={handleStatusChange} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Active Sales Table ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
                <Tag size={14} className="text-rose-500" />
              </div>
              <h2 className="text-base font-bold text-slate-900">מוצרים במבצע</h2>
            </div>
            <span className="text-xs text-slate-400 font-semibold">{saleProducts.length} פעילים</span>
          </div>

          {saleProducts.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">
              <Tag size={28} className="mx-auto mb-2 text-slate-200" />
              אין מבצעים פעילים — לחץ "% מבצע" ליד מוצר
            </div>
          ) : (
            <div className="overflow-x-auto" style={{ direction: 'rtl' }}>
              <table className="w-full min-w-[500px]" style={{ direction: 'rtl' }}>
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-right">
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500">מוצר</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 w-28">מחיר מקורי</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 w-28">מחיר מבצע</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 w-20">הנחה</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 w-32">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {saleProducts.map(p => {
                    const disc = Math.round((1 - p.sale_price / p.price) * 100)
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {p.image
                              ? <img src={p.image} alt="" className="w-10 h-10 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
                              : <div className="w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0" />
                            }
                            <div>
                              <p className="text-slate-900 font-semibold text-sm leading-tight">{p.name_he || p.name}</p>
                              <p className="text-slate-400 text-xs">{productCategoryLabel(p)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-sm line-through whitespace-nowrap" style={{ fontFamily: 'var(--font-mono)' }}>
                          ₪{p.price?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-rose-600 font-bold text-sm whitespace-nowrap" style={{ fontFamily: 'var(--font-mono)' }}>
                          ₪{p.sale_price?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold">
                            -{disc}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSaleModal(p)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50 text-xs font-semibold transition-all"
                            >
                              <Pencil size={11} /> ערוך
                            </button>
                            <button
                              onClick={async () => {
                                await supabase.from('products').update({ sale_price: null }).eq('id', p.id)
                                loadProducts()
                              }}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 text-xs font-semibold transition-all"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
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
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {p.sale_price ? (
                      <>
                        <span className="text-slate-400 text-xs line-through" style={{ fontFamily: 'var(--font-mono)' }}>₪{p.price?.toLocaleString()}</span>
                        <span className="text-rose-600 text-xs font-bold" style={{ fontFamily: 'var(--font-mono)' }}>₪{p.sale_price?.toLocaleString()}</span>
                      </>
                    ) : (
                      <span className="text-slate-400 text-xs" style={{ fontFamily: 'var(--font-mono)' }}>₪{p.price?.toLocaleString()}</span>
                    )}
                    <span className="text-slate-300 text-xs">·</span>
                    <span className="text-slate-400 text-xs">{productCategoryLabel(p)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-semibold ${p.in_stock ? 'text-emerald-600' : 'text-red-400'}`}>
                      {p.in_stock ? '● במלאי' : '● אזל'}
                    </span>
                    {p.sale_price && (
                      <span className="text-xs bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded-full border border-rose-100">
                        -{Math.round((1 - p.sale_price / p.price) * 100)}% מבצע
                      </span>
                    )}
                    {p.badge && (
                      <span className="text-xs bg-violet-50 text-violet-600 font-semibold px-2 py-0.5 rounded-full border border-violet-100">{p.badge}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <motion.button
                    onClick={() => setSaleModal(p)}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 text-xs font-semibold transition-all"
                    title="הגדר מבצע"
                  >
                    <Tag size={12} />
                    <span className="hidden sm:inline">% מבצע</span>
                  </motion.button>
                  <motion.button
                    onClick={() => openEdit(p)}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-500 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50 text-xs font-semibold transition-all"
                  >
                    <Pencil size={13} />
                    ערוך
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Product Modal ── */}
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

      {/* ── Sale Price Modal ── */}
      <AnimatePresence>
        {saleModal && (
          <SalePriceModal
            key={`sale-${saleModal.id}`}
            product={saleModal}
            onSave={loadProducts}
            onClose={() => setSaleModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
