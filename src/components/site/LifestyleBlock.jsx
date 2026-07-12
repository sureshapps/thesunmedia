import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { postsKey, categoryBySlugKey, getLargeImage, getFeaturedImage, getImageAlt, decodeHtml, timeAgo, asArray, FALLBACK_IMAGE } from '@/lib/wp'

// Full-width "Lifestyle" section — big featured card on the left,
// 2x2 grid of smaller cards on the right. Fetches up to 20 posts total,
// scrolls 5 at a time (1 featured + 4 grid cards).
const VISIBLE_COUNT = 5
const MAX_ITEMS = 20
const VIEW_MORE_URL = 'https://www.thesunit.my/category/lifestyle'

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
  const pageCount = Math.max(1, Math.ceil(posts.length / VISIBLE_COUNT))
  const currentPage = Math.floor(index / VISIBLE_COUNT)

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
  const [featured, ...rest] = visiblePosts

  const goPrev = () => setIndex(i => Math.max(0, i - VISIBLE_COUNT))
  const goNext = () => setIndex(i => (i + VISIBLE_COUNT > maxIndex ? 0 : i + VISIBLE_COUNT))

  return (
    <section className="py-6">
      <div className="flex items-center justify-between border-b-2 border-primary pb-2 mb-5">
        <h2 className="font-serif-headline text-2xl font-bold flex items-center gap-2">
          <span className="w-1 h-7 bg-primary inline-block" />
          {displayName}
        </h2>

        <div className="flex items-center gap-3">
          {/* Page dots */}
          {pageCount > 1 && (
            <div className="hidden sm:flex items-center gap-1.5">
              {[...Array(pageCount)].map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentPage ? 'w-5 bg-red-600' : 'w-1.5 bg-border'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Prev / next */}
          <button
            type="button"
            onClick={goPrev}
            disabled={index === 0}
            aria-label="Previous"
            className="w-9 h-9 rounded-full border border-border bg-white flex items-center justify-center hover:border-red-600 hover:text-red-600 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={posts.length <= VISIBLE_COUNT}
            aria-label="Next"
            className="w-9 h-9 rounded-full border border-border bg-white flex items-center justify-center hover:border-red-600 hover:text-red-600 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* View more */}
          <a
            href={VIEW_MORE_URL}
            className="inline-flex items-center bg-red-600 text-white text-xs font-bold uppercase tracking-wide px-4 py-2.5 rounded-full hover:bg-red-700 transition-colors"
          >
            View More
          </a>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="h-80 sm:flex-[2] rounded-2xl overflow-hidden bg-white border border-border skeleton-shimmer" />
          <div className="sm:flex-[3] grid grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-36 sm:h-40 rounded-2xl overflow-hidden bg-white border border-border skeleton-shimmer" />
            ))}
          </div>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch gap-5">
          {/* Featured card — height matches the 2x2 grid on the right */}
          {featured && (
            <div className="sm:flex-[2]">
              <FeaturedCard post={featured} categoryName={displayName} />
            </div>
          )}

          {/* 2x2 grid of smaller cards */}
          <div className="sm:flex-[3] grid grid-cols-2 gap-5">
            {rest.map(p => (
              <SmallCard key={p.id} post={p} categoryName={displayName} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function FeaturedCard({ post, categoryName }) {
  const img = getLargeImage(post) || getFeaturedImage(post) || FALLBACK_IMAGE

  return (
    <Link
      to={`/article/${post.slug}`}
      className="group relative flex h-64 sm:h-full min-h-[21rem] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300"
    >
      <img
        src={img}
        alt={getImageAlt(post)}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {/* Bottom gradient so the title stays legible */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Category badge */}
      <span className="relative m-4 self-start inline-flex items-center text-white text-[11px] font-bold uppercase tracking-wide bg-red-600 px-3 py-1 rounded-full">
        {categoryName}
      </span>

      {/* Title, bottom-aligned */}
      <h3 className="relative mt-auto p-4 pt-0 font-serif-headline text-lg sm:text-xl font-bold leading-snug text-white line-clamp-3">
        {decodeHtml(post.title?.rendered || '')}
      </h3>
    </Link>
  )
}

function SmallCard({ post, categoryName }) {
  const img = getLargeImage(post) || getFeaturedImage(post) || FALLBACK_IMAGE

  return (
    <Link
      to={`/article/${post.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-border shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-24 sm:h-28 overflow-hidden">
        <img
          src={img}
          alt={getImageAlt(post)}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 text-white text-[10px] font-medium bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
          <Clock className="h-2.5 w-2.5" />
          {timeAgo(post.date)}
        </span>
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-wide text-white bg-red-600 self-start px-2 py-0.5 rounded-full">
          {categoryName}
        </span>
        <h3 className="mt-1.5 font-serif-headline text-sm font-bold leading-snug line-clamp-2 text-foreground group-hover:text-red-700 transition-colors">
          {decodeHtml(post.title?.rendered || '')}
        </h3>
      </div>
    </Link>
  )
}
