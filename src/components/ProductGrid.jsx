import { motion } from 'framer-motion'
import { products, categories } from '../data/products'
import ProductCard from './ProductCard'

export default function ProductGrid({ activeCategory, onCategoryChange }) {
  const filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products

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

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 border ${
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
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 border ${
                activeCategory === cat.id
                  ? 'bg-violet-600 border-violet-600 text-white shadow-violet'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 bg-white'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
