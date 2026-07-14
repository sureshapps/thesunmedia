import { useState } from 'react'
import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { postsKey, getFeaturedImage, getImageAlt, getPrimaryCategory, decodeHtml, FALLBACK_IMAGE, asArray } from '@/lib/wp'

const PER_PAGE = 5

function MostViewedItem({ post, rank }) {
  if (!post) return null
  const img = getFeaturedImage(post) || FALLBACK_IMAGE
  const cat = getPrimaryCategory(post)
  return (
    <Link to={`/article/${post.slug}`} className="group flex items-center gap-4 py-4 border-b border-border last:border-0">
      <div className="w-20 h-16 sm:w-24 sm:h-20 shrink-0 overflow-hidden rounded bg-muted">
        <img
          src={img}
          alt={getImageAlt(post)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm sm:text-[15px] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {decodeHtml(post.title?.rendered || '')}
        </h4>
        {cat && (
          <span className="mt-1.5 inline-block text-xs font-bold uppercase tracking-wider text-primary">
            | {cat.name} |
          </span>
        )}
      </div>
      <span className="font-serif-headline text-3xl sm:text-4xl font-extrabold text-muted-foreground/25 shrink-0 leading-none select-none">
        {rank}
      </span>
    </Link>
  )
}

function MostViewedItemSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-border last:border-0">
      <div className="w-20 h-16 sm:w-24 sm:h-20 shrink-0 rounded skeleton-shimmer" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-full skeleton-shimmer rounded" />
        <div className="h-4 w-2/3 skeleton-shimmer rounded" />
        <div className="h-3 w-16 skeleton-shimmer rounded" />
      </div>
    </div>
  )
}

export default function MostViewedBlock() {
  const [page, setPage] = useState(1)
  const { data: posts } = useSWR(
    postsKey({ per_page: PER_PAGE, page, orderby: 'modified', order: 'desc' })
  )
  const loading = !posts || !Array.isArray(posts)
  const postsArr = asArray(posts)
  const hasNext = !loading && postsArr.length >= PER_PAGE

  return (
    <section className="border border-border rounded-md overflow-hidden h-fit">
      <div className="bg-primary text-white font-extrabold italic uppercase tracking-wide text-xl sm:text-2xl px-5 py-4">
        Most Viewed Stories
      </div>

      <div className="px-5">
        {loading
          ? [...Array(PER_PAGE)].map((_, i) => <MostViewedItemSkeleton key={i} />)
          : postsArr.map((p, i) => (
              <MostViewedItem key={p.id} post={p} rank={(page - 1) * PER_PAGE + i + 1} />
            ))}
      </div>

      <div className="flex items-center justify-between px-5 py-4 border-t border-border">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          aria-label="Previous"
          className="w-9 h-9 flex items-center justify-center border border-border rounded hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-xs text-muted-foreground">Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={!hasNext}
          aria-label="Next"
          className="w-9 h-9 flex items-center justify-center border border-border rounded hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}
