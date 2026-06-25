import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { FeatureCard, HorizontalCard, FeatureCardSkeleton, HorizontalCardSkeleton } from './NewsCard'
import { postsKey, categoryBySlugKey, decodeHtml } from '@/lib/wp'

export default function CategoryBlock({ slug, name }) {
  const { data: cats } = useSWR(categoryBySlugKey(slug))
  const cat = cats && cats[0]
  const { data: posts } = useSWR(
    cat ? postsKey({ categories: cat.id, per_page: 5 }) : null
  )

  if (!cat) return null
  const loading = !posts
  const displayName = decodeHtml(name || cat.name)

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeatureCardSkeleton />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <HorizontalCardSkeleton key={i} />)}
          </div>
        </div>
      )}
      {!loading && posts && posts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeatureCard post={posts[0]} large />
          <div className="space-y-4">
            {posts.slice(1).map(p => <HorizontalCard key={p.id} post={p} />)}
          </div>
        </div>
      )}
    </section>
  )
}
