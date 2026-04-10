import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { categories } from '../data/products'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import ProductCard from './ProductCard'

export default function ProductGrid({ activeCategory, onCategoryChange }) {
  const { searchQuery: navQuery, clearSearch } = useStore()
  const [localQuery, setLocalQuery] = useState('')
  const [allProducts, setAllProducts] = useState([])

  // Use navbar query if active, otherwise local
  const query = navQuery || localQuery

  useEffect(() => {
    supabase.from('products').select('*').eq('in_stock', true).order('created_at', { ascending: true })
      .then(({ data }) => {
        setAllProducts((data ?? []).map(p => ({
          id: p.id,
          name: p.name,
          nameHe: p.name_he || p.name,
          price: p.price,
          salePrice: p.sale_price ?? null,
          category: p.category,
          image: p.image,
          description: p.description,
          badge: p.badge,
          colorVariants: Array.isArray(p.color_variants) ? p.color_variants : [],
          specs: Array.isArray(p.specs) ? p.specs : [],
        })))
      })
  }, [])

  const filtered = allProducts.filter((p) => {
    const matchCat = !activeCategory
      || (activeCategory === 'sale' ? p.salePrice != null : p.category === activeCategory)
    const q = query.trim().toLowerCase()
    const matchQuery = !q ||
      p.nameHe?.toLowerCase().includes(q) ||
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    return matchCat && matchQuery
  })

  const activeLabel = activeCategory
    ? categories.find((c) => c.id === activeCategory)?.label
    : 'כל המוצרים'

  return (
    <section id="products" className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55 }}
          className="mb-10"
        >
          <p
            className="text-violet-600 text-xs uppercase tracking-[0.18em] mb-2 font-semibold"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            קולקציה
          </p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="text-3xl font-extrabold text-slate-900">{activeLabel}</h2>
            <p className="text-slate-400 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
              {filtered.length} מוצרים
            </p>
          </div>
        </motion.div>

        {/* ── Mobile filter panel ── */}
        <div className="md:hidden mb-8 -mx-4">
          {/* Search */}
          <div className="px-4 mb-4">
            <div className="relative">
              <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={navQuery || localQuery}
                onChange={(e) => { setLocalQuery(e.target.value); if (navQuery) clearSearch() }}
                placeholder="חפש מוצר..."
                className="w-full pr-11 pl-10 py-3.5 rounded-2xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none transition-all duration-150"
                style={{
                  background: 'white',
                  border: '1.5px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              />
              {query && (
                <button
                  onClick={() => { setLocalQuery(''); clearSearch() }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Category scroll strip */}
          <div className="overflow-x-auto scrollbar-hide px-4">
            <div className="flex gap-2 pb-1">
              {[{ id: null, label: 'הכל' }, ...categories].map((cat) => {
                const active = cat.id === null ? !activeCategory : activeCategory === cat.id
                return (
                  <motion.button
                    key={cat.id ?? 'all'}
                    onClick={() => onCategoryChange(cat.id)}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
                    style={{
                      background: active
                        ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                        : 'white',
                      color: active ? 'white' : '#64748b',
                      border: active ? 'none' : '1.5px solid #e2e8f0',
                      boxShadow: active
                        ? '0 4px 16px -4px rgba(124,58,237,0.45)'
                        : '0 1px 4px rgba(0,0,0,0.05)',
                    }}
                  >
                    {cat.label}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-slate-400 text-lg font-semibold">לא נמצאו מוצרים</p>
            <p className="text-slate-300 text-sm mt-1">נסה מילת חיפוש אחרת</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
