import { motion } from 'framer-motion'
import { Heart, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function ProductCard({ product, index }) {
  const { addToCart, toggleFavorite, isFavorite, user, openAuthModal } = useStore()
  const fav = isFavorite(product.id)

  const handleFavorite = (e) => {
    e.preventDefault(); e.stopPropagation()
    if (!user) { openAuthModal(); return }
    toggleFavorite(product)
  }

  const handleAddToCart = (e) => {
    e.preventDefault(); e.stopPropagation()
    addToCart(product)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.48, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:-translate-y-1">

          {/* Image */}
          <div className="relative h-36 sm:h-52 overflow-hidden bg-slate-50">
            <motion.img
              src={product.image}
              alt={product.nameHe}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Subtle bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

            {/* Badge */}
            {product.badge && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-violet-600 text-white text-xs font-bold shadow-sm">
                {product.badge}
              </div>
            )}

            {/* Favorite */}
            <motion.button
              onClick={handleFavorite}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`absolute top-3 left-3 w-9 h-9 flex items-center justify-center rounded-xl shadow-sm transition-all duration-200 ${
                fav
                  ? 'bg-violet-600 text-white opacity-100'
                  : 'bg-white text-slate-400 hover:text-violet-500 opacity-0 group-hover:opacity-100'
              }`}
              aria-label="מועדפים"
            >
              <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
            </motion.button>

            {/* Color dots on hover */}
            {product.colorVariants?.length > 1 && (
              <div className="absolute bottom-3 left-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {product.colorVariants.slice(0, 4).map((v) => (
                  <div
                    key={v.name}
                    className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: v.hex }}
                    title={v.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 pb-4 sm:pb-5">
            <p
              className="hidden sm:block text-xs text-slate-400 mb-0.5 uppercase tracking-widest truncate"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {product.name}
            </p>
            <h3 className="text-slate-900 font-bold text-sm sm:text-base leading-tight line-clamp-2 mb-1 sm:mb-1.5">
              {product.nameHe}
            </h3>
            <p className="hidden sm:block text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4">
              {product.description}
            </p>

            <div className="flex items-center justify-between mt-2 sm:mt-0">
              <span
                className="text-base sm:text-xl font-bold text-slate-900"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                ₪{product.price.toLocaleString()}
              </span>
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-semibold transition-colors duration-150 shadow-violet"
              >
                <Plus size={13} />
                <span>הוסף</span>
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
