import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { getFeaturedImage, getLargeImage, getThumbnail, getImageAlt, getPrimaryCategory, decodeHtml, stripHtml, timeAgo, formatDate, FALLBACK_IMAGE } from '@/lib/wp'

export function HeroCard({ post }) {
  if (!post) return null
  const img = getLargeImage(post) || FALLBACK_IMAGE
  const cat = getPrimaryCategory(post)
  return (
    <Link to={`/article/${post.slug}`} className="group block relative overflow-hidden rounded-lg bg-black aspect-[16/10] sm:aspect-[16/9]">
      <img src={img} alt={getImageAlt(post)} loading="eager" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 text-white">
        {cat && (
          <span className="inline-block bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wider mb-3">{cat.name}</span>
        )}
        <h2 className="font-serif-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight line-clamp-3 group-hover:underline">
          {decodeHtml(post.title?.rendered || '')}
        </h2>
        <p className="hidden sm:block mt-3 text-sm sm:text-base text-white/85 line-clamp-2 max-w-3xl">{stripHtml(post.excerpt?.rendered, 200)}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-white/75">
          <Clock className="h-3 w-3" />
          <span>{formatDate(post.date)}</span>
        </div>
      </div>
    </Link>
  )
}

export function FeatureCard({ post, large = false }) {
  if (!post) return null
  const img = (large ? getLargeImage(post) : getFeaturedImage(post)) || FALLBACK_IMAGE
  const cat = getPrimaryCategory(post)
  return (
    <Link to={`/article/${post.slug}`} className="group block">
      <div className="aspect-[16/10] overflow-hidden rounded-lg bg-muted">
        <img src={img} alt={getImageAlt(post)} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      {cat && <span className="inline-block mt-3 text-xs font-bold uppercase tracking-wider text-primary">{cat.name}</span>}
      <h3 className={`font-serif-headline font-bold leading-tight mt-1.5 group-hover:text-primary transition-colors line-clamp-3 ${large ? 'text-xl sm:text-2xl' : 'text-lg'}`}>
        {decodeHtml(post.title?.rendered || '')}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{stripHtml(post.excerpt?.rendered, 130)}</p>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{timeAgo(post.date)}</span>
      </div>
    </Link>
  )
}

export function HorizontalCard({ post }) {
  if (!post) return null
  const img = getThumbnail(post) || FALLBACK_IMAGE
  const cat = getPrimaryCategory(post)
  return (
    <Link to={`/article/${post.slug}`} className="group flex gap-3 items-start">
      <div className="w-28 h-20 sm:w-32 sm:h-24 shrink-0 overflow-hidden rounded bg-muted">
        <img src={img} alt={getImageAlt(post)} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
      </div>
      <div className="flex-1 min-w-0">
        {cat && <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{cat.name}</span>}
        <h4 className="font-semibold text-sm sm:text-[15px] leading-snug line-clamp-3 group-hover:text-primary transition-colors">
          {decodeHtml(post.title?.rendered || '')}
        </h4>
        <div className="mt-1 text-xs text-muted-foreground">{timeAgo(post.date)}</div>
      </div>
    </Link>
  )
}

export function ListItem({ post, index }) {
  if (!post) return null
  return (
    <Link to={`/article/${post.slug}`} className="group flex gap-3 items-start py-3 border-b border-border last:border-0">
      {typeof index === 'number' && (
        <span className="font-serif-headline text-3xl font-extrabold text-primary/40 leading-none w-8 shrink-0">{index + 1}</span>
      )}
      <div className="flex-1">
        <h4 className="font-semibold text-sm leading-snug line-clamp-3 group-hover:text-primary transition-colors">
          {decodeHtml(post.title?.rendered || '')}
        </h4>
        <div className="mt-1 text-xs text-muted-foreground">{timeAgo(post.date)}</div>
      </div>
    </Link>
  )
}


export function TimelineCard({ post }) {
  if (!post) return null
  const cat = getPrimaryCategory(post)
  return (
    <Link to={`/article/${post.slug}`} className="group flex gap-0 items-start">
      {/* Time column */}
      <div className="w-16 shrink-0 text-right pr-3 pt-1">
        <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(post.date)}</span>
      </div>
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-3 h-3 rounded-full border-2 border-muted-foreground/40 bg-white mt-1 z-10" />
        <div className="w-px flex-1 bg-muted-foreground/20 mt-1" style={{ minHeight: '60px' }} />
      </div>
      {/* Content */}
      <div className="flex-1 pl-3 pb-5">
        {cat && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-1">
            {cat.name}
          </span>
        )}
        <h4 className="font-semibold text-sm sm:text-[15px] leading-snug line-clamp-3 group-hover:text-primary transition-colors">
          {decodeHtml(post.title?.rendered || '')}
        </h4>
      </div>
    </Link>
  )
}

export function TimelineCardSkeleton() {
  return (
    <div className="flex gap-0 items-start">
      <div className="w-16 shrink-0 pr-3 pt-1">
        <div className="h-3 w-10 skeleton-shimmer rounded ml-auto" />
      </div>
      <div className="flex flex-col items-center shrink-0">
        <div className="w-3 h-3 rounded-full skeleton-shimmer mt-1" />
        <div className="w-px flex-1 bg-muted mt-1" style={{ minHeight: '60px' }} />
      </div>
      <div className="flex-1 pl-3 pb-5 space-y-2">
        <div className="h-2.5 w-16 skeleton-shimmer rounded" />
        <div className="h-4 w-full skeleton-shimmer rounded" />
        <div className="h-4 w-3/4 skeleton-shimmer rounded" />
      </div>
    </div>
  )
}

export function FeatureCardSkeleton() {
  return (
    <div className="">
      <div className="aspect-[16/10] rounded-lg skeleton-shimmer" />
      <div className="h-3 mt-3 w-20 skeleton-shimmer rounded" />
      <div className="h-5 mt-2 w-3/4 skeleton-shimmer rounded" />
      <div className="h-3 mt-2 w-1/2 skeleton-shimmer rounded" />
    </div>
  )
}

export function HorizontalCardSkeleton() {
  return (
    <div className="flex gap-3">
      <div className="w-28 h-20 sm:w-32 sm:h-24 shrink-0 rounded skeleton-shimmer" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-16 skeleton-shimmer rounded" />
        <div className="h-4 w-full skeleton-shimmer rounded" />
        <div className="h-4 w-2/3 skeleton-shimmer rounded" />
      </div>
    </div>
  )
}