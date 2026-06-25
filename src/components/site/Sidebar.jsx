import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { TrendingUp, Newspaper, Tag } from 'lucide-react'
import { ListItem, HorizontalCard, HorizontalCardSkeleton } from './NewsCard'
import NewsletterForm from './NewsletterForm'
import { postsKey, categoriesKey, decodeHtml } from '@/lib/wp'

export default function Sidebar({ excludeId } = {}) {
  const { data: latest = [] } = useSWR(postsKey({ per_page: 6 }))
  const { data: trending = [] } = useSWR(postsKey({ per_page: 6, orderby: 'date' }))
  const { data: cats = [] } = useSWR(categoriesKey({ per_page: 15, orderby: 'count', order: 'desc' }))

  const latestFiltered = (latest || []).filter(p => p.id !== excludeId).slice(0, 5)
  const trendingFiltered = (trending || []).filter(p => p.id !== excludeId).slice(0, 5)

  return (
    <aside className="space-y-8">
      <section>
        <h3 className="flex items-center gap-2 text-base font-bold uppercase tracking-wider border-b-2 border-primary pb-2 mb-3">
          <Newspaper className="h-4 w-4 text-primary" /> Latest News
        </h3>
        <div className="space-y-3">
          {latestFiltered.length === 0
            ? [...Array(4)].map((_, i) => <HorizontalCardSkeleton key={i} />)
            : latestFiltered.map(p => <HorizontalCard key={p.id} post={p} />)}
        </div>
      </section>

      <section>
        <h3 className="flex items-center gap-2 text-base font-bold uppercase tracking-wider border-b-2 border-primary pb-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" /> Trending Stories
        </h3>
        <div className="divide-y divide-border">
          {trendingFiltered.map((p, i) => <ListItem key={p.id} post={p} index={i} />)}
        </div>
      </section>

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
    </aside>
  )
}
