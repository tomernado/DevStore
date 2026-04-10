import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const featured = [
  {
    id: 1, emoji: '⌨️', name: 'Keychron Q1 Pro', nameHe: 'מקלדת מכנית Hall Effect', price: 549,
    image: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&w=1000&q=85',
    tag: 'הנמכר ביותר', color: '#7c3aed',
  },
  {
    id: 14, emoji: '🪑', name: 'Herman Miller Aeron', nameHe: 'כיסא ארגונומי אייקוני', price: 3999,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=1000&q=85',
    tag: 'השקעה לחיים', color: '#0d9488',
  },
  {
    id: 9, emoji: '🖥️', name: 'LG UltraFine 5K', nameHe: 'מסך 5K Thunderbolt 4', price: 2149,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=85',
    tag: 'פרמיום', color: '#1d4ed8',
  },
  {
    id: 21, emoji: '🎧', name: 'Jabra Evolve2 85', nameHe: 'אוזניות ANC מקצועיות', price: 1149,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85',
    tag: 'פוקוס מקסימלי', color: '#db2777',
  },
  {
    id: 3, emoji: '🖱️', name: 'Logitech MX Master 3S', nameHe: 'עכבר אלחוטי מקצועי', price: 399,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=85',
    tag: 'חדש בחנות', color: '#ea580c',
  },
  {
    id: 7, emoji: '💡', name: 'Elgato Key Light', nameHe: 'תאורת LED מקצועית', price: 449,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1000&q=85',
    tag: 'לסטרימרים', color: '#d97706',
  },
]

const INTERVAL = 3500

const slideV = {
  enter: (d) => ({ opacity: 0, x: d > 0 ? 70 : -70, scale: 0.95 }),
  center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit: (d) => ({ opacity: 0, x: d > 0 ? -70 : 70, scale: 0.95, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }),
}

function staggerV(i) {
  return {
    hidden: { opacity: 0, y: 28, clipPath: 'inset(0 0 100% 0)' },
    visible: {
      opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)',
      transition: { duration: 0.65, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
    },
  }
}

export default function Hero({ onShopNow }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dir, setDir] = useState(1)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => { setDir(1); setIndex((p) => (p + 1) % featured.length) }, INTERVAL)
    return () => clearInterval(t)
  }, [paused])

  const current = featured[index]
  const goPrev = () => { setDir(-1); setIndex((i) => (i - 1 + featured.length) % featured.length) }
  const goNext = () => { setDir(1); setIndex((i) => (i + 1) % featured.length) }
  const goTo = (i) => { setDir(i > index ? 1 : -1); setIndex(i) }

  return (
    <section
      className="relative overflow-visible"
      style={{
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        background: `
          radial-gradient(ellipse 90% 70% at top right, rgba(167,139,250,0.14) 0%, transparent 55%),
          radial-gradient(ellipse 70% 60% at bottom left, rgba(99,102,241,0.1) 0%, transparent 55%),
          radial-gradient(ellipse 55% 55% at 65% 10%, rgba(236,72,153,0.06) 0%, transparent 50%),
          #ffffff
        `,
      }}
    >
      {/* Background effects — clipped so they don't overflow the page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Giant faded wordmark */}
        <div
          className="absolute hidden lg:block select-none"
          style={{
            top: '50%', left: '-1%', transform: 'translateY(-50%)',
            fontSize: '21rem', fontFamily: 'var(--font-display)', fontWeight: 800,
            color: '#7c3aed', opacity: 0.027, lineHeight: 1,
            letterSpacing: '-0.04em', whiteSpace: 'nowrap',
          }}
        >
          DEV
        </div>

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.45) 50%, transparent)' }}
        />

        {/* Subtle animated orbs */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.07, 0.12, 0.07] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute rounded-full blur-3xl"
          style={{ width: 480, height: 480, top: '-10%', right: '-8%', background: '#7c3aed' }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.09, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute rounded-full blur-3xl"
          style={{ width: 320, height: 320, bottom: '0%', left: '-5%', background: '#6366f1' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-12 lg:pt-16 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* ── TEXT COLUMN ─────────────────────────── */}
          <div className="text-center lg:text-right">
            {/* Headline */}
            <motion.div variants={staggerV(1)} initial="hidden" animate="visible" className="mb-6">
              <h1
                className="font-extrabold leading-[1.1] tracking-tight text-slate-900"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 7vw, 4.3rem)' }}
              >
                <span className="block">ציוד פרימיום</span>
                <span className="relative block" style={{ color: '#7c3aed' }}>
                  שמעוררת השראה
                  {/* Animated wavy underline */}
                  <svg
                    viewBox="0 0 320 14"
                    className="absolute -bottom-1 left-0 w-full"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    fill="none"
                  >
                    <motion.path
                      d="M2 9 Q40 3 80 9 Q120 15 160 9 Q200 3 240 9 Q280 15 318 9"
                      stroke="#7c3aed"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.55 }}
                      transition={{ duration: 0.9, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </svg>
                </span>
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.p
              variants={staggerV(2)} initial="hidden" animate="visible"
              className="text-slate-500 leading-relaxed mb-9 max-w-md mx-auto lg:mx-0"
              style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.05rem)' }}
            >
              כי הכלים שאתה עובד איתם{' '}
              <span className="text-slate-800 font-semibold">חשובים לא פחות מהקוד</span>{' '}
              שאתה כותב. כל מוצר ב-DevStore נבחר ביד, נבדק לעומק, ומגיע עם אחריות מלאה.
            </motion.p>

            {/* Trust chips */}
            <motion.div
              variants={staggerV(3)} initial="hidden" animate="visible"
              className="flex flex-wrap justify-center lg:justify-start gap-2.5 mb-10"
            >
              {[
                { label: 'אחריות יבואן רשמי' },
                { label: 'משלוח תוך 24 שעות' },
                { label: 'נבחר ע"י מומחים' },
              ].map(({ label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-xl"
                  style={{
                    background: 'white',
                    border: '1.5px solid #e8e4f8',
                    boxShadow: '0 2px 8px rgba(124,58,237,0.06)',
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: '#7c3aed' }}
                  />
                  <span className="text-slate-700 font-semibold text-sm">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={staggerV(4)} initial="hidden" animate="visible"
              className="flex justify-center lg:justify-start mb-14"
            >
              <motion.button
                onClick={onShopNow}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-base group"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)',
                  boxShadow: '0 8px 32px -6px rgba(124,58,237,0.6), 0 2px 8px rgba(124,58,237,0.25)',
                }}
              >
                {/* animated shine sweep */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
                    transition: 'opacity 0.3s',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
                />
                <span style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)' }}>גלה את הקטלוג</span>
                <motion.span
                  animate={{ x: [0, -4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowLeft size={18} />
                </motion.span>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={staggerV(5)} initial="hidden" animate="visible"
              className="hidden sm:grid grid-cols-3 gap-6 pt-8 border-t border-slate-100 text-center lg:text-right"
            >
              {[
                { value: '200+', label: 'מוצרים נבחרים' },
                { value: '4.9★', label: 'דירוג לקוחות' },
                { value: '24h', label: 'משלוח מהיר' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-mono)' }}>
                    {s.value}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── PRODUCT VISUAL ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-first lg:order-last"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="relative mx-4 lg:mx-0"
            >
              {/* Color glow behind image — transitions with product */}
              <motion.div
                animate={{ opacity: [0.18, 0.26, 0.18] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-6 rounded-3xl blur-3xl pointer-events-none -z-10"
                style={{ background: current.color, transition: 'background 0.7s ease' }}
              />

              {/* Main image */}
              <div
                className="rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100 relative"
                style={{ boxShadow: '0 24px 64px -16px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)' }}
              >
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.img
                    key={current.id}
                    src={current.image}
                    alt={current.nameHe}
                    custom={dir}
                    variants={slideV}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Subtle vignette at bottom */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 45%)' }}
                />

                {/* Prev / Next */}
                <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={goPrev}
                    className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md text-slate-700 pointer-events-auto"
                  >
                    <ChevronRight size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={goNext}
                    className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md text-slate-700 pointer-events-auto"
                  >
                    <ChevronLeft size={18} />
                  </motion.button>
                </div>

                {/* Dot indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {featured.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className="transition-all duration-300 rounded-full"
                      style={{
                        width: i === index ? '18px' : '6px',
                        height: '6px',
                        background: i === index ? '#ffffff' : 'rgba(255,255,255,0.45)',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Product badge — top */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`badge-${current.id}`}
                  initial={{ opacity: 0, y: 8, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.94 }}
                  transition={{ duration: 0.38 }}
                  className="absolute top-3 right-3 lg:-top-5 lg:-right-5 bg-white rounded-2xl border border-slate-100 px-3 py-2.5 lg:px-4 lg:py-3 flex items-center gap-2.5 z-10"
                  style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                >
                  <span className="text-xl">{current.emoji}</span>
                  <div>
                    <p className="text-slate-900 font-bold text-sm leading-tight">{current.nameHe}</p>
                    <p className="text-xs font-bold mt-0.5 transition-colors duration-500"
                      style={{ fontFamily: 'var(--font-mono)', color: current.color }}>
                      ₪{current.price.toLocaleString()}
                    </p>
                  </div>
                  <Link
                    to={`/product/${current.id}`}
                    className="text-xs font-semibold underline underline-offset-2 transition-colors mr-1"
                    style={{ color: current.color }}
                  >
                    פרטים
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Tag badge — bottom left */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`tag-${current.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.35 }}
                  className="absolute bottom-3 left-3 lg:-bottom-5 lg:-left-5 rounded-2xl px-4 py-2.5 text-white z-10"
                  style={{
                    background: current.color,
                    boxShadow: `0 8px 24px -4px ${current.color}99`,
                    transition: 'background 0.5s ease, box-shadow 0.5s ease',
                  }}
                >
                  <p className="text-xs opacity-80 font-medium">קטגוריה נבחרת</p>
                  <p className="font-bold text-sm">{current.tag}</p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Thumbnail strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex justify-center gap-2 mt-12"
            >
              {featured.map((p, i) => (
                <motion.button
                  key={p.id}
                  onClick={() => goTo(i)}
                  whileHover={{ scale: 1.12, y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                  style={{
                    border: `2.5px solid ${i === index ? current.color : 'rgba(0,0,0,0.07)'}`,
                    opacity: i === index ? 1 : 0.5,
                    boxShadow: i === index ? `0 4px 16px -4px ${current.color}88` : 'none',
                    transition: 'border-color 0.4s, opacity 0.3s, box-shadow 0.4s',
                  }}
                >
                  <img src={p.image} alt={p.nameHe} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </motion.div>

            {/* Subtle link below thumbnails */}
            <motion.button
              onClick={onShopNow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="block w-full text-center text-xs text-slate-400 hover:text-violet-500 font-medium mt-3 transition-colors duration-150"
            >
              צפה בכל המוצרים
            </motion.button>
          </motion.div>

        </div>
      </div>

      {/* ping keyframe for the live dot */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
