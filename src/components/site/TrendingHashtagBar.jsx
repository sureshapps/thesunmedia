import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { TrendingUp } from 'lucide-react'
import { tagsKey, decodeHtml, asArray } from '@/lib/wp'

// Shown only while the real tags are loading / if the request fails.
const FALLBACK_HASHTAGS = [
  'HashtagOne', 'HashtagTwo', 'HashtagThree', 'HashtagFour', 'HashtagFive',
]

const ROTATE_MS = 6000 // "The Route: Cities" (Jitter) runs a 6s cycle — matched here
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
  // Bumped every rotation so the route-draw + chip-arrival animations replay
  // (keying elements off this forces a remount, which restarts the CSS keyframes).
  const [tick, setTick] = useState(0)

  useEffect(() => {
    setIndex(0)
    setTick(t => t + 1)
  }, [groups.length])

  useEffect(() => {
    if (groups.length <= 1) return
    const id = setInterval(() => {
      setIndex(i => (i + 1) % groups.length)
      setTick(t => t + 1)
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
            Top Stories
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

          {/* Mini "route" — a dashed path that draws itself with a travelling dot
              each time the chips change stop, echoing Jitter's "The Route: Cities" */}
          <div key={`route-${tick}`} className="relative w-6 h-4 shrink-0 hidden sm:block text-primary" aria-hidden="true">
            <svg viewBox="0 0 24 16" className="w-full h-full overflow-visible">
              <line
                x1="1" y1="8" x2="23" y2="8"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                strokeDasharray="3 3" opacity="0.55"
                className="route-line-draw"
              />
              <circle r="2.3" fill="currentColor" className="route-dot" />
            </svg>
          </div>

          {/* Rotating chip viewport — each group "arrives" like a new stop on the route */}
          <div className="relative flex-1 min-w-0 overflow-hidden h-6">
            <div key={`group-${tick}`} className="flex items-center gap-1.5 sm:gap-2 h-6 shrink-0 overflow-hidden route-chip-group">
              {(groups[index] || []).map((tag, ti) => (
                tag.slug ? (
                  <Link
                    key={ti}
                    to={`/tag/${tag.slug}`}
                    className="inline-flex items-center shrink-0 rounded-md bg-white/70 hover:bg-primary border border-slate-400/70 hover:border-primary shadow-sm px-2 sm:px-3 py-1 text-[9px] sm:text-xs font-bold uppercase tracking-wide text-slate-800 hover:text-white transition-colors whitespace-nowrap"
                  >
                    #{tag.name}
                  </Link>
                ) : (
                  <span
                    key={ti}
                    className="inline-flex items-center shrink-0 rounded-md bg-white/70 border border-slate-400/70 shadow-sm px-2 sm:px-3 py-1 text-[9px] sm:text-xs font-bold uppercase tracking-wide text-slate-800 whitespace-nowrap"
                  >
                    #{tag.name}
                  </span>
                )
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

        /* Route line "draws" itself from left to right, like a path being plotted
           between two stops — same idea as Jitter's "The Route: Cities". */
        .route-line-draw {
          stroke-dasharray: 26;
          stroke-dashoffset: 26;
          animation: routeLineDraw 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes routeLineDraw {
          to { stroke-dashoffset: 0; }
        }

        /* Dot travels along the line as it draws, arriving just as the new chip
           group lands — the "you are here" marker moving city to city. */
        .route-dot {
          transform: translate(1px, 8px);
          opacity: 0;
          animation: routeDotTravel 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes routeDotTravel {
          0% { transform: translate(1px, 8px); opacity: 0; }
          12% { opacity: 1; }
          100% { transform: translate(23px, 8px); opacity: 1; }
        }

        /* New hashtag group arrives like a destination coming into view —
           travels in, overshoots slightly, then settles. Total cycle is 6s
           (ROTATE_MS), animation itself resolves well within that window. */
        .route-chip-group {
          animation: chipsArrive 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes chipsArrive {
          0% { opacity: 0; transform: translateX(16px) translateY(3px) scale(0.85); }
          60% { opacity: 1; transform: translateX(-3px) translateY(-1px) scale(1.04); }
          100% { opacity: 1; transform: translateX(0) translateY(0) scale(1); }
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
