import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { TrendingUp } from 'lucide-react'
import { tagsKey, decodeHtml, asArray } from '@/lib/wp'

// Shown only while the real tags are loading / if the request fails.
const FALLBACK_HASHTAGS = [
  'HashtagOne', 'HashtagTwo', 'HashtagThree', 'HashtagFour',
]

const ROTATE_MS = 5000
const MOBILE_GROUP_SIZE = 2
const DESKTOP_GROUP_SIZE = 6
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

// Full-width row: LIVE / TOP STORY badge (left) + TRENDING badge with a
// vertically-animated hashtag ticker (right) that swaps to the next set
// of hashtags every `ROTATE_MS` — 2 at a time on mobile, 4 at a time from
// `sm` up. Hashtags are real WP tags, pulled and ranked by post count (the
// same tag data already powering tag pages / getTags() elsewhere on the site).
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

      {/* TRENDING + animated hashtag ticker */}
      <div className="flex items-stretch flex-1 min-w-0 h-9 rounded-md overflow-hidden shadow-sm">
        {/* Yellow TRENDING badge with a shine sweep across it */}
        <div className="relative flex items-center gap-1 sm:gap-1.5 bg-yellow-400 px-2 sm:px-3 shrink-0 overflow-hidden">
          <span className="text-black text-[11px] sm:text-sm font-extrabold uppercase italic tracking-wider whitespace-nowrap relative z-10">
            Trending
          </span>
          <TrendingUp className="h-3.5 w-3.5 text-black shrink-0 relative z-10" strokeWidth={3} />
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="trending-shine" />
          </div>
        </div>

        <div className="flex-1 min-w-0 bg-[#2d2d2d] flex items-center px-2.5 sm:px-4 overflow-hidden">
          <div className="relative w-full overflow-hidden h-5">
            <div
              className="flex flex-col transition-transform duration-700 ease-in-out"
              style={{ transform: `translateY(-${index * 100}%)` }}
            >
              {groups.map((group, gi) => (
                <div key={gi} className="flex items-center gap-2 h-5 shrink-0 overflow-hidden">
                  {group.map((tag, ti) => (
                    <span key={ti} className="inline-flex items-center gap-2 shrink-0">
                      {tag.slug ? (
                        <Link
                          to={`/tag/${tag.slug}`}
                          className="text-[9px] sm:text-xs font-bold uppercase tracking-wide text-white border border-white/40 rounded px-1.5 sm:px-2 py-0.5 whitespace-nowrap hover:border-primary hover:text-primary transition-colors"
                        >
                          #{tag.name}
                        </Link>
                      ) : (
                        <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wide text-white border border-white/40 rounded px-1.5 sm:px-2 py-0.5 whitespace-nowrap">
                          #{tag.name}
                        </span>
                      )}
                      {ti < group.length - 1 && (
                        <span className="w-1 h-1 rounded-full bg-yellow-400 shrink-0" />
                      )}
                    </span>
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
          background: linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.75) 50%, transparent 100%);
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
