import { Star } from 'lucide-react'

const reviews = [
  { name: 'אורי ל.', text: 'המקלדת הכי טובה שהיתה לי. כל הקשה מרגיש כמו חמאה!', product: 'Keychron Q1 Pro' },
  { name: 'שירה מ.', text: 'השולחן החשמלי שינה לי את החיים — עובדת עמידה שלוש שעות ביום.', product: 'FlexiSpot E7 Pro' },
  { name: 'דני כ.', text: 'המסך הזה חד כמו סכין. לא יכול לחזור לFHD.', product: 'LG UltraFine 5K' },
  { name: 'נועה ר.', text: 'השירות היה מהיר ומקצועי, המוצר הגיע תוך יומיים!', product: 'DevStore' },
  { name: 'יואב פ.', text: 'אוזניות הכי נוחות שיש. שומע רק מוסיקה, לא את העולם.', product: 'Sony XM5' },
  { name: 'מיכל א.', text: 'ה-Brio 4K הפכה את כל הזום-קולים שלי. כולם שאלו מה קרה.', product: 'Logitech Brio 4K' },
  { name: 'תומר ב.', text: 'Ergotron LX שחררה לי חצי שולחן. לא מבין למה לא קניתי קודם.', product: 'Ergotron LX' },
  { name: 'רותם ש.', text: 'ה-ScreenBar Plus שינה לי את גישת העבודה בלילה. ממליץ בחום.', product: 'BenQ ScreenBar Plus' },
]

function ReviewCard({ review }) {
  return (
    <div className="flex-shrink-0 w-64 bg-white border border-slate-100 rounded-2xl p-4 mx-3 shadow-sm">
      <div className="flex mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={13} className="text-amber-400" fill="currentColor" />
        ))}
      </div>
      <p className="text-slate-700 text-sm leading-relaxed mb-3">"{review.text}"</p>
      <div className="flex items-center justify-between">
        <span className="text-slate-900 font-semibold text-xs">{review.name}</span>
        <span className="text-violet-500 text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
          {review.product}
        </span>
      </div>
    </div>
  )
}

export default function TestimonialTicker() {
  // Duplicate for seamless loop
  const doubled = [...reviews, ...reviews]

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

      <div
        className="flex"
        style={{
          animation: 'ticker-scroll 32s linear infinite',
          width: 'max-content',
        }}
      >
        {doubled.map((review, i) => (
          <ReviewCard key={i} review={review} />
        ))}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
