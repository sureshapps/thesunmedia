import { useState, useEffect, useRef } from 'react'
import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { buildUrl, asArray, decodeHtml, getFeaturedImage, getImageAlt, FALLBACK_IMAGE } from '@/lib/wp'

// Uses the site's existing /wp/v2/posts endpoint (same one every other block
// uses) rather than a separate plugin route — 'post_views_count' is already
// a field WordPress returns on each post here, so we just fetch a wide-enough
// window of recent posts and sort client-side by views. No extra backend
// dependency, and it can't 404 since it's the same endpoint already in use
// elsewhere in the app.
const RANGE_DAYS = 7
const FETCH_COUNT = 100
const VISIBLE_COUNT = 4
const MAX_TRENDING = 12
const AUTO_ADVANCE_MS = 2000

export default function TrendingBlock() {
  const sevenDaysAgo = new Date(Date.now() - RANGE_DAYS * 24 * 60 * 60 * 1000).toISOString()
  const key = buildUrl('/posts', {
    after: sevenDaysAgo,
    per_page: FETCH_COUNT,
    orderby: 'date',
    order: 'desc',
    _embed: 1,
  })

  const { data, error } = useSWR(key, { revalidateOnFocus: false, dedupingInterval: 5 * 60_000 })

  const recentPosts = asArray(data)
  const posts = [...recentPosts]
    .sort((a, b) => (b.post_views_count || 0) - (a.post_views_count || 0))
    .slice(0, MAX_TRENDING)

  const [offset, setOffset] = useState(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    if (posts.length <= 1) return
    const timer = setInterval(() => {
      if (!pausedRef.current) setOffset(o => (o + 1) % posts.length)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(timer)
  }, [posts.length])

  if (error || posts.length === 0) return null

  const windowItems = Array.from(
    { length: Math.min(VISIBLE_COUNT, posts.length) },
    (_, i) => posts[(offset + i) % posts.length]
  )

  const goPrev = () => setOffset(o => (o - 1 + posts.length) % posts.length)
  const goNext = () => setOffset(o => (o + 1) % posts.length)

  return (
    <section
      className="py-6"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="shrink-0 bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-sm">
          Weekly Trending
        </span>
        <div className="flex-1 h-0.5 bg-red-600" />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous"
          className="hidden sm:flex shrink-0 w-9 h-9 items-center justify-center rounded-sm border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        <div className="flex-1 flex items-center gap-5 overflow-hidden">
          {windowItems.map((p, i) => (
            <TrendingItem
              key={`${p.id}-${offset}`}
              post={p}
              className={
                i === 0 ? '' :
                i === 1 ? 'hidden sm:flex' :
                i === 2 ? 'hidden md:flex' :
                'hidden lg:flex'
              }
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next"
          className="hidden sm:flex shrink-0 w-9 h-9 items-center justify-center rounded-sm border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}

function TrendingItem({ post, className = '' }) {
  const img = getFeaturedImage(post) || FALLBACK_IMAGE
  const title = decodeHtml(post.title?.rendered || '')

  return (
    <Link
      to={`/article/${post.slug}`}
      className={`group flex-1 min-w-0 items-center gap-3 ${className || 'flex'}`}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-16 shrink-0 rounded overflow-hidden bg-muted">
        <img
          src={img}
          alt={getImageAlt(post)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <p className="text-sm leading-snug line-clamp-3 text-foreground group-hover:text-red-700 transition-colors">
        {title}
      </p>
    </Link>
  )
}
