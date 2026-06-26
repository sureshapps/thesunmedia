import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { ChevronRight, Flame } from 'lucide-react'
import { getFeaturedImage, getImageAlt, getPrimaryCategory, decodeHtml, timeAgo, FALLBACK_IMAGE } from '@/lib/wp'
import { postsKey, categoryBySlugKey } from '@/lib/wp'

const VIRAL_BG = '#8B0000'

function ViralCard({ post }) {
  if (!post) return null
  const img = getFeaturedImage(post) || FALLBACK_IMAGE
  const cat = getPrimaryCategory(post)
  return (
    <Link to={`/article/${post.slug}`} className="group block">
      <div className="aspect-[4/3] overflow-hidden rounded-md bg-white/10">
        <img
          src={img}
          alt={getImageAlt(post)}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-3">
        {cat && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 block mb-1">
            {cat.name}
          </span>
        )}
        <h3 className="font-serif-headline font-bold text-white text-base leading-snug line-clamp-3 group-hover:text-white/80 transition-colors">
          {decodeHtml(post.title?.rendered || '')}
        </h3>
        <div className="mt-2 text-xs text-white/50">{timeAgo(post.date)}</div>
      </div>
    </Link>
  )
}

function ViralCardSkeleton() {
  return (
    <div>
      <div className="aspect-[4/3] rounded-md bg-white/10 animate-pulse" />
      <div className="mt-3 space-y-2">
        <div className="h-2.5 w-16 bg-white/20 rounded animate-pulse" />
        <div className="h-4 w-full bg-white/20 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-white/20 rounded animate-pulse" />
      </div>
    </div>
  )
}

export default function GoingViralBlock() {
  const { data: cats } = useSWR(categoryBySlugKey('going-viral'))
  const cat = cats?.[0]
  const { data: posts } = useSWR(
    cat ? postsKey({ categories: cat.id, per_page: 9 }) : null
  )
  const loading = !posts

  return (
    <section className="rounded-lg overflow-hidden" style={{ backgroundColor: VIRAL_BG }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/20">
        <h2 className="font-serif-headline text-2xl font-bold text-white flex items-center gap-2">
          <Flame className="h-6 w-6 text-white/80 fill-white/40" />
          Going Viral
        </h2>
        <Link
          to="/category/going-viral"
          className="text-xs font-semibold text-white/70 hover:text-white inline-flex items-center gap-1 transition-colors"
        >
          View all <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 3-column grid */}
      <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? [...Array(6)].map((_, i) => <ViralCardSkeleton key={i} />)
          : (posts || []).slice(0, 9).map(p => <ViralCard key={p.id} post={p} />)
        }
      </div>
    </section>
  )
}
