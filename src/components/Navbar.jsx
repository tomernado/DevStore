import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Zap, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { categories } from '../data/products'
import { signInWithGoogle } from '../lib/supabase'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const { toggleCart, getCartCount, getFavoritesCount, user, openAuthModal } = useStore()
  const cartCount = getCartCount()
  const favCount = getFavoritesCount()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogin = async () => {
    try { await signInWithGoogle() }
    catch { openAuthModal() }
  }

  const handleCategoryClick = (catId) => {
    navigate('/', { state: { category: catId } })
    setMobileOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 border-b border-slate-200 shadow-sm'
          : 'bg-white/80'
      }`}
      style={{ backdropFilter: 'blur(14px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[68px]">

          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center gap-2 select-none"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-violet">
                <Zap size={15} className="text-white" fill="white" />
              </div>
              <span
                className="text-slate-900 font-bold text-xl tracking-tight"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Dev<span className="text-violet-600">Store</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-2xl px-2 py-1.5">
            <Link
              to="/"
              className="px-4 py-1.5 text-sm text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm rounded-xl transition-all duration-150 font-semibold"
            >
              הכל
            </Link>
            <div className="w-px h-4 bg-slate-200" />
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm rounded-xl transition-all duration-150 font-semibold group"
              >
                <span className="text-base leading-none">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {/* Favorites */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-violet-600 hover:bg-violet-50 transition-all duration-150"
              aria-label="מועדפים"
            >
              <Heart size={20} />
              <AnimatePresence>
                {favCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -left-1 w-5 h-5 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {favCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Cart */}
            <motion.button
              onClick={toggleCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-150"
              aria-label="עגלת קניות"
            >
              <ShoppingCart size={20} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -left-1 w-5 h-5 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Login / User */}
            {user ? (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-xs text-white font-bold">
                  {user.email?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <span className="text-sm text-slate-700 max-w-[120px] truncate">
                  {user.email}
                </span>
              </div>
            ) : (
              <motion.button
                onClick={handleLogin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden md:flex items-center px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors duration-150 shadow-violet"
              >
                התחברות
              </motion.button>
            )}

            {/* Mobile menu */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-slate-100 pb-4"
            >
              <div className="pt-3 flex flex-col gap-1">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="text-right px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                >
                  כל המוצרים
                </Link>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="text-right px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={handleLogin}
                    className="w-full px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-all"
                  >
                    התחברות עם Google
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
