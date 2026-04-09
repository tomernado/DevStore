import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import './index.css'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import AuthModal from './components/AuthModal'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Success from './pages/Success'
import Profile from './pages/Profile'
import Favorites from './pages/Favorites'
import Admin from './pages/Admin'
import { supabase } from './lib/supabase'
import { useStore } from './store/useStore'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/success" element={<Success />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  )
}

function AdminFab() {
  const { user } = useStore()
  const location = useLocation()
  const show = user && location.pathname === '/'
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 left-6 z-40"
        >
          <Link to="/admin">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white text-sm font-bold shadow-lg transition-colors backdrop-blur-sm border border-slate-700"
            >
              <Settings size={15} />
              ערוך חנות
            </motion.button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function AppShell() {
  const { setUser, clearUser } = useStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      session?.user ? setUser(session.user) : clearUser()
    })
    return () => subscription.unsubscribe()
  }, [setUser, clearUser])

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <ScrollToTop />
      <Navbar />
      <AnimatedRoutes />
      <CartDrawer />
      <AuthModal />
      <AdminFab />

      <footer className="bg-slate-50 border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-900 font-bold text-xl" style={{ fontFamily: 'var(--font-mono)' }}>
              Dev<span className="text-violet-600">Store</span>
            </div>
            <p className="text-slate-400 text-sm">© 2025 DevStore · כל הזכויות שמורות</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppShell />
    </BrowserRouter>
  )
}
