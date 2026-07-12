import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { FeatureCard, HorizontalCard, FeatureCardSkeleton, HorizontalCardSkeleton } from './NewsCard'
import { postsKey, categoryBySlugKey, decodeHtml, asArray } from '@/lib/wp'

export default function CategoryBlock({ slug, name }) {
  const { data: catsRaw } = useSWR(categoryBySlugKey(slug))
  const cats = asArray(catsRaw)
  const cat = cats[0]
  const { data: postsRaw } = useSWR(
    cat ? postsKey({ categories: cat.id, per_page: 8 }) : null
  )

  if (!cat) return null
  const loading = !postsRaw || !Array.isArray(postsRaw)
  const posts = asArray(postsRaw)
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
          <div>
            <FeatureCardSkeleton />
            <div className="space-y-4 mt-4">
              {[...Array(3)].map((_, i) => <HorizontalCardSkeleton key={i} />)}
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <HorizontalCardSkeleton key={i} />)}
          </div>
        </div>
      )}
      {!loading && posts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <FeatureCard post={posts[0]} large />
            {/* Fills the space left under the hero card with a few more stories */}
            {posts.length > 5 && (
              <div className="space-y-4 mt-4">
                {posts.slice(5, 8).map(p => <HorizontalCard key={p.id} post={p} />)}
              </div>
            )}
          </div>
          <div className="space-y-4">
            {posts.slice(1, 5).map(p => <HorizontalCard key={p.id} post={p} />)}
          </div>
        </div>
      )}
    </section>
  )
}
