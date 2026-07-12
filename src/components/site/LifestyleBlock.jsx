import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { postsKey, categoryBySlugKey, getLargeImage, getFeaturedImage, getThumbnail, getImageAlt, decodeHtml, stripHtml, timeAgo, asArray, FALLBACK_IMAGE } from '@/lib/wp'

// Full-width "Lifestyle" section — purple themed, sits outside the sidebar grid.
// Card map: hero (Top Story) + 2 compact info cards (Featured / Highlight)
// + 1 wide info card (desktop only) + a 4-item image list on the right.
export default function LifestyleBlock({ slug = 'lifestyle', name = 'Lifestyle' }) {
  const { data: catsRaw } = useSWR(categoryBySlugKey(slug))
  const cats = asArray(catsRaw)
  const cat = cats[0]
  const { data: postsRaw } = useSWR(
    cat ? postsKey({ categories: cat.id, per_page: 8 }) : null
  )

  if (!cat) return null
  const loading = !postsRaw || !Array.isArray(postsRaw)
  const posts = asArray(postsRaw)
  const displayName = decodeHtml(name || cat.name)

  const hero = posts[0]
  const cardFeatured = posts[1]
  const cardHighlight = posts[2]
  const cardWide = posts[3]
  const listItems = posts.slice(4, 8)

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 h-[220px] lg:h-[300px] rounded-2xl skeleton-shimmer" />
          <div className="lg:col-span-2 h-[220px] lg:h-[300px] rounded-2xl skeleton-shimmer" />
          <div className="lg:col-span-2 h-[220px] lg:h-[300px] rounded-2xl skeleton-shimmer" />
          <div className="hidden lg:block lg:col-span-2 h-[300px] rounded-2xl skeleton-shimmer" />
          <div className="lg:col-span-2 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-[68px] rounded-xl skeleton-shimmer" />)}
          </div>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Hero card — Top Story */}
          {hero && (
            <Link
              to={`/article/${hero.slug}`}
              className="lg:col-span-4 group relative flex flex-row overflow-hidden rounded-2xl bg-gradient-to-br from-white via-purple-50 to-purple-200 border border-purple-100"
            >
              <div className="flex-1 min-w-0 p-5 flex flex-col justify-center">
                <span className="self-start bg-purple-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3">
                  Top Story
                </span>
                <h3 className="font-serif-headline text-lg sm:text-xl font-bold leading-tight line-clamp-3 group-hover:text-purple-700 transition-colors">
                  {decodeHtml(hero.title?.rendered || '')}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {stripHtml(hero.excerpt?.rendered, 100)}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 bg-purple-600 group-hover:bg-purple-700 transition-colors text-white text-xs font-semibold px-4 py-2 rounded-full w-fit">
                  Read Full Story <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="w-[42%] sm:w-[45%] shrink-0 relative">
                <img
                  src={getLargeImage(hero) || FALLBACK_IMAGE}
                  alt={getImageAlt(hero)}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-200/80 via-purple-300/20 to-transparent mix-blend-multiply" />
              </div>
            </Link>
          )}

          {/* Featured compact card */}
          {cardFeatured && (
            <Link
              to={`/article/${cardFeatured.slug}`}
              className="lg:col-span-2 group flex flex-col overflow-hidden rounded-2xl bg-purple-50 border border-purple-100"
            >
              <div className="relative h-36 sm:h-40 shrink-0">
                <img
                  src={getFeaturedImage(cardFeatured) || FALLBACK_IMAGE}
                  alt={getImageAlt(cardFeatured)}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/60 to-purple-50" />
              </div>
              <div className="flex-1 flex flex-col p-4 pt-0">
                <h4 className="font-bold text-sm leading-snug line-clamp-3 group-hover:text-purple-700 transition-colors">
                  {decodeHtml(cardFeatured.title?.rendered || '')}
                </h4>
                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-3">
                  {stripHtml(cardFeatured.excerpt?.rendered, 80)}
                </p>
                <span className="mt-auto pt-3 inline-flex items-center gap-1 text-xs font-semibold text-purple-700">
                  Learn more <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          )}

          {/* Highlight compact card */}
          {cardHighlight && (
            <Link
              to={`/article/${cardHighlight.slug}`}
              className="lg:col-span-2 group flex flex-col overflow-hidden rounded-2xl bg-purple-50 border border-purple-100"
            >
              <div className="relative h-36 sm:h-40 shrink-0">
                <img
                  src={getFeaturedImage(cardHighlight) || FALLBACK_IMAGE}
                  alt={getImageAlt(cardHighlight)}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/60 to-purple-50" />
              </div>
              <div className="flex-1 flex flex-col p-4 pt-0">
                <h4 className="font-bold text-sm leading-snug line-clamp-3 group-hover:text-purple-700 transition-colors">
                  {decodeHtml(cardHighlight.title?.rendered || '')}
                </h4>
                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-3">
                  {stripHtml(cardHighlight.excerpt?.rendered, 80)}
                </p>
                <span className="mt-auto pt-3 inline-flex items-center gap-1 text-xs font-semibold text-purple-700">
                  Learn more <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          )}

          {/* Wide featured card — desktop only, matches mobile screenshot (not repeated on mobile) */}
          {cardWide && (
            <Link
              to={`/article/${cardWide.slug}`}
              className="hidden lg:flex lg:col-span-2 relative flex-col overflow-hidden rounded-2xl text-white group"
            >
              <img
                src={getLargeImage(cardWide) || getFeaturedImage(cardWide) || FALLBACK_IMAGE}
                alt={getImageAlt(cardWide)}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-700/70 via-purple-800/80 to-purple-950/90" />
              <div className="relative flex-1 flex flex-col p-4">
                <span className="self-start bg-white/20 backdrop-blur text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3">
                  Featured
                </span>
                <h4 className="mt-auto font-bold text-sm leading-snug line-clamp-3">
                  {decodeHtml(cardWide.title?.rendered || '')}
                </h4>
                <p className="mt-1.5 text-xs text-white/80 line-clamp-3">
                  {stripHtml(cardWide.excerpt?.rendered, 90)}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold">
                  Learn more <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          )}

          {/* Right-hand list column */}
          {listItems.length > 0 && (
            <div className="lg:col-span-2 flex flex-col gap-3">
              {listItems.map(p => (
                <Link
                  key={p.id}
                  to={`/article/${p.slug}`}
                  className="group flex items-center gap-3 rounded-xl bg-purple-50/60 hover:bg-purple-50 transition-colors border border-purple-100 p-2"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={getThumbnail(p) || FALLBACK_IMAGE}
                      alt={getImageAlt(p)}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold leading-snug line-clamp-2 group-hover:text-purple-700 transition-colors">
                      {decodeHtml(p.title?.rendered || '')}
                    </h5>
                    <div className="mt-1 text-[10px] text-muted-foreground">{timeAgo(p.date)}</div>
                  </div>
                  <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <ArrowRight className="h-3 w-3 text-purple-600 group-hover:text-white transition-colors" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
