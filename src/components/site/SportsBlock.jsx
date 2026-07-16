import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import {
  postsKey, categoryBySlugKey,
  getLargeImage, getFeaturedImage, getThumbnail, getImageAlt, getTags,
  decodeHtml, stripHtml, asArray, FALLBACK_IMAGE,
} from '@/lib/wp'

function ListRow({ post }) {
  const tag = getTags(post)[0]
  return (
    <Link to={`/article/${post.slug}`} className="group flex gap-3 items-start py-2.5 first:pt-0">
      <div className="w-20 h-16 sm:w-24 sm:h-[4.5rem] shrink-0 overflow-hidden rounded-lg bg-muted">
        <img src={getThumbnail(post) || FALLBACK_IMAGE} alt={getImageAlt(post)} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="min-w-0">
        {tag && (
          <span className="inline-block bg-lime-400 text-black text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-sm mb-1">
            {decodeHtml(tag.name)}
          </span>
        )}
        <h4 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {decodeHtml(post.title?.rendered || '')}
        </h4>
      </div>
    </Link>
  )
}

function ListRowSkeleton() {
  return (
    <div className="flex gap-3 items-start py-2.5">
      <div className="w-20 h-16 sm:w-24 sm:h-[4.5rem] shrink-0 rounded-lg skeleton-shimmer" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3 w-full skeleton-shimmer rounded" />
        <div className="h-3 w-2/3 skeleton-shimmer rounded" />
      </div>
    </div>
  )
}

export default function SportsBlock({ slug = 'sports', name = 'Sport' }) {
  const { data: catsRaw } = useSWR(categoryBySlugKey(slug))
  const cats = asArray(catsRaw)
  const cat = cats[0]
  const { data: postsRaw } = useSWR(cat ? postsKey({ categories: cat.id, per_page: 6 }) : null)
  const posts = asArray(postsRaw)
  const loading = !cat || !postsRaw

  if (!loading && posts.length === 0) return null

  const hero = posts[0]
  const feature = posts[1]
  const listItems = posts.slice(2, 6)

  return (
    <section>
      {/* Hero banner with category label */}
      <Link
        to={cat ? `/category/${cat.slug}` : '#'}
        className="group relative block w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-neutral-200"
      >
        {loading ? (
          <div className="absolute inset-0 skeleton-shimmer" />
        ) : (
          <img
            src={getLargeImage(hero) || FALLBACK_IMAGE}
            alt={getImageAlt(hero)}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute bottom-16 sm:bottom-20 left-5 sm:left-7 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-orange-500 inline-block rounded-sm" />
          <h2 className="text-white text-2xl sm:text-3xl font-bold font-serif-headline">{decodeHtml(name)}</h2>
        </div>
      </Link>

      {/* Overlapping content card */}
      <div className="relative -mt-14 sm:-mt-16 mx-3 sm:mx-6 bg-white rounded-2xl shadow-xl border border-border/60 p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left — big feature story */}
          <div>
            {loading || !feature ? (
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-xl skeleton-shimmer" />
                <div className="h-5 w-4/5 skeleton-shimmer rounded" />
                <div className="h-3 w-full skeleton-shimmer rounded" />
                <div className="h-3 w-2/3 skeleton-shimmer rounded" />
              </div>
            ) : (
              <Link to={`/article/${feature.slug}`} className="group block">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted mb-3">
                  <img
                    src={getFeaturedImage(feature) || FALLBACK_IMAGE}
                    alt={getImageAlt(feature)}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-serif-headline text-xl sm:text-2xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-3">
                  {decodeHtml(feature.title?.rendered || '')}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {stripHtml(feature.excerpt?.rendered, 160)}
                </p>
              </Link>
            )}
          </div>

          {/* Right — headline list */}
          <div className="divide-y divide-border md:border-l md:border-border md:pl-6">
            {loading
              ? [...Array(4)].map((_, i) => <ListRowSkeleton key={i} />)
              : listItems.map((p) => <ListRow key={p.id} post={p} />)}
          </div>
        </div>

        <div className="flex justify-end mt-4 pt-4 border-t border-border">
          <Link
            to={cat ? `/category/${cat.slug}` : '#'}
            className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            See full coverage <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
