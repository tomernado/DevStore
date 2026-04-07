import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ArrowLeft, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const trustPoints = [
  'איכות ללא פשרות — כל מוצר נבחר ביד',
  'עיצוב ארגונומי מתקדם לשעות עבודה ארוכות',
  'אחריות יבואן רשמי + שירות לאחר מכירה',
]

// Featured products that rotate in the hero visual
const featured = [
  {
    id: 1,
    emoji: '⌨️',
    name: 'Keychron Q1 Pro',
    nameHe: 'מקלדת מכנית Hall Effect',
    price: 549,
    image: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&w=1000&q=85',
    tag: 'הנמכר ביותר',
  },
  {
    id: 14,
    emoji: '🪑',
    name: 'Herman Miller Aeron',
    nameHe: 'כיסא ארגונומי אייקוני',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=1000&q=85',
    tag: 'השקעה לחיים',
  },
  {
    id: 9,
    emoji: '🖥️',
    name: 'LG UltraFine 5K',
    nameHe: 'מסך 5K Thunderbolt 4',
    price: 2149,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=85',
    tag: 'פרמיום',
  },
  {
    id: 21,
    emoji: '🎧',
    name: 'Jabra Evolve2 85',
    nameHe: 'אוזניות ANC מקצועיות',
    price: 1149,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85',
    tag: 'פרמיום',
  },
]

const INTERVAL = 3000

const fadeVariants = {
  enter: { opacity: 0, scale: 1.03 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

const infoVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.35 } },
}

const textFadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero({ onShopNow }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % featured.length)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [paused])

  const current = featured[index]
  const prev = () => setIndex((i) => (i - 1 + featured.length) % featured.length)
  const next = () => setIndex((i) => (i + 1) % featured.length)

  return (
    <section className="relative bg-white min-h-[85vh] flex items-center overflow-hidden">
      {/* subtle bg blob */}
      <div
        className="absolute -top-40 left-0 w-[500px] h-[500px] rounded-full opacity-[0.05] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">

          {/* ── RIGHT COLUMN: Text (RTL = appears right) ───────── */}
          <div>
            <motion.div custom={0} variants={textFadeUp} initial="hidden" animate="visible"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-sm font-medium mb-8"
            >
              <Sparkles size={13} />
              <span>הקולקציה החדשה — 2025</span>
            </motion.div>

            <motion.h1 custom={1} variants={textFadeUp} initial="hidden" animate="visible"
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 leading-[1.12] tracking-tight mb-5"
            >
              ציוד פרימיום לסביבת{' '}
              <span className="text-violet-600">עבודה שמעוררת</span>{' '}
              השראה
            </motion.h1>

            <motion.p custom={2} variants={textFadeUp} initial="hidden" animate="visible"
              className="text-lg text-slate-500 leading-relaxed mb-9 max-w-lg"
            >
              כי הכלים שאתה עובד איתם חשובים לא פחות מהקוד שאתה כותב. כל מוצר
              ב-DevStore נבחר ביד, נבדק לעומק, ומגיע עם אחריות מלאה.
            </motion.p>

            <motion.ul custom={3} variants={textFadeUp} initial="hidden" animate="visible"
              className="hidden sm:block space-y-3 mb-11"
            >
              {trustPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-violet-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-base">{point}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div custom={4} variants={textFadeUp} initial="hidden" animate="visible"
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <motion.button
                onClick={onShopNow}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-base shadow-violet transition-colors duration-150"
              >
                <span>גלה את הקטלוג</span>
                <ArrowLeft size={17} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={onShopNow}
                className="flex items-center gap-2 px-6 py-4 rounded-2xl text-slate-500 hover:text-violet-600 font-semibold text-base transition-colors duration-150"
              >
                צפה בכל המוצרים
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div custom={5} variants={textFadeUp} initial="hidden" animate="visible"
              className="hidden sm:grid mt-14 pt-8 border-t border-slate-100 grid-cols-3 gap-6"
            >
              {[
                { value: '200+', label: 'מוצרים נבחרים' },
                { value: '4.9★', label: 'ממוצע ביקורות' },
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

          {/* ── LEFT COLUMN: Cycling product visual ────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative block order-first lg:order-last"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Floating wrapper — no float animation on mobile (saves paint) */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ willChange: 'transform' }}
              className="relative mx-4 lg:mx-0"
            >
              {/* Main image — cross-fade */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100 aspect-[3/2] lg:aspect-[4/3] bg-slate-100 relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={current.image}
                    src={current.image}
                    alt={current.nameHe}
                    variants={fadeVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Prev / Next controls */}
                <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prev}
                    className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md text-slate-700 pointer-events-auto"
                  >
                    <ChevronRight size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={next}
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
                      onClick={() => setIndex(i)}
                      className={`transition-all duration-300 rounded-full ${
                        i === index
                          ? 'w-5 h-2 bg-violet-600'
                          : 'w-2 h-2 bg-white/60 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Product badge — top right: cross-fades with product info */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`badge-top-${current.id}`}
                  variants={infoVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute top-3 right-3 lg:-top-5 lg:-right-5 bg-white rounded-2xl shadow-lg border border-slate-100 px-3 py-2 lg:px-4 lg:py-3 flex items-center gap-2 z-10"
                >
                  <span className="text-xl">{current.emoji}</span>
                  <div>
                    <p className="text-slate-900 font-bold text-sm leading-tight">{current.nameHe}</p>
                    <p className="text-violet-600 text-xs font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>
                      ₪{current.price.toLocaleString()}
                    </p>
                  </div>
                  <Link
                    to={`/product/${current.id}`}
                    className="mr-1 text-xs text-violet-500 hover:text-violet-700 font-medium underline underline-offset-2 transition-colors"
                  >
                    פרטים
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Bottom-left badge: tag */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`badge-bottom-${current.id}`}
                  variants={infoVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute bottom-3 left-3 lg:-bottom-5 lg:-left-5 bg-violet-600 rounded-2xl shadow-lg px-3 py-2 lg:px-4 lg:py-3 text-white z-10"
                >
                  <p className="text-xs opacity-80">קטגוריה נבחרת</p>
                  <p className="font-bold text-base">{current.tag}</p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* BG glow */}
            <div
              className="absolute -z-10 -inset-8 rounded-full opacity-[0.06]"
              style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 65%)' }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
