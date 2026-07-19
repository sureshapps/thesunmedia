import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { TrendingUp } from 'lucide-react'
import { tagsKey, decodeHtml, asArray } from '@/lib/wp'

// Shown only while the real tags are loading / if the request fails.
const FALLBACK_HASHTAGS = [
  'HashtagOne', 'HashtagTwo', 'HashtagThree', 'HashtagFour',
]

const GROUP_SIZE = 4
const ROTATE_MS = 5000

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

// Full-width row: LIVE / TOP STORY badge (left) + TRENDING badge with a
// vertically-animated hashtag ticker (right) that swaps to the next set
// of `GROUP_SIZE` hashtags every `ROTATE_MS`. Hashtags are real WP tags,
// pulled and ranked by post count (the same tag data already powering
// tag pages / getTags() elsewhere on the site).
export default function TrendingHashtagBar() {
  const { data: tagsRaw, isLoading } = useSWR(tagsKey({ per_page: 12 }))
  const tags = asArray(tagsRaw)

  const groups = useMemo(() => {
    const source = tags.length
      ? tags.map(t => ({ name: decodeHtml(t.name), slug: t.slug }))
      : FALLBACK_HASHTAGS.map(name => ({ name, slug: null }))
    return chunk(source, GROUP_SIZE)
  }, [tags])

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
    <div className="mb-6 select-none relative rounded-md overflow-hidden flex items-stretch shadow-sm">
      {/* LIVE + TOP STORY */}
      <div className="flex items-stretch h-9 shrink-0">
        <div className="flex items-center gap-1.5 bg-black px-3 shrink-0">
          <span className="w-2 h-2 rounded-full live-blink-dot" />
          <span className="text-white text-[11px] sm:text-xs font-extrabold uppercase italic tracking-wider">
            Live
          </span>
        </div>
        <div className="flex items-center gap-2 bg-primary pl-3 pr-4 shrink-0">
          <span className="text-white text-xs sm:text-sm font-extrabold uppercase italic tracking-wider whitespace-nowrap">
            Top Story
          </span>
        </div>
      </div>

      {/* TRENDING + animated hashtag ticker */}
      <div className="flex items-stretch flex-1 min-w-0 h-9">
        <div className="flex items-center gap-1.5 bg-yellow-400 px-3 shrink-0">
          <span className="text-black text-xs sm:text-sm font-extrabold uppercase italic tracking-wider whitespace-nowrap">
            Trending
          </span>
          <TrendingUp className="h-3.5 w-3.5 text-black shrink-0" strokeWidth={3} />
        </div>

        <div className="flex-1 min-w-0 bg-[#2d2d2d] flex items-center px-4 overflow-hidden">
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
                          className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-white border border-white/40 rounded px-2 py-0.5 whitespace-nowrap hover:border-primary hover:text-primary transition-colors"
                        >
                          #{tag.name}
                        </Link>
                      ) : (
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-white border border-white/40 rounded px-2 py-0.5 whitespace-nowrap">
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
      `}</style>
    </div>
  )
}
