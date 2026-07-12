import { useState } from 'react'
import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight, Clock } from 'lucide-react'
import { postsKey, categoryBySlugKey, getLargeImage, getFeaturedImage, getImageAlt, decodeHtml, stripHtml, timeAgo, asArray, FALLBACK_IMAGE } from '@/lib/wp'

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

  if (!cat) return null
  const loading = !postsRaw || !Array.isArray(postsRaw)
  const posts = asArray(postsRaw).slice(0, MAX_ITEMS)
  const displayName = decodeHtml(name || cat.name)

  const maxIndex = Math.max(0, posts.length - VISIBLE_COUNT)
  const visiblePosts = posts.slice(index, index + VISIBLE_COUNT)

  const goPrev = () => setIndex(i => Math.max(0, i - 1))
  const goNext = () => setIndex(i => Math.min(maxIndex, i + 1))

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
            <div key={i} className="rounded-2xl overflow-hidden bg-white border border-border">
              <div className="h-40 skeleton-shimmer" />
              <div className="p-4 space-y-2">
                <div className="h-2.5 w-1/3 rounded skeleton-shimmer" />
                <div className="h-3.5 w-full rounded skeleton-shimmer" />
                <div className="h-3.5 w-2/3 rounded skeleton-shimmer" />
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
            disabled={index >= maxIndex}
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

  return (
    <Link
      to={`/article/${post.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-40 shrink-0 overflow-hidden">
        <img
          src={img}
          alt={getImageAlt(post)}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Hover overlay with time */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <span className="inline-flex items-center gap-1 text-white text-[11px] font-medium">
            <Clock className="h-3 w-3" />
            {timeAgo(post.date)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-red-600">
          {categoryName}
        </span>
        <h3 className="mt-1.5 font-serif-headline text-sm font-bold leading-snug line-clamp-3 group-hover:text-red-700 transition-colors">
          {decodeHtml(post.title?.rendered || '')}
        </h3>
        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
          {stripHtml(post.excerpt?.rendered, 70)}
        </p>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">
            {author ? `by ${author}` : timeAgo(post.date)}
          </span>
          <span className="shrink-0 w-6 h-6 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-600 transition-colors">
            <ArrowRight className="h-3 w-3 text-red-600 group-hover:text-white transition-colors" />
          </span>
        </div>
      </div>
    </Link>
  )
}
