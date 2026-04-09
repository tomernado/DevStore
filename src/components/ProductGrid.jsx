import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { products as staticProducts, categories } from '../data/products'
import { supabase } from '../lib/supabase'
import ProductCard from './ProductCard'

export default function ProductGrid({ activeCategory, onCategoryChange }) {
  const [query, setQuery] = useState('')
  const [dbProducts, setDbProducts] = useState([])

  useEffect(() => {
    supabase.from('products').select('*').eq('in_stock', true).then(({ data }) => {
      if (data?.length) setDbProducts(data.map(p => ({
        id: `db-${p.id}`,
        name: p.name,
        nameHe: p.name_he || p.name,
        price: p.price,
        category: p.category,
        image: p.image,
        description: p.description,
        badge: p.badge,
      })))
    })
  }, [])

  const allProducts = [...staticProducts, ...dbProducts]

  const filtered = allProducts.filter((p) => {
    const matchCat = !activeCategory || p.category === activeCategory
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

        {/* Category filter pills — horizontally scrollable on mobile */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            onClick={() => onCategoryChange(null)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 border ${
              !activeCategory
                ? 'bg-violet-600 border-violet-600 text-white shadow-violet'
                : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 bg-white'
            }`}
          >
            הכל
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 border ${
                activeCategory === cat.id
                  ? 'bg-violet-600 border-violet-600 text-white shadow-violet'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 bg-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative mb-8">
          <Search size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חפש מוצר..."
            className="w-full pr-11 pl-10 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all duration-150"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X size={15} />
            </button>
          )}
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
