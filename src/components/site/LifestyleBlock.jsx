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
         
          {/* Card row */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {visiblePosts.map(p => (
              <LifestyleCard key={p.id} post={p} categoryName={displayName} />
            ))}
          </div>

          {/* Next arrow — placed right after the last card */}
       
        </div>
      )}
    </section>
  )
}

function LifestyleCard({ post, categoryName }) {
  const author = post?._embedded?.author?.[0]?.name
  const img = getLargeImage(post) || getFeaturedImage(post) || FALLBACK_IMAGE

  return (
    <Link
      to={`/article/${post.slug}`}
      className="group relative flex flex-col h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Full-bleed background image */}
      <img
        src={img}
        alt={getImageAlt(post)}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      {/* Subtle top gradient so the category tag stays legible */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />

      {/* Time badge, top corner */}
      <span className="relative m-3 self-end inline-flex items-center gap-1 text-white text-[11px] font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
        <Clock className="h-3 w-3" />
        {timeAgo(post.date)}
      </span>

      {/* Frosted glassmorphic info panel — floats as a rounded glass card over the image */}
      <div className="relative mx-3 mb-3 mt-auto p-4 rounded-2xl bg-white/30 backdrop-blur-2xl border border-white/50 shadow-[0_8px_24px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.6)]">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-red-600 drop-shadow-sm">
          {categoryName}
        </span>
        <h3 className="mt-1 font-serif-headline text-sm font-bold leading-snug line-clamp-2 text-foreground group-hover:text-red-700 transition-colors">
          {decodeHtml(post.title?.rendered || '')}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground truncate">
            {author ? `by ${author}` : timeAgo(post.date)}
          </span>
          <span className="shrink-0 w-6 h-6 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center group-hover:bg-red-600 transition-colors">
            <ArrowRight className="h-3 w-3 text-red-600 group-hover:text-white transition-colors" />
          </span>
        </div>
      </div>
    </Link>
  )
}
