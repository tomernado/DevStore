import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { products } from '../data/products'

export default function RelatedProducts({ category, currentId }) {
  const related = products
    .filter((p) => p.category === category && p.id !== currentId)
    .slice(0, 4)

  if (related.length === 0) return null

  return (
    <section className="mt-20 pt-12 border-t border-slate-100">
      <h2 className="text-xl font-bold text-slate-900 mb-8">אולי תאהב גם...</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {related.map((p, i) => (
          <Link key={p.id} to={`/product/${p.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md overflow-hidden transition-all duration-300"
            >
              {/* Image */}
              <div className="h-36 overflow-hidden bg-slate-50">
                <motion.img
                  src={p.image}
                  alt={p.nameHe}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.45 }}
                />
              </div>

              {/* Info */}
              <div className="p-3">
                <p
                  className="text-slate-400 text-[10px] uppercase tracking-widest mb-0.5 truncate"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {p.name}
                </p>
                <p className="text-slate-900 font-semibold text-sm leading-tight line-clamp-1">
                  {p.nameHe}
                </p>
                <p
                  className="text-violet-600 font-bold text-sm mt-1.5"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  ₪{p.price.toLocaleString()}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  )
}
