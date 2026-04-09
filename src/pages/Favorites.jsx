import { motion } from 'framer-motion'
import { Heart, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import ProductCard from '../components/ProductCard'

export default function Favorites() {
  const { favorites } = useStore()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-slate-50 pt-28 pb-16 px-4"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <Link to="/" className="text-slate-400 hover:text-violet-600 transition-colors">
            <ArrowRight size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <Heart size={22} className="text-violet-600" fill="currentColor" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">המועדפים שלי</h1>
          </div>
          <span className="text-slate-400 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
            {favorites.length} פריטים
          </span>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={52} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-semibold">אין מועדפים עדיין</p>
            <p className="text-slate-300 text-sm mt-1 mb-6">לחץ על הלב בכרטיס מוצר כדי להוסיף</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition-colors shadow-violet"
            >
              לחנות
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {favorites.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
