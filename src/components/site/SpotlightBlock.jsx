import { useState } from 'react'
import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  getFeaturedImage, getImageAlt, getPrimaryCategory, getAuthor,
  decodeHtml, timeAgo, FALLBACK_IMAGE, postsKey, categoryBySlugKey, asArray,
} from '@/lib/wp'

const PER_PAGE = 4

/* ---------- Large image card, numbered "01" overlaid at bottom ---------- */
function SpotlightFeature({ post, rank }) {
  if (!post) return null
  const img = getFeaturedImage(post) || FALLBACK_IMAGE
  return (
    <Link
      to={`/article/${post.slug}`}
      className="group relative block aspect-[4/3] sm:aspect-[3/4] rounded-md overflow-hidden bg-muted"
    >
      <img
        src={img}
        alt={getImageAlt(post)}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="font-serif-headline text-3xl font-extrabold text-white/70 leading-none select-none">
          {String(rank).padStart(2, '0')}
        </span>
        <h3 className="mt-1 font-serif-headline font-bold text-white text-base leading-snug line-clamp-3">
          {decodeHtml(post.title?.rendered || '')}
        </h3>
      </div>
    </Link>
  )
}

function SpotlightFeatureSkeleton() {
  return <div className="aspect-[4/3] sm:aspect-[3/4] rounded-md skeleton-shimmer" />
}

/* ---------- Small text card, numbered, category tag + byline ---------- */
function SpotlightItem({ post, rank }) {
  if (!post) return null
  const cat = getPrimaryCategory(post)
  const author = getAuthor(post)
  return (
    <Link
      to={`/article/${post.slug}`}
      className="group flex flex-col h-full border border-border rounded-md p-4"
    >
      <span className="font-serif-headline text-3xl font-extrabold text-muted-foreground/25 leading-none select-none">
        {String(rank).padStart(2, '0')}
      </span>
      {cat && (
        <span className="mt-2 inline-block w-fit bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
          {cat.name}
        </span>
      )}
      <h4 className="mt-2 font-semibold text-sm leading-snug line-clamp-3 group-hover:text-primary transition-colors">
        {decodeHtml(post.title?.rendered || '')}
      </h4>
      <div className="mt-auto pt-3 text-[11px] text-muted-foreground">
        {author.name} · {timeAgo(post.date)}
      </div>
    </Link>
  )
}

function SpotlightItemSkeleton() {
  return (
    <div className="border border-border rounded-md p-4 space-y-2 h-full">
      <div className="h-7 w-8 skeleton-shimmer rounded" />
      <div className="h-4 w-full skeleton-shimmer rounded" />
      <div className="h-4 w-2/3 skeleton-shimmer rounded" />
      <div className="h-3 w-1/2 skeleton-shimmer rounded" />
    </div>
  )
}

export default function SpotlightBlock() {
  const { data: cats } = useSWR(categoryBySlugKey('spotlight'))
  const cat = cats?.[0]
  const [page, setPage] = useState(1)

  const { data: posts } = useSWR(
    cat ? postsKey({ categories: cat.id, per_page: PER_PAGE, page, _embed: 1 }) : null
  )
  const loading = !posts || !Array.isArray(posts)
  const postsArr = asArray(posts)
  const hasNext = !loading && postsArr.length >= PER_PAGE
  const hasPrev = page > 1

  return (
    <section>
      {/* Header — red SPOTLIGHT tab + prev/next */}
      <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
        <span className="inline-block bg-primary text-white font-extrabold italic uppercase tracking-wide text-base sm:text-lg px-4 py-1.5 rounded-sm">
          Spotlight
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!hasPrev}
            aria-label="Previous"
            className="w-8 h-8 flex items-center justify-center border border-border rounded hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!hasNext}
            aria-label="Next"
            className="w-8 h-8 flex items-center justify-center border border-border rounded hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 1 large card + 3 small cards. 2-col on mobile (feature spans both), 4-col on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {loading ? (
          <>
            <div className="col-span-2 lg:col-span-1"><SpotlightFeatureSkeleton /></div>
            {[...Array(3)].map((_, i) => <SpotlightItemSkeleton key={i} />)}
          </>
        ) : (
          <>
            <div className="col-span-2 lg:col-span-1">
              <SpotlightFeature post={postsArr[0]} rank={(page - 1) * PER_PAGE + 1} />
            </div>
            {postsArr.slice(1, 4).map((p, i) => (
              <SpotlightItem key={p.id} post={p} rank={(page - 1) * PER_PAGE + i + 2} />
            ))}
          </>
        )}
      </div>
    </section>
  )
}
