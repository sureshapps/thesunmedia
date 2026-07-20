import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { TrendingUp } from 'lucide-react'
import { tagsKey, decodeHtml, asArray } from '@/lib/wp'

// Shown only while the real tags are loading / if the request fails.
const FALLBACK_HASHTAGS = [
  'HashtagOne', 'HashtagTwo', 'HashtagThree', 'HashtagFour', 'HashtagFive',
]

const ROTATE_MS = 5000
const MOBILE_GROUP_SIZE = 2
const DESKTOP_GROUP_SIZE = 4
const MOBILE_BREAKPOINT = 650 // matches Tailwind's `sm`

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  )
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return isMobile
}

// Full-width row: LIVE / TOP STORY badge (left) + a glassmorphic TRENDING
// pill (right) holding real hashtag chips. Every `ROTATE_MS` the visible
// set of chips (4 on desktop, 2 on mobile) slides up and is replaced by the
// next set — same real WP tags, ranked by post count, that power tag pages
// / getTags() elsewhere on the site.
export default function TrendingHashtagBar() {
  const { data: tagsRaw, isLoading } = useSWR(tagsKey({ per_page: 12 }))
  const tags = asArray(tagsRaw)
  const isMobile = useIsMobile()
  const groupSize = isMobile ? MOBILE_GROUP_SIZE : DESKTOP_GROUP_SIZE

  const groups = useMemo(() => {
    const source = tags.length
      ? tags.map(t => ({ name: decodeHtml(t.name), slug: t.slug }))
      : FALLBACK_HASHTAGS.map(name => ({ name, slug: null }))
    return chunk(source, groupSize)
  }, [tags, groupSize])

  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [groups.length])

  useEffect(() => {
    if (groups.length <= 1) return
    const id = setInterval(() => {
      setIndex(i => (i + 1) % groups.length)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [groups.length])

  if (!isLoading && tags.length === 0) return null

  return (
    <div className="mb-6 select-none flex items-stretch gap-1 sm:gap-1.5">
      {/* LIVE + TOP STORY */}
      <div className="flex items-stretch h-9 shrink-0 rounded-md overflow-hidden shadow-sm">
        <div className="flex items-center gap-1 sm:gap-1.5 bg-black px-2 sm:px-3 shrink-0">
          <span className="w-2 h-2 rounded-full live-blink-dot shrink-0" />
          <span className="text-white text-[10px] sm:text-xs font-extrabold uppercase italic tracking-wider whitespace-nowrap">
            Live
          </span>
        </div>
        <div className="flex items-center gap-2 bg-primary pl-2 pr-3 sm:pl-3 sm:pr-4 shrink-0">
          <span className="text-white text-[11px] sm:text-sm font-extrabold uppercase italic tracking-wider whitespace-nowrap">
            Top Story
          </span>
        </div>
      </div>

      {/* Glassmorphic TRENDING pill + rotating hashtag chips */}
      <div className="relative flex-1 min-w-0 h-9 rounded-full overflow-hidden shadow-sm border border-white/60 bg-white/40 backdrop-blur-md">
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
          <div className="trending-shine" />
        </div>

        <div className="relative z-10 flex items-center h-full pl-3 pr-2 sm:pl-4 sm:pr-3 gap-2 sm:gap-3">
          {/* TRENDING label */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <span className="font-serif-headline text-slate-900 text-xs sm:text-base font-extrabold uppercase italic tracking-wide whitespace-nowrap">
              Trending
            </span>
            <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 shrink-0" strokeWidth={3} />
          </div>

          {/* Divider */}
          <span className="w-px h-4 bg-slate-400/40 shrink-0" />

          {/* Rotating chip viewport */}
          <div className="relative flex-1 min-w-0 overflow-hidden h-6">
            <div
              className="flex flex-col transition-transform duration-700 ease-in-out"
              style={{ transform: `translateY(-${index * 100}%)` }}
            >
              {groups.map((group, gi) => (
                <div key={gi} className="flex items-center gap-1.5 sm:gap-2 h-6 shrink-0 overflow-hidden">
                  {group.map((tag, ti) => (
                    tag.slug ? (
                      <Link
                        key={ti}
                        to={`/tag/${tag.slug}`}
                        className="inline-flex items-center shrink-0 rounded-full bg-white/70 hover:bg-primary border border-white/80 hover:border-primary shadow-sm px-2 sm:px-3 py-1 text-[9px] sm:text-xs font-bold uppercase tracking-wide text-slate-800 hover:text-white transition-colors whitespace-nowrap"
                      >
                        #{tag.name}
                      </Link>
                    ) : (
                      <span
                        key={ti}
                        className="inline-flex items-center shrink-0 rounded-full bg-white/70 border border-white/80 shadow-sm px-2 sm:px-3 py-1 text-[9px] sm:text-xs font-bold uppercase tracking-wide text-slate-800 whitespace-nowrap"
                      >
                        #{tag.name}
                      </span>
                    )
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes liveBlinkDot {
          0%, 45% { background-color: #dc2626; }
          50%, 95% { background-color: #facc15; }
          100% { background-color: #dc2626; }
        }
        .live-blink-dot {
          animation: liveBlinkDot 1s steps(1, end) infinite;
        }

        .trending-shine {
          position: absolute;
          top: 0;
          left: -60%;
          width: 35%;
          height: 100%;
          background: linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%);
          transform: skewX(-20deg);
          animation: trendingShineMove 2.4s ease-in-out infinite;
        }
        @keyframes trendingShineMove {
          0% { left: -60%; }
          45% { left: 130%; }
          100% { left: 130%; }
        }
      `}</style>
    </div>
  )
}
