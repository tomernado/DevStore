import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Zap, Menu, X, Search } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { categories } from '../data/products'
import { signInWithGoogle, signOut } from '../lib/supabase'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef(null)
  const userMenuRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const { toggleCart, getCartCount, getFavoritesCount, user, openAuthModal, searchQuery, setSearchQuery, clearSearch, activeCategory, setActiveCategory } = useStore()
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
  }, [location.pathname])

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [searchOpen])

  const openSearch = () => {
    setSearchOpen(true)
    navigate('/', { state: { category: activeCategory } })
  }

  const closeSearch = () => {
    setSearchOpen(false)
    clearSearch()
  }

  const handleLogin = async () => {
    try { await signInWithGoogle() }
    catch { openAuthModal() }
  }

  const handleLogout = async () => {
    try { await signOut() }
    catch (e) { console.error(e) }
    setUserMenuOpen(false)
  }

  // Close user menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId)
    navigate('/')
    setMobileOpen(false)
  }

  const handleAll = () => {
    setActiveCategory(null)
    navigate('/')
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
          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center px-4">
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.div
                  key="search-bar"
                  initial={{ opacity: 0, scaleX: 0.85 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0.85 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center w-full max-w-sm relative"
                >
                  <Search size={15} className="absolute right-3 text-violet-500 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="חפש מוצר..."
                    className="w-full pr-9 pl-8 py-2 rounded-xl border border-violet-300 bg-violet-50 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                  />
                  {searchQuery && (
                    <button onClick={clearSearch} className="absolute left-3 text-slate-400 hover:text-slate-700 transition-colors">
                      <X size={13} />
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="nav-pills"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-0.5"
                >
                  <NavPill
                    active={activeCategory === null && location.pathname === '/'}
                    onClick={handleAll}
                  >
                    הכל
                  </NavPill>
                  <div className="w-px h-5 bg-slate-200 mx-1" />
                  {categories.map((cat) => (
                    <NavPill
                      key={cat.id}
                      active={activeCategory === cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                    >
                      {cat.label}
                    </NavPill>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

          {/* ── Right actions ───────────────────────────────────── */}
          <div className="flex items-center gap-1">
            {/* Search toggle */}
            <motion.button
              onClick={searchOpen ? closeSearch : openSearch}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.93 }}
              className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 ${
                searchOpen
                  ? 'text-violet-600 bg-violet-50'
                  : 'text-slate-500 hover:text-violet-600 hover:bg-violet-50'
              }`}
              aria-label="חיפוש"
            >
              <AnimatePresence mode="wait">
                {searchOpen
                  ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}><X size={18} /></motion.span>
                  : <motion.span key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}><Search size={18} /></motion.span>
                }
              </AnimatePresence>
              {searchQuery && !searchOpen && (
                <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-violet-600 rounded-full" />
              )}
            </motion.button>

            {/* Favorites */}
            <IconButton
              onClick={() => navigate('/favorites')}
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
              <div className="hidden md:block relative mr-1" ref={userMenuRef}>
                <motion.button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                    {user.email?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span className="text-sm text-slate-700 max-w-[110px] truncate font-medium">
                    {user.email}
                  </span>
                  <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden z-50"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        הפרופיל שלי
                      </Link>
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-semibold transition-colors border-t border-slate-100"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        ניהול
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 font-semibold transition-colors border-t border-slate-100"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                        </svg>
                        התנתקות
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
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

        {/* ── Mobile search bar ───────────────────────────────── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-violet-100 bg-violet-50/60"
            >
              <div className="px-4 py-3 relative">
                <Search size={15} className="absolute right-7 top-1/2 -translate-y-1/2 text-violet-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="חפש מוצר..."
                  autoFocus
                  className="w-full pr-9 pl-8 py-2.5 rounded-xl border border-violet-200 bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                />
                {searchQuery && (
                  <button onClick={clearSearch} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                    <span>{cat.label}</span>
                  </button>
                ))}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 px-4 py-2">
                        <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                          {user.email?.[0]?.toUpperCase() ?? 'U'}
                        </div>
                        <span className="text-sm text-slate-600 truncate">{user.email}</span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-sm font-bold tracking-tight transition-colors"
                      >
                        הפרופיל שלי
                      </Link>
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold tracking-tight transition-colors"
                      >
                        ניהול
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-sm font-bold tracking-tight transition-colors"
                      >
                        התנתקות
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleLogin}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 hover:bg-violet-600 text-white text-sm font-bold tracking-tight transition-colors"
                    >
                      התחברות עם Google
                    </button>
                  )}
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

function NavPill({ children, active, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className={`relative flex items-center px-4 py-2 rounded-xl text-[15px] font-bold tracking-tight transition-all duration-150 ${
        active
          ? 'text-violet-700 bg-violet-50'
          : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
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
