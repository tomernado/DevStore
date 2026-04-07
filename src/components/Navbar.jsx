import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Zap, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { categories } from '../data/products'
import { signInWithGoogle } from '../lib/supabase'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const { toggleCart, getCartCount, getFavoritesCount, user, openAuthModal } = useStore()
  const cartCount = getCartCount()
  const favCount = getFavoritesCount()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Reset active pill when navigating away from home
  useEffect(() => {
    if (location.pathname !== '/') setActiveCategory(null)
    else if (location.state?.category !== undefined) setActiveCategory(location.state.category)
  }, [location])

  const handleLogin = async () => {
    try { await signInWithGoogle() }
    catch { openAuthModal() }
  }

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId)
    navigate('/', { state: { category: catId } })
    setMobileOpen(false)
  }

  const handleAll = () => {
    setActiveCategory(null)
    navigate('/', { state: { category: null } })
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/96 border-b border-slate-200/80 shadow-sm'
          : 'bg-white/85'
      }`}
      style={{ backdropFilter: 'blur(18px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          {/* ── Logo ───────────────────────────────────────────── */}
          <Link to="/" onClick={handleAll}>
            <motion.div
              className="flex items-center gap-2.5 select-none"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Icon */}
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-violet flex-shrink-0">
                <Zap size={17} className="text-white" fill="white" />
              </div>
              {/* Wordmark */}
              <div className="flex flex-col leading-none">
                <span
                  className="text-[22px] font-extrabold tracking-[-0.04em] text-slate-900 leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Dev<span className="text-violet-600">Store</span>
                </span>
                <span
                  className="text-[9px] tracking-[0.22em] text-slate-400 uppercase mt-0.5"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Premium Gear
                </span>
              </div>
            </motion.div>
          </Link>

          {/* ── Desktop nav ─────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-0.5">
            {/* "הכל" pill */}
            <NavPill
              active={activeCategory === null && location.pathname === '/'}
              onClick={handleAll}
            >
              הכל
            </NavPill>

            {/* Thin divider */}
            <div className="w-px h-5 bg-slate-200 mx-1" />

            {categories.map((cat) => (
              <NavPill
                key={cat.id}
                active={activeCategory === cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                icon={cat.icon}
              >
                {cat.label}
              </NavPill>
            ))}
          </nav>

          {/* ── Right actions ───────────────────────────────────── */}
          <div className="flex items-center gap-1">
            {/* Favorites */}
            <IconButton
              onClick={() => {}}
              label="מועדפים"
              badge={favCount}
              className="hover:text-violet-600 hover:bg-violet-50"
            >
              <Heart size={19} />
            </IconButton>

            {/* Cart */}
            <IconButton
              onClick={toggleCart}
              label="עגלת קניות"
              badge={cartCount}
              className="hover:text-slate-900 hover:bg-slate-100"
            >
              <ShoppingCart size={19} />
            </IconButton>

            {/* Login / User */}
            {user ? (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 mr-1">
                <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-xs text-white font-bold">
                  {user.email?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <span className="text-sm text-slate-700 max-w-[110px] truncate font-medium">
                  {user.email}
                </span>
              </div>
            ) : (
              <motion.button
                onClick={handleLogin}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-violet-600 text-white text-sm font-bold tracking-tight transition-colors duration-200 mr-1"
              >
                <span>התחברות</span>
              </motion.button>
            )}

            {/* Mobile toggle */}
            <motion.button
              whileTap={{ scale: 0.93 }}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <AnimatePresence mode="wait">
                {mobileOpen
                  ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}><X size={20} /></motion.span>
                  : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}><Menu size={20} /></motion.span>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* ── Mobile panel ────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="md:hidden overflow-hidden border-t border-slate-100"
            >
              <div className="py-4 flex flex-col gap-1">
                <Link
                  to="/"
                  onClick={() => { handleAll(); setMobileOpen(false) }}
                  className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all font-semibold text-base"
                >
                  <span className="text-lg">🛍️</span>
                  <span>כל המוצרים</span>
                </Link>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all font-semibold text-base text-right w-full"
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={handleLogin}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 hover:bg-violet-600 text-white text-sm font-bold tracking-tight transition-colors"
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

/* ── Sub-components ──────────────────────────────────────────────── */

function NavPill({ children, active, onClick, icon }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-[15px] font-semibold transition-all duration-150 ${
        active
          ? 'text-violet-700 bg-violet-50'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      {icon && <span className="text-base leading-none">{icon}</span>}
      {children}
      {active && (
        <motion.div
          layoutId="nav-active-indicator"
          className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-violet-600"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </motion.button>
  )
}

function IconButton({ children, onClick, label, badge, className = '' }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.93 }}
      className={`relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 transition-all duration-150 ${className}`}
      aria-label={label}
    >
      {children}
      <AnimatePresence>
        {badge > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -left-1 w-5 h-5 bg-violet-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {badge}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
