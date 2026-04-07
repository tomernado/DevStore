import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'

export default function Home() {
  const location = useLocation()
  const [activeCategory, setActiveCategory] = useState(
    location.state?.category ?? null
  )
  const productsRef = useRef(null)

  // If Navbar navigates here with a category, apply it and scroll
  useEffect(() => {
    if (location.state?.category !== undefined) {
      setActiveCategory(location.state.category)
      if (location.state.category) {
        setTimeout(() => {
          productsRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [location.state])

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Hero onShopNow={scrollToProducts} />
      <div ref={productsRef}>
        <ProductGrid
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>
    </motion.div>
  )
}
