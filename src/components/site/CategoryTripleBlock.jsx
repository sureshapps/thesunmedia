import useSWR from 'swr'
import { Link } from 'react-router-dom'
import {
  postsKey, categoryBySlugKey,
  getThumbnail, getImageAlt, getPrimaryCategory, decodeHtml, asArray, FALLBACK_IMAGE,
} from '@/lib/wp'

// Post time shown as a plain 24h clock (e.g. "14:20"), matching the reference —
// not a relative "Xh ago" stamp like the other blocks use.
function formatTimeHM(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: false })
  } catch {
    return ''
  }
}

function MiniItem({ post }) {
  const cat = getPrimaryCategory(post)
  return (
    <Link
      to={`/article/${post.slug}`}
      className="group flex gap-4 py-4 border-b border-border/70 last:border-b-0"
    >
      <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-md overflow-hidden bg-muted">
        <img
          src={getThumbnail(post) || FALLBACK_IMAGE}
          alt={getImageAlt(post)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-primary font-bold text-xs sm:text-sm uppercase tracking-wide truncate">
            {cat ? decodeHtml(cat.name) : 'Most Viewed'}
          </span>
          <span className="text-muted-foreground text-xs sm:text-sm shrink-0">
            {formatTimeHM(post.date)}
          </span>
        </div>
        <h4 className="font-serif-headline font-bold text-base sm:text-lg leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-3">
          {decodeHtml(post.title?.rendered || '')}
        </h4>
      </div>
    </Link>
  )
}

function MiniItemSkeleton() {
  return (
    <div className="flex gap-4 py-4 border-b border-border/70 last:border-b-0">
      <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-md skeleton-shimmer" />
      <div className="min-w-0 flex-1 space-y-2.5 pt-1">
        <div className="h-3 w-20 skeleton-shimmer rounded" />
        <div className="h-4 w-full skeleton-shimmer rounded" />
        <div className="h-4 w-2/3 skeleton-shimmer rounded" />
      </div>
    </div>
  )
}

function CategoryColumn({ slug, label }) {
  const { data: catsRaw } = useSWR(categoryBySlugKey(slug))
  const cats = asArray(catsRaw)
  const cat = cats[0]
  const { data: postsRaw } = useSWR(cat ? postsKey({ categories: cat.id, per_page: 3 }) : null)
  const posts = asArray(postsRaw)
  const loading = !cat || !postsRaw

  return (
    <div>
      {/* Header: red label block, black rule filling the gap, "view more" at the end */}
      <div className="flex items-center gap-3 mb-1">
        <span className="bg-primary text-white font-extrabold italic uppercase tracking-wide text-lg sm:text-xl px-5 py-2.5 shrink-0">
          {label}
        </span>
        <span className="flex-1 h-[3px] bg-foreground/90" />
        <Link
          to={`/category/${slug}`}
          className="shrink-0 text-primary font-bold text-sm hover:underline"
        >
          view more
        </Link>
      </div>

      <div>
        {loading
          ? [...Array(3)].map((_, i) => <MiniItemSkeleton key={i} />)
          : posts.slice(0, 3).map((p) => <MiniItem key={p.id} post={p} />)}
      </div>
    </div>
  )
}

/**
 * Three-column row of mini category blocks (e.g. Education / Motoring / Property).
 * Each column fetches its own category id + latest posts independently, so
 * columns load and render on their own timeline rather than waiting on each other.
 *
 * Usage:
 *   <CategoryTripleBlock columns={[
 *     { slug: 'education', label: 'Education' },
 *     { slug: 'motoring', label: 'Motoring' },
 *     { slug: 'property', label: 'Property' },
 *   ]} />
 */
export default function CategoryTripleBlock({ columns }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-10">
      {columns.map((c) => (
        <CategoryColumn key={c.slug} slug={c.slug} label={c.label} />
      ))}
    </div>
  )
}
