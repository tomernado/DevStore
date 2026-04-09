import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './index.css'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import AuthModal from './components/AuthModal'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Success from './pages/Success'
import Profile from './pages/Profile'
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
      </Routes>
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
