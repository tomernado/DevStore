import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const featured = [
  {
    id: 1, name: 'Keychron Q1 Pro', nameHe: 'מקלדת מכנית Hall Effect', price: 549,
    image: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&w=1000&q=85',
    tag: 'הנמכר ביותר', color: '#7c3aed',
  },
  {
    id: 14, name: 'Herman Miller Aeron', nameHe: 'כיסא ארגונומי אייקוני', price: 3999,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=1000&q=85',
    tag: 'השקעה לחיים', color: '#0d9488',
  },
  {
    id: 9, name: 'LG UltraFine 5K', nameHe: 'מסך 5K Thunderbolt 4', price: 2149,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=85',
    tag: 'פרמיום', color: '#1d4ed8',
  },
  {
    id: 21, name: 'Jabra Evolve2 85', nameHe: 'אוזניות ANC מקצועיות', price: 1149,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85',
    tag: 'פוקוס מקסימלי', color: '#db2777',
  },
  {
    id: 3, name: 'Logitech MX Master 3S', nameHe: 'עכבר אלחוטי מקצועי', price: 399,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=85',
    tag: 'חדש בחנות', color: '#ea580c',
  },
  {
    id: 7, name: 'Elgato Key Light', nameHe: 'תאורת LED מקצועית', price: 449,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1000&q=85',
    tag: 'לסטרימרים', color: '#d97706',
  },
]

const INTERVAL = 3500

const slideV = {
  enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.96 }),
  center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: (d) => ({ opacity: 0, x: d > 0 ? -60 : 60, scale: 0.96, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } }),
}

function fadeUp(i) {
  return {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.55, delay: 0.08 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
    },
  }
}

// Marquee — 20 items so one set (~2600px) exceeds any desktop viewport
const marqueeProducts = [
  ...featured,
  { id: 'm1',  image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=400&q=75' },
  { id: 'm2',  image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=75' },
  { id: 'm3',  image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=400&q=75' },
  { id: 'm4',  image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=400&q=75' },
  { id: 'm5',  image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=400&q=75' },
  { id: 'm6',  image: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=400&q=75' },
  { id: 'm7',  image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=400&q=75' },
  { id: 'm8',  image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400&q=75' },
  { id: 'm9',  image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=400&q=75' },
  { id: 'm10', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=75' },
  { id: 'm11', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=75' },
  { id: 'm12', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=75' },
  { id: 'm13', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=400&q=75' },
  { id: 'm14', image: 'https://images.unsplash.com/photo-1612838320302-4b3b3996e422?auto=format&fit=crop&w=400&q=75' },
]

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
      className="relative overflow-hidden"
      style={{
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: `
          radial-gradient(ellipse 90% 70% at top right, rgba(167,139,250,0.13) 0%, transparent 55%),
          radial-gradient(ellipse 70% 60% at bottom left, rgba(99,102,241,0.09) 0%, transparent 55%),
          #ffffff
        `,
      }}
    >
      {/* BG orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute hidden lg:block select-none"
          style={{
            top: '50%', left: '-1%', transform: 'translateY(-50%)',
            fontSize: '21rem', fontFamily: 'var(--font-display)', fontWeight: 800,
            color: '#7c3aed', opacity: 0.025, lineHeight: 1, letterSpacing: '-0.04em', whiteSpace: 'nowrap',
          }}
        >DEV</div>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4) 50%, transparent)' }} />
        <div className="absolute rounded-full blur-3xl" style={{ animation: 'orbA 9s ease-in-out infinite', width: 460, height: 460, top: '-10%', right: '-8%', background: '#7c3aed', opacity: 0.08 }} />
        <div className="absolute rounded-full blur-3xl" style={{ animation: 'orbB 11s ease-in-out infinite', width: 300, height: 300, bottom: '0%', left: '-5%', background: '#6366f1', opacity: 0.07 }} />
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 pb-2 lg:pt-16 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-20 items-center">

          {/* ── TEXT ── */}
          <div className="text-center lg:text-right">

            {/* Headline */}
            <motion.div variants={fadeUp(0)} initial="hidden" animate="visible" className="mb-6">
              <h1
                className="font-extrabold leading-[1.1] tracking-tight text-slate-900"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 7vw, 4.3rem)' }}
              >
                <span className="block">ציוד פרימיום</span>
                <span className="relative block" style={{ color: '#7c3aed' }}>
                  שמעורר השראה
                  <svg viewBox="0 0 320 14" className="absolute -bottom-1 left-0 w-full" preserveAspectRatio="none" aria-hidden fill="none">
                    <motion.path
                      d="M2 9 Q40 3 80 9 Q120 15 160 9 Q200 3 240 9 Q280 15 318 9"
                      stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.5 }}
                      transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </svg>
                </span>
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.p
              variants={fadeUp(1)} initial="hidden" animate="visible"
              className="text-slate-500 leading-relaxed mb-5 lg:mb-9 max-w-md mx-auto lg:mx-0"
              style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.05rem)' }}
            >
              כי הכלים שאתה עובד איתם{' '}
              <span className="text-slate-800 font-semibold">חשובים לא פחות מהקוד</span>{' '}
              שאתה כותב. כל מוצר ב-DevStore נבחר ביד, נבדק לעומק, ומגיע עם אחריות מלאה.
            </motion.p>

            {/* Trust chips — CSS float animation, no Framer conflict */}
            <motion.div
              variants={fadeUp(2)} initial="hidden" animate="visible"
              className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5 lg:mb-8"
            >
              {[
                { label: 'אחריות יבואן רשמי', anim: 'floatA' },
                { label: 'משלוח תוך 24 שעות', anim: 'floatB' },
                { label: 'נבחר ע"י מומחים', anim: 'floatC' },
              ].map(({ label, anim }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-xl cursor-default select-none"
                  style={{
                    background: 'white',
                    border: '1.5px solid #ede9fa',
                    boxShadow: '0 4px 14px rgba(124,58,237,0.08)',
                    animation: `${anim} 3.5s ease-in-out infinite`,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#7c3aed' }} />
                  <span className="text-slate-700 font-semibold text-sm">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA — CSS pulse ring, no Framer conflict */}
            <motion.div
              variants={fadeUp(3)} initial="hidden" animate="visible"
              className="flex justify-center lg:justify-start mb-5 lg:mb-10"
            >
              <div className="relative inline-block">
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: 'rgba(124,58,237,0.4)', animation: 'pulseRing 2.4s ease-in-out infinite' }}
                />
                <button
                  onClick={onShopNow}
                  className="relative overflow-hidden flex items-center gap-3 px-9 py-4 rounded-2xl text-white font-bold"
                  style={{
                    fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)',
                    boxShadow: '0 8px 32px -6px rgba(124,58,237,0.65), 0 2px 8px rgba(124,58,237,0.3)',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = '' }}
                >
                  {/* CSS shine sweep */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.15) 50%, transparent 75%)', animation: 'shine 3.5s ease-in-out infinite' }} />
                  <span>גלה את הקטלוג</span>
                  <span style={{ display: 'inline-block', animation: 'arrowPulse 1.5s ease-in-out infinite' }}>
                    <ArrowLeft size={18} />
                  </span>
                </button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp(4)} initial="hidden" animate="visible"
              className="hidden sm:grid grid-cols-3 gap-6 pt-8 border-t border-slate-100 text-center lg:text-right"
            >
              {[
                { value: '200+', label: 'מוצרים נבחרים' },
                { value: '4.9★', label: 'דירוג לקוחות' },
                { value: '24h', label: 'משלוח מהיר' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-mono)' }}>{s.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── CAROUSEL ── */}
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-first lg:order-last"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div
              className="relative mx-4 lg:mx-0"
              style={{ animation: 'floatCard 7s ease-in-out infinite' }}
            >
              {/* Glow */}
              <div
                className="absolute inset-6 rounded-3xl blur-3xl pointer-events-none -z-10"
                style={{ background: current.color, opacity: 0.22, transition: 'background 0.7s ease' }}
              />

              {/* Image */}
              <div
                className="rounded-3xl overflow-hidden aspect-[16/9] lg:aspect-[4/3] max-h-44 sm:max-h-none bg-slate-100 relative"
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
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 45%)' }} />

                {/* Prev/Next */}
                <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={goPrev}
                    className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md text-slate-700 pointer-events-auto">
                    <ChevronRight size={18} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={goNext}
                    className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md text-slate-700 pointer-events-auto">
                    <ChevronLeft size={18} />
                  </motion.button>
                </div>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {featured.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)} className="transition-all duration-300 rounded-full"
                      style={{ width: i === index ? 18 : 6, height: 6, background: i === index ? '#fff' : 'rgba(255,255,255,0.45)' }} />
                  ))}
                </div>
              </div>

              {/* Top badge */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`badge-${current.id}`}
                  initial={{ opacity: 0, y: 8, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.94 }}
                  transition={{ duration: 0.35 }}
                  className="absolute top-3 right-3 lg:-top-5 lg:-right-5 bg-white rounded-2xl border border-slate-100 px-3 py-2.5 lg:px-4 lg:py-3 flex items-center gap-2.5 z-10"
                  style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.12)' }}
                >
                  <div>
                    <p className="text-slate-900 font-bold text-sm leading-tight">{current.nameHe}</p>
                    <p className="text-xs font-bold mt-0.5" style={{ fontFamily: 'var(--font-mono)', color: current.color }}>
                      ₪{current.price.toLocaleString()}
                    </p>
                  </div>
                  <Link to={`/product/${current.id}`} className="text-xs font-semibold underline underline-offset-2 mr-1 transition-colors" style={{ color: current.color }}>
                    פרטים
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Bottom badge */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`tag-${current.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.32 }}
                  className="absolute bottom-3 left-3 lg:-bottom-5 lg:-left-5 rounded-2xl px-4 py-2.5 text-white z-10"
                  style={{ background: current.color, boxShadow: `0 8px 24px -4px ${current.color}99`, transition: 'background 0.5s ease' }}
                >
                  <p className="text-xs opacity-75 font-medium">קטגוריה נבחרת</p>
                  <p className="font-bold text-sm">{current.tag}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnails */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.5 }}
              className="flex justify-center gap-1.5 mt-3 lg:mt-12"
            >
              {featured.map((p, i) => (
                <motion.button
                  key={p.id}
                  onClick={() => goTo(i)}
                  whileHover={{ scale: 1.12, y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden flex-shrink-0"
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

            <motion.button
              onClick={onShopNow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="hidden lg:block w-full text-center text-xs text-slate-400 hover:text-violet-500 font-medium mt-3 transition-colors"
            >
              צפה בכל המוצרים
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ── MARQUEE STRIP — full width, all screens ── */}
      <div
        className="relative w-full overflow-hidden py-3 mt-1"
        style={{
          borderTop: '1px solid rgba(124,58,237,0.08)',
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          animation: 'fadeIn 0.4s ease 0.3s both',
        }}
      >

        {/* track — force LTR; 2 copies + translateX(0→-50%) = seamless infinite loop */}
        <div
          style={{
            display: 'flex',
            direction: 'ltr',
            animation: 'marquee 28s linear infinite',
            width: 'max-content',
          }}
        >
          {[...marqueeProducts, ...marqueeProducts].map((p, i) => (
            <div
              key={i}
              className="flex-shrink-0 relative rounded-xl overflow-hidden"
              style={{
                width: 120, height: 80,
                margin: '0 5px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <img src={p.image} alt="" className="w-full h-full object-cover" loading="eager" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee   { from { transform: translateX(-50%) } to { transform: translateX(0) } }
        @keyframes fadeIn    { from { opacity: 0 } to { opacity: 1 } }
        @keyframes floatA    { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-5px) } }
        @keyframes floatB    { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        @keyframes floatC    { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
        @keyframes floatCard { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        @keyframes pulseRing { 0%,100% { transform: scale(1); opacity: 0.3 } 50% { transform: scale(1.18); opacity: 0 } }
        @keyframes shine     { 0%,100% { transform: translateX(-120%) } 40%,60% { transform: translateX(220%) } }
        @keyframes arrowPulse { 0%,100% { transform: translateX(0) } 50% { transform: translateX(-5px) } }
        @keyframes orbA      { 0%,100% { transform: scale(1); opacity: 0.08 } 50% { transform: scale(1.08); opacity: 0.13 } }
        @keyframes orbB      { 0%,100% { transform: scale(1); opacity: 0.07 } 50% { transform: scale(1.1); opacity: 0.11 } }
      `}</style>
    </section>
  )
}
