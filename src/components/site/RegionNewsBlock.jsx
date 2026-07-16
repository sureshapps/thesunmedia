import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { Radar, Globe, ChevronRight } from 'lucide-react'
import {
  postsKey, categoryBySlugKey,
  getThumbnail, getImageAlt, decodeHtml, timeAgo, asArray, FALLBACK_IMAGE,
} from '@/lib/wp'

const REGIONS = [
  { slug: 'malaysia-news', label: 'Malaysia', emoji: '🇲🇾', badgeBg: 'bg-blue-50' },
  { slug: 'asia', label: 'Asia', Icon: Radar, badgeBg: 'bg-red-50', iconColor: 'text-red-600' },
  { slug: 'world-news', label: 'World', Icon: Globe, badgeBg: 'bg-orange-50', iconColor: 'text-orange-500' },
]

function RegionItem({ post }) {
  return (
    <Link
      to={`/article/${post.slug}`}
      className="group flex items-start gap-3 bg-white rounded-xl border border-border/60 p-3 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
    >
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold text-sm leading-snug line-clamp-3 text-foreground group-hover:text-primary transition-colors">
          {decodeHtml(post.title?.rendered || '')}
        </h4>
        <span className="block mt-1.5 text-xs text-muted-foreground">{timeAgo(post.date)}</span>
      </div>
      <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0 rounded-lg overflow-hidden bg-muted">
        <img
          src={getThumbnail(post) || FALLBACK_IMAGE}
          alt={getImageAlt(post)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    </Link>
  )
}

function RegionItemSkeleton() {
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl border border-border/60 p-3">
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-full skeleton-shimmer rounded" />
        <div className="h-3.5 w-2/3 skeleton-shimmer rounded" />
        <div className="h-2.5 w-12 skeleton-shimmer rounded" />
      </div>
      <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0 rounded-lg skeleton-shimmer" />
    </div>
  )
}

function RegionColumn({ region }) {
  const { slug, label, emoji, Icon, badgeBg, iconColor } = region
  const { data: catsRaw } = useSWR(categoryBySlugKey(slug))
  const cats = asArray(catsRaw)
  const cat = cats[0]
  const { data: postsRaw } = useSWR(cat ? postsKey({ categories: cat.id, per_page: 5 }) : null)
  const posts = asArray(postsRaw)
  const loading = !cat || !postsRaw

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.25)] p-4 sm:p-5">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <span className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${badgeBg} flex items-center justify-center shrink-0`}>
            {emoji ? (
              <span className="text-base sm:text-lg leading-none">{emoji}</span>
            ) : (
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} strokeWidth={2} />
            )}
          </span>
          <h3 className="font-bold text-base sm:text-lg text-foreground">{label}</h3>
        </div>
        <Link
          to={`/category/${slug}`}
          className="inline-flex items-center gap-0.5 text-xs font-semibold text-foreground/80 bg-muted/70 hover:bg-muted rounded-full px-3 py-1.5 transition-colors shrink-0"
        >
          view all <ChevronRight className="h-3 w-3 text-primary" />
        </Link>
      </div>

      <span className="block h-[3px] w-full rounded-full bg-gradient-to-r from-orange-400 via-pink-400 to-indigo-400 mb-4" />

      <div className="space-y-3">
        {loading
          ? [...Array(5)].map((_, i) => <RegionItemSkeleton key={i} />)
          : posts.map((p) => <RegionItem key={p.id} post={p} />)}
      </div>
    </div>
  )
}

export default function RegionNewsBlock() {
  return (
    <section className="relative rounded-[2rem] p-5 sm:p-8 overflow-hidden bg-gradient-to-br from-rose-50/70 via-white to-orange-50/50 border border-rose-100/60 shadow-[0_25px_55px_-30px_rgba(220,38,38,0.35)]">
      <div className="pointer-events-none absolute -top-16 -left-10 w-56 h-56 rounded-full bg-rose-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-10 w-60 h-60 rounded-full bg-orange-200/30 blur-3xl" />

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {REGIONS.map((region) => (
          <RegionColumn key={region.slug} region={region} />
        ))}
      </div>
    </section>
  )
}
