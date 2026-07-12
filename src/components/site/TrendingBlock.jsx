import { useState, useEffect, useRef } from 'react'
import useSWR from 'swr'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { decodeHtml } from '@/lib/wp'

// NOTE: matches the WP_BASE origin used in @/lib/wp.js. If that ever changes,
// update WP_ROOT here too. Assumes the WordPress Popular Posts plugin is
// installed and active on the WP backend, with its REST endpoint enabled
// (Settings > WP Popular Posts > Tools in the plugin's admin screen).
const WP_ROOT = 'https://thesun.my'
const TRENDING_URL = `${WP_ROOT}/wp-json/wordpress-popular-posts/v1/popular-posts?range=weekly&limit=12`

const VISIBLE_COUNT = 4
const AUTO_ADVANCE_MS = 2000

const fetcher = (url) => fetch(url).then(r => {
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
})

export default function TrendingBlock() {
  const { data, error } = useSWR(TRENDING_URL, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60_000, // popular-posts range is weekly, no need to refetch often
  })

  const posts = Array.isArray(data) ? data : []
  const [offset, setOffset] = useState(0)
  const pausedRef = useRef(false)

  // Advance one item at a time, looping back to the start.
  useEffect(() => {
    if (posts.length <= 1) return
    const timer = setInterval(() => {
      if (!pausedRef.current) setOffset(o => (o + 1) % posts.length)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(timer)
  }, [posts.length])

  if (error) {
    return (
      <section className="py-6">
        <div className="rounded-md border-2 border-dashed border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <strong>Weekly Trending failed to load.</strong> Could not reach{' '}
          <code className="bg-red-100 px-1 rounded">{TRENDING_URL}</code>.
          <br />
          Error: {error.message}. Check that the domain is correct and the WordPress Popular Posts
          plugin's REST endpoint is active.
        </div>
      </section>
    )
  }

  if (!data) {
    return (
      <section className="py-6">
        <div className="rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          Loading Weekly Trending…
        </div>
      </section>
    )
  }

  if (posts.length === 0) {
    return (
      <section className="py-6">
        <div className="rounded-md border-2 border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-700">
          <strong>Weekly Trending loaded but returned 0 posts.</strong> The endpoint responded, but with
          an empty list — double check the plugin has tracked views yet, or that <code>range=weekly</code>{' '}
          isn't too narrow.
        </div>
      </section>
    )
  }

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
  const img =
    post.image?.sizes?.thumbnail?.url ||
    post.image?.sizes?.medium?.url ||
    post.image?.sizes?.large?.url ||
    null
  const title = decodeHtml(typeof post.title === 'string' ? post.title : (post.title?.rendered || ''))

  return (
    <a
      href={post.url}
      className={`group flex-1 min-w-0 items-center gap-3 ${className || 'flex'}`}
    >
      {img && (
        <div className="w-16 h-16 sm:w-20 sm:h-16 shrink-0 rounded overflow-hidden bg-muted">
          <img
            src={img}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      )}
      <p className="text-sm leading-snug line-clamp-3 text-foreground group-hover:text-red-700 transition-colors">
        {title}
      </p>
    </a>
  )
}
