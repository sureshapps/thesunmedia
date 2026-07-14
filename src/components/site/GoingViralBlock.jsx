import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  getFeaturedImage, getThumbnail, getImageAlt, getPrimaryCategory, getTags,
  decodeHtml, FALLBACK_IMAGE, postsKey, categoryBySlugKey, asArray,
} from '@/lib/wp'

const AUTO_INTERVAL_MS = 3000

/* ---------- Large sliding carousel card (3 visible on desktop, 1 on mobile) ---------- */
function CarouselCard({ post }) {
  if (!post) return null
  const img = getFeaturedImage(post) || FALLBACK_IMAGE
  const cat = getPrimaryCategory(post)
  return (
    <Link to={`/article/${post.slug}`} className="group block">
      <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted">
        <img
          src={img}
          alt={getImageAlt(post)}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-3">
        {cat && (
          <span className="inline-block bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm mb-1.5">
            {cat.name}
          </span>
        )}
        <h3 className="font-serif-headline font-bold text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {decodeHtml(post.title?.rendered || '')}
        </h3>
      </div>
    </Link>
  )
}

function CarouselCardSkeleton() {
  return (
    <div>
      <div className="aspect-[4/3] rounded-md skeleton-shimmer" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-16 skeleton-shimmer rounded" />
        <div className="h-4 w-full skeleton-shimmer rounded" />
        <div className="h-4 w-2/3 skeleton-shimmer rounded" />
      </div>
    </div>
  )
}

/* ---------- Small list item — image left, text right ---------- */
function ViralListItem({ post }) {
  if (!post) return null
  const img = getThumbnail(post) || FALLBACK_IMAGE
  const cat = getPrimaryCategory(post)
  const tags = getTags(post) || []
  const isExclusive = tags.some(t => /exclusive/i.test(t.name))
  return (
    <Link to={`/article/${post.slug}`} className="group flex items-start gap-3">
      <div className="w-20 h-16 sm:w-24 sm:h-20 shrink-0 overflow-hidden rounded bg-muted">
        <img
          src={img}
          alt={getImageAlt(post)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="flex-1 min-w-0">
        {isExclusive && (
          <span className="inline-block bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm mb-1.5">
            Exclusive
          </span>
        )}
        <h4 className="font-semibold text-sm leading-snug line-clamp-3 group-hover:text-primary transition-colors">
          {decodeHtml(post.title?.rendered || '')}
        </h4>
        {cat && (
          <span className="mt-1.5 block text-[11px] font-bold uppercase tracking-wider text-primary">
            {cat.name}
          </span>
        )}
      </div>
    </Link>
  )
}

function ViralListItemSkeleton() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-20 h-16 sm:w-24 sm:h-20 shrink-0 rounded skeleton-shimmer" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-full skeleton-shimmer rounded" />
        <div className="h-4 w-2/3 skeleton-shimmer rounded" />
        <div className="h-3 w-14 skeleton-shimmer rounded" />
      </div>
    </div>
  )
}

export default function GoingViralBlock() {
  const { data: cats } = useSWR(categoryBySlugKey('going-viral'))
  const cat = cats?.[0]
  const { data: posts } = useSWR(
    cat ? postsKey({ categories: cat.id, per_page: 12, _embed: 1 }) : null
  )
  const loading = !posts || !Array.isArray(posts)
  const postsArr = asArray(posts)

  // First 8 posts feed the auto-sliding carousel, the next 6 feed the list below (3-column grid).
  const carouselPosts = postsArr.slice(0, 8)
  const listItems = postsArr.length > 6 ? postsArr.slice(4, 10) : postsArr.slice(0, 6)
  const total = carouselPosts.length

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  // Auto-advance every 3s, pauses on hover, resets if the post list changes.
  useEffect(() => { setIndex(0) }, [total])

  useEffect(() => {
    if (paused || total <= 3) return
    const t = setInterval(() => setIndex(i => (i + 1) % total), AUTO_INTERVAL_MS)
    return () => clearInterval(t)
  }, [paused, total])

  function prev() { if (total) setIndex(i => (i - 1 + total) % total) }
  function next() { if (total) setIndex(i => (i + 1) % total) }

  // Only ever show as many slots as there are distinct posts (max 3), so a
  // short list (e.g. only 1 or 2 posts) never repeats the same card twice.
  const slotCount = Math.min(3, total)
  const slots = Array.from({ length: slotCount }, (_, offset) =>
    total ? carouselPosts[(index + offset) % total] : null
  )
  const gridColsClass =
    slotCount === 1 ? 'md:grid-cols-1' : slotCount === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
  // No point showing nav arrows if every distinct post is already on screen at once.
  const showNav = !loading && total > slotCount

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
        <span className="inline-block bg-primary text-white font-extrabold italic uppercase tracking-wide text-base sm:text-lg px-4 py-1.5 rounded-sm">
          Going Viral
        </span>
        <Link
          to={cat ? `/category/${cat.slug}` : '/category/going-viral'}
          className="text-xs sm:text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
        >
          View All <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Carousel — 3 cards on desktop (md+), 1 card on mobile */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className={`grid grid-cols-1 ${gridColsClass} gap-5`}>
          {loading
            ? [...Array(3)].map((_, i) => <CarouselCardSkeleton key={i} />)
            : slots.map((p, i) => (
                <div key={p ? p.id : `empty-${i}`} className={i === 0 ? 'block' : 'hidden md:block'}>
                  <CarouselCard post={p} />
                </div>
              ))}
        </div>

        {showNav && (
          <>
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-1 top-[36%] -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded bg-neutral-200/80 hover:bg-neutral-300 text-foreground shadow transition-colors z-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-1 top-[36%] -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded bg-neutral-200/80 hover:bg-neutral-300 text-foreground shadow transition-colors z-10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Small list grid below — image left, text right, 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 mt-8">
        {loading
          ? [...Array(6)].map((_, i) => <ViralListItemSkeleton key={i} />)
          : listItems.map(p => <ViralListItem key={p.id} post={p} />)}
      </div>
    </section>
  )
}
