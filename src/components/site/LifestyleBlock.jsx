import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { postsKey, categoryBySlugKey, getLargeImage, getFeaturedImage, getImageAlt, decodeHtml, asArray, FALLBACK_IMAGE } from '@/lib/wp'

// Full-width "Lifestyle" section — hero + 2x2 grid layout.
// 1 hero card (large) + 4 grid cards visible per page, 5 pages max (20 posts / 5 per page).
// Auto-advances to the next page every 7 seconds, loops back to the start.
// Mobile stacks the hero above the 2x2 grid, with pagination dots + "All Stories" button below.
const PAGE_SIZE = 5
const MAX_ITEMS = 20
const AUTO_ADVANCE_MS = 7000

// Pull the primary category name from an embedded post (WP REST _embed).
function getCategoryName(post) {
  return post?._embedded?.['wp:term']?.[0]?.[0]?.name || null
}

export default function LifestyleBlock({ slug = 'lifestyle', name = 'Lifestyle' }) {
  const { data: catsRaw } = useSWR(categoryBySlugKey(slug))
  const cats = asArray(catsRaw)
  const cat = cats[0]
  const { data: postsRaw } = useSWR(
    cat ? postsKey({ categories: cat.id, per_page: MAX_ITEMS, _embed: 1 }) : null
  )

  const [page, setPage] = useState(0)

  const loading = !postsRaw || !Array.isArray(postsRaw)
  const posts = asArray(postsRaw).slice(0, MAX_ITEMS)

  const pages = []
  for (let i = 0; i < posts.length; i += PAGE_SIZE) pages.push(posts.slice(i, i + PAGE_SIZE))
  const pageCount = pages.length
  const safePage = pageCount > 0 ? Math.min(page, pageCount - 1) : 0

  // Auto-advance to the next page every 7 seconds, looping back to the start.
  // This must stay above any early return so hook order never changes between renders.
  useEffect(() => {
    if (pageCount <= 1) return
    const timer = setInterval(() => {
      setPage(p => (p + 1 >= pageCount ? 0 : p + 1))
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(timer)
  }, [pageCount])

  if (!cat) return null
  const displayName = decodeHtml(name || cat.name)
  const current = pages[safePage] || []
  const hero = current[0]
  const rest = current.slice(1, 5)

  const goPrev = () => setPage(p => (p - 1 < 0 ? pageCount - 1 : p - 1))
  const goNext = () => setPage(p => (p + 1 >= pageCount ? 0 : p + 1))

  const dots = pageCount > 1 && (
    <div className="flex items-center gap-1.5">
      {pages.map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setPage(i)}
          aria-label={`Go to page ${i + 1}`}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === safePage ? 'w-6 bg-primary' : 'w-1.5 bg-border hover:bg-primary/40'
          }`}
        />
      ))}
    </div>
  )

  return (
    <section className="py-6">
      {/* Header — title, pagination dots (desktop), prev/next arrows, view-more button (desktop) */}
      <div className="flex items-center justify-between border-b-2 border-primary pb-2 mb-5 gap-3">
        <h2 className="font-serif-headline text-2xl font-bold flex items-center gap-2 shrink-0">
          <span className="w-1 h-7 bg-primary inline-block" />
          {displayName}
        </h2>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Pagination dots — desktop only, mobile shows them below the grid instead */}
          {pageCount > 1 && <div className="hidden sm:flex">{dots}</div>}

          {/* Prev / Next arrows */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={goPrev}
              disabled={pageCount <= 1}
              aria-label="Previous"
              className="w-8 h-8 rounded-full border border-border bg-white flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={pageCount <= 1}
              aria-label="Next"
              className="w-8 h-8 rounded-full border border-border bg-white flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* View More — desktop only, mobile shows "All Stories" below the grid instead */}
          <Link
            to={`/category/${cat.slug}`}
            className="hidden sm:inline-flex text-xs font-bold uppercase tracking-wide bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded transition-colors whitespace-nowrap"
          >
            View More
          </Link>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="h-64 sm:h-[420px] sm:w-[38%] rounded-2xl skeleton-shimmer shrink-0" />
          <div className="flex-1 grid grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 sm:h-[200px] rounded-2xl skeleton-shimmer" />
            ))}
          </div>
        </div>
      )}

      {/* Content — hero card + 2x2 grid, stacked on mobile / side-by-side on desktop */}
      {!loading && current.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-5">
          {hero && (
            <div className="sm:w-[38%] shrink-0">
              <LifestyleHeroCard post={hero} />
            </div>
          )}
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-5">
            {rest.map(p => (
              <LifestyleGridCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile-only pagination dots + "All Stories" button, below the grid */}
      {!loading && current.length > 0 && (
        <div className="sm:hidden mt-5 flex flex-col items-center gap-4">
          {pageCount > 1 && dots}
          <Link
            to={`/category/${cat.slug}`}
            className="w-full text-center text-sm font-bold uppercase tracking-wide bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg transition-colors inline-flex items-center justify-center gap-1"
          >
            All Stories
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  )
}

function LifestyleHeroCard({ post }) {
  const img = getLargeImage(post) || getFeaturedImage(post) || FALLBACK_IMAGE
  const category = getCategoryName(post)

  return (
    <Link
      to={`/article/${post.slug}`}
      className="group relative block w-full h-64 sm:h-[420px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300"
    >
      <img
        src={img}
        alt={getImageAlt(post)}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      {/* Bottom gradient so the badge + title stay legible over the image */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

      <div className="relative h-full flex flex-col justify-end p-4 sm:p-5">
        {category && (
          <span className="self-start mb-2 inline-block text-[11px] font-bold uppercase tracking-wide text-white bg-orange-500 px-2.5 py-1 rounded">
            {decodeHtml(category)}
          </span>
        )}
        <h3 className="font-serif-headline text-lg sm:text-xl font-bold leading-snug text-white line-clamp-3">
          {decodeHtml(post.title?.rendered || '')}
        </h3>
      </div>
    </Link>
  )
}

function LifestyleGridCard({ post }) {
  const img = getLargeImage(post) || getFeaturedImage(post) || FALLBACK_IMAGE
  const category = getCategoryName(post)

  return (
    <Link
      to={`/article/${post.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-border shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden shrink-0">
        <img
          src={img}
          alt={getImageAlt(post)}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {category && (
          <span className="absolute left-2 bottom-2 text-[10px] font-bold uppercase tracking-wide text-white bg-orange-500 px-2 py-1 rounded">
            {decodeHtml(category)}
          </span>
        )}
      </div>
      <div className="p-3 flex-1 flex items-start">
        <h3 className="font-serif-headline text-sm font-bold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {decodeHtml(post.title?.rendered || '')}
        </h3>
      </div>
    </Link>
  )
}
