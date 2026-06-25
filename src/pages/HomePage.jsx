import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { HeroCard, FeatureCard, HorizontalCard, FeatureCardSkeleton, HorizontalCardSkeleton } from '@/components/site/NewsCard'
import Sidebar from '@/components/site/Sidebar'
import CategoryBlock from '@/components/site/CategoryBlock'
import { postsKey, FEATURED_CATEGORY_SLUGS } from '@/lib/wp'
import useSeo from '@/lib/useSeo'

export default function HomePage() {
  useSeo({
    title: 'theSun - Malaysia Daily News, Latest Headlines & Breaking Stories',
    description: 'Your trusted source for Malaysia news, business, lifestyle, sports, entertainment, world news and breaking stories.',
    url: window.location.origin + '/',
  })

  const { data: latest, isLoading } = useSWR(postsKey({ per_page: 16 }))
  const top = latest?.[0]
  const featuredGrid = (latest || []).slice(1, 5)
  const moreLatest = (latest || []).slice(5, 13)

  return (
    <div className="container mx-auto px-4 py-6">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          {top ? <HeroCard post={top} /> : <div className="aspect-[16/9] rounded-lg skeleton-shimmer" />}
        </div>
        <div className="space-y-4">
          <h3 className="font-serif-headline text-xl font-bold border-b-2 border-primary pb-2">Top Stories</h3>
          {(latest || []).length === 0
            ? [...Array(4)].map((_, i) => <HorizontalCardSkeleton key={i} />)
            : (latest || []).slice(1, 5).map(p => <HorizontalCard key={p.id} post={p} />)}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-serif-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-5 flex items-center gap-2">
          <span className="w-1 h-7 bg-primary inline-block" /> Editor's Picks
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredGrid.length === 0
            ? [...Array(4)].map((_, i) => <FeatureCardSkeleton key={i} />)
            : featuredGrid.map(p => <FeatureCard key={p.id} post={p} />)}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="font-serif-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-5 flex items-center gap-2">
              <span className="w-1 h-7 bg-primary inline-block" /> Latest News
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {moreLatest.length === 0
                ? [...Array(6)].map((_, i) => <FeatureCardSkeleton key={i} />)
                : moreLatest.map(p => <FeatureCard key={p.id} post={p} />)}
            </div>
            <div className="text-center mt-6">
              <Link to="/latest" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                Load more news <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {FEATURED_CATEGORY_SLUGS.map(slug => (
            <CategoryBlock key={slug} slug={slug} />
          ))}
        </div>

        <Sidebar />
      </div>
    </div>
  )
}
