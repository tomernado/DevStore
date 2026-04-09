import { useRef } from 'react'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import { useStore } from '../store/useStore'

export default function Home() {
  const { activeCategory, setActiveCategory } = useStore()
  const productsRef = useRef(null)

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    if (cat) {
      setTimeout(() => productsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
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
          onCategoryChange={handleCategoryChange}
        />
      </div>
    </motion.div>
  )
}
