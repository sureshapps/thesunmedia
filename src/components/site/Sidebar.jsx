import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { TrendingUp, Newspaper, Tag, BarChart2, ChevronRight } from 'lucide-react'
import { ListItem, HorizontalCard, HorizontalCardSkeleton } from './NewsCard'
import NewsletterForm from './NewsletterForm'
import { postsKey, categoriesKey, decodeHtml, buildUrl } from '@/lib/wp'

// Last 7 days date helper
function sevenDaysAgo() {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return d.toISOString()
}

export default function Sidebar({ excludeId } = {}) {
  // Latest News — newest first
  const { data: latest = [] } = useSWR(postsKey({ per_page: 6, orderby: 'date', order: 'desc' }))

  // Most Viewed — ordered by comment count (best WP REST popularity proxy)
  const { data: mostViewed = [] } = useSWR(
    postsKey({ per_page: 6, orderby: 'comment_count', order: 'desc' })
  )

  // Trending — recent 7 days, ordered by comment count
  const { data: trending = [] } = useSWR(
    buildUrl('/posts', { per_page: 6, orderby: 'comment_count', order: 'desc', after: sevenDaysAgo(), _embed: 1 })
  )

  const { data: cats = [] } = useSWR(categoriesKey({ per_page: 15, orderby: 'count', order: 'desc' }))

  const latestFiltered    = (latest     || []).filter(p => p.id !== excludeId).slice(0, 5)
  const mostViewedFiltered = (mostViewed || []).filter(p => p.id !== excludeId).slice(0, 5)
  const trendingFiltered  = (trending   || []).filter(p => p.id !== excludeId).slice(0, 5)

  return (
    <aside className="space-y-8">

      {/* Latest News — newest articles */}
      <section>
        <div className="flex items-center justify-between border-b-2 border-primary pb-2 mb-3">
          <h3 className="flex items-center gap-2 text-base font-bold uppercase tracking-wider">
            <Newspaper className="h-4 w-4 text-primary" /> Latest News
          </h3>
          <Link to="/latest" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-0.5">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="space-y-3">
          {latestFiltered.length === 0
            ? [...Array(4)].map((_, i) => <HorizontalCardSkeleton key={i} />)
            : latestFiltered.map(p => <HorizontalCard key={p.id} post={p} />)}
        </div>
      </section>

      {/* Most Viewed — highest comment count all time */}
      <section>
        <div className="flex items-center justify-between border-b-2 border-primary pb-2 mb-3">
          <h3 className="flex items-center gap-2 text-base font-bold uppercase tracking-wider">
            <BarChart2 className="h-4 w-4 text-primary" /> Most Viewed
          </h3>
          <Link to="/latest" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-0.5">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {mostViewedFiltered.length === 0
            ? [...Array(5)].map((_, i) => (
                <div key={i} className="py-3 space-y-1.5">
                  <div className="h-3 w-full skeleton-shimmer rounded" />
                  <div className="h-3 w-2/3 skeleton-shimmer rounded" />
                </div>
              ))
            : mostViewedFiltered.map((p, i) => <ListItem key={p.id} post={p} index={i} />)}
        </div>
      </section>

      {/* Trending Stories — last 7 days by comment count */}
      <section>
        <div className="flex items-center justify-between border-b-2 border-primary pb-2 mb-3">
          <h3 className="flex items-center gap-2 text-base font-bold uppercase tracking-wider">
            <TrendingUp className="h-4 w-4 text-primary" /> Trending Stories
          </h3>
          <Link to="/latest" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-0.5">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {trendingFiltered.length === 0
            ? [...Array(5)].map((_, i) => (
                <div key={i} className="py-3 space-y-1.5">
                  <div className="h-3 w-full skeleton-shimmer rounded" />
                  <div className="h-3 w-2/3 skeleton-shimmer rounded" />
                </div>
              ))
            : trendingFiltered.map((p, i) => <ListItem key={p.id} post={p} index={i} />)}
        </div>
      </section>

      {/* Categories */}
      <section>
        <h3 className="flex items-center gap-2 text-base font-bold uppercase tracking-wider border-b-2 border-primary pb-2 mb-3">
          <Tag className="h-4 w-4 text-primary" /> Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {(cats || []).slice(0, 15).map(c => (
            <Link key={c.id} to={`/category/${c.slug}`} className="text-xs font-medium px-3 py-1.5 rounded-full border border-border hover:bg-primary hover:text-white hover:border-primary transition-colors">
              {decodeHtml(c.name)} <span className="text-muted-foreground">({c.count})</span>
            </Link>
          ))}
        </div>
      </section>

      <NewsletterForm />

      {/* Sidebar Ads Banner */}
      <div
        className="w-full min-h-[250px] bg-[#d0d0d0] flex items-center justify-center rounded text-sm font-bold text-[#777] uppercase tracking-wide select-none"
        aria-label="Advertisement"
      >
        Ads Banner
      </div>

    </aside>
  )
}