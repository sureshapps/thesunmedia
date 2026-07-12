import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight, Clock } from 'lucide-react'
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
  const author = post?._embedded?.author?.[0]?.name
  const img = getLargeImage(post) || getFeaturedImage(post) || FALLBACK_IMAGE
  const excerpt = decodeHtml((post.excerpt?.rendered || '').replace(/<[^>]+>/g, ''))

  return (
    <Link
      to={`/article/${post.slug}`}
      className="group relative block h-[400px] w-full rounded-2xl overflow-hidden shadow-[0_0_20px_8px_rgba(0,0,0,0.08)] transition-all duration-300"
    >
      {/* Card image — fills the entire card, revealed as the description slides away */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={img}
          alt={getImageAlt(post)}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {/* Time badge, top corner, over the image */}
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-white text-[11px] font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
          <Clock className="h-3 w-3" />
          {timeAgo(post.date)}
        </span>
      </div>

      {/* Description panel — covers bottom 70%, slides fully down on hover to reveal the image */}
      <div className="absolute inset-x-0 bottom-0 h-[70%] flex flex-col gap-2 bg-[#f5f5f5] text-foreground rounded-2xl p-4 transition-transform duration-1000 ease-[cubic-bezier(0.645,0.045,0.355,1)] group-hover:translate-y-full">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-red-600">
          {categoryName}
        </span>
        <p className="font-serif-headline text-lg font-bold leading-snug line-clamp-3">
          {decodeHtml(post.title?.rendered || '')}
        </p>
        <p className="text-sm leading-snug text-muted-foreground line-clamp-4">
          {excerpt}
        </p>
        <span className="text-[11px] font-medium text-muted-foreground truncate">
          {author ? `by ${author}` : timeAgo(post.date)}
        </span>

        {/* Read more, pinned to the bottom of the description panel */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-black/10">
          <span className="text-xs font-semibold uppercase tracking-wider text-red-600 group-hover:text-red-700 transition-colors">
            Read more
          </span>
          <span className="shrink-0 w-6 h-6 rounded-full bg-red-600/10 flex items-center justify-center group-hover:bg-red-600 transition-colors">
            <ArrowRight className="h-3 w-3 text-red-600 group-hover:text-white transition-colors" />
          </span>
        </div>
      </div>
    </Link>
  )
}
