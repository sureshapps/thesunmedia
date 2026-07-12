import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { postsKey, categoryBySlugKey, getLargeImage, getFeaturedImage, getImageAlt, decodeHtml, timeAgo, asArray, FALLBACK_IMAGE } from '@/lib/wp'

// Full-width "Lifestyle" section — card-carousel layout.
// 5 cards visible per row, previous arrow in front of the row,
// next arrow sitting right after the last visible card.
// Fetches up to 20 posts total, scrollable one card at a time.
const VISIBLE_COUNT = 5
const MAX_ITEMS = 20

export default function LifestyleBlock({ slug = 'lifestyle', name = 'Lifestyle' }) {
  const { data: catsRaw } = useSWR(categoryBySlugKey(slug))
  const cats = asArray(catsRaw)
  const cat = cats[0]
  const { data: postsRaw } = useSWR(
    cat ? postsKey({ categories: cat.id, per_page: MAX_ITEMS, _embed: 1 }) : null
  )

  const [index, setIndex] = useState(0)

  const loading = !postsRaw || !Array.isArray(postsRaw)
  const posts = asArray(postsRaw).slice(0, MAX_ITEMS)
  const maxIndex = Math.max(0, posts.length - VISIBLE_COUNT)

  // Auto-advance to the next 5 cards every 5 seconds, looping back to the start.
  // This must stay above any early return so hook order never changes between renders.
  useEffect(() => {
    if (posts.length <= VISIBLE_COUNT) return
    const timer = setInterval(() => {
      setIndex(i => (i + VISIBLE_COUNT > maxIndex ? 0 : i + VISIBLE_COUNT))
    }, 5000)
    return () => clearInterval(timer)
  }, [maxIndex, posts.length])

  if (!cat) return null
  const displayName = decodeHtml(name || cat.name)
  const visiblePosts = posts.slice(index, index + VISIBLE_COUNT)

  const goPrev = () => setIndex(i => Math.max(0, i - VISIBLE_COUNT))
  const goNext = () => setIndex(i => (i + VISIBLE_COUNT > maxIndex ? 0 : i + VISIBLE_COUNT))

  return (
    <section className="py-6">
      <div className="flex items-center justify-between border-b-2 border-primary pb-2 mb-5">
        <h2 className="font-serif-headline text-2xl font-bold flex items-center gap-2">
          <span className="w-1 h-7 bg-primary inline-block" />
          {displayName}
        </h2>
        <Link to={`/category/${cat.slug}`} className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-5">
          {[...Array(VISIBLE_COUNT)].map((_, i) => (
            <div key={i} className="h-80 rounded-2xl overflow-hidden bg-white border border-border flex flex-col">
              <div className="flex-1 skeleton-shimmer" />
              <div className="p-4 space-y-2 bg-white/40">
                <div className="h-2.5 w-1/3 rounded skeleton-shimmer" />
                <div className="h-3.5 w-full rounded skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="flex items-stretch gap-3">
          {/* Previous arrow — sits in front of the row */}
          <button
            type="button"
            onClick={goPrev}
            disabled={index === 0}
            aria-label="Previous"
            className="shrink-0 self-center w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none shadow-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Card row */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {visiblePosts.map(p => (
              <LifestyleCard key={p.id} post={p} categoryName={displayName} />
            ))}
          </div>

          {/* Next arrow — placed right after the last card */}
          <button
            type="button"
            onClick={goNext}
            disabled={posts.length <= VISIBLE_COUNT}
            aria-label="Next"
            className="shrink-0 self-center w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none shadow-sm"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  )
}

function LifestyleCard({ post, categoryName }) {
  const img = getLargeImage(post) || getFeaturedImage(post) || FALLBACK_IMAGE
  const excerpt = decodeHtml((post.excerpt?.rendered || '').replace(/<[^>]+>/g, '').trim())

  return (
    <Link
      to={`/article/${post.slug}`}
      className="group flex flex-col h-80 w-full bg-white rounded-[10px] p-1.5 border-4 border-transparent cursor-pointer transition-all duration-150 ease-in-out hover:border-red-600 hover:shadow-[10px_10px_0_#ef4444,20px_20px_0_#7f1d1d] hover:-translate-x-5 hover:-translate-y-5 active:shadow-none active:translate-x-0 active:translate-y-0"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-32 shrink-0 rounded-lg overflow-hidden bg-muted">
        <img
          src={img}
          alt={getImageAlt(post)}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-h-0 flex flex-col gap-2 p-2.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-serif-headline text-base font-bold text-foreground leading-snug line-clamp-1 flex-1">
            {decodeHtml(post.title?.rendered || '')}
          </h3>
          <span className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:rotate-[-45deg] group-hover:bg-red-100">
            <ArrowRight className="h-5 w-5 text-foreground" />
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-snug line-clamp-3 flex-1">
          {excerpt}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded-full text-[11px] tracking-tight">
            • {categoryName}
          </span>
          <span className="bg-muted text-muted-foreground font-bold px-2.5 py-1 rounded-full text-[11px] tracking-tight">
            • {timeAgo(post.date)}
          </span>
        </div>
      </div>
    </Link>
  )
}
