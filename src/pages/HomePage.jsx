import { useState } from 'react'
import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { HeroCard, FeatureCard, HorizontalCard, TimelineCard, TimelineCardSkeleton, FeatureCardSkeleton, HorizontalCardSkeleton } from '@/components/site/NewsCard'
import CategoryBlock from '@/components/site/CategoryBlock'
import LifestyleBlock from '@/components/site/LifestyleBlock'
import GoingViralBlock from '@/components/site/GoingViralBlock'
import OpinionBlock from '@/components/site/OpinionBlock'
import { postsKey, buildUrl, asArray } from '@/lib/wp'
import useSeo from '@/lib/useSeo'

const FEATURED_CATEGORY_SLUGS = [
  'malaysia-news',
  'sports',
  'entertainment',
  'spotlight',
  'motoring',
  'crime',
  'people-issues',
  'education',
  'technology-social-media',
  'corporate-news',
]

export default function HomePage() {
  useSeo({
    title: 'theSun - Malaysia Daily News, Latest Headlines & Breaking Stories',
    description: 'Your trusted source for Malaysia news, business, lifestyle, sports, entertainment, world news and breaking stories.',
    url: window.location.origin + '/',
  })

  const PER_PAGE = 5
  const [topPage, setTopPage] = useState(1)

  // Page 1: fetch 16 posts (hero + editor picks + latest + first 5 top stories)
  const { data: latest, isLoading } = useSWR(postsKey({ per_page: 16 }))
  // Extra pages for top stories pagination (page 2+)
  const topStoriesUrl = topPage > 1
    ? buildUrl('/posts', { per_page: PER_PAGE, page: topPage, _embed: 1 })
    : null
  const { data: extraTopData, isLoading: extraLoading } = useSWR(topStoriesUrl, async (u) => {
    const res = await fetch(u)
    if (!res.ok) throw new Error('Failed')
    return res.json()
  })

  const top = latest?.[0]
  const latestArr = asArray(latest)
  const heroBelowGrid = latestArr.slice(1, 5)

  // Top stories: page 1 uses slice from latest, page 2+ uses fetched data
  const topStories = topPage === 1
    ? latestArr.slice(9, 9 + PER_PAGE)
    : asArray(extraTopData)
  const topLoading = topPage === 1 ? isLoading : extraLoading

  return (
    <div className="container mx-auto px-4 py-6">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          {top ? <HeroCard post={top} /> : <div className="aspect-[16/9] rounded-lg skeleton-shimmer" />}

          {/* Small news cards under the hero */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-6">
            {heroBelowGrid.length === 0
              ? [...Array(4)].map((_, i) => <FeatureCardSkeleton key={i} />)
              : heroBelowGrid.map(p => <FeatureCard key={p.id} post={p} />)}
          </div>
        </div>
        <div>
          <div className="border-b-2 border-primary pb-2 mb-4">
            <h3 className="font-serif-headline text-xl font-bold">Latest News</h3>
          </div>
          <div className="overflow-hidden min-h-[380px]">
            {topLoading
              ? [...Array(PER_PAGE)].map((_, i) => <TimelineCardSkeleton key={i} />)
              : topStories.map(p => <TimelineCard key={p.id} post={p} />)}
          </div>
          {/* Prev / Next buttons */}
          <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-border">
            <button
              onClick={() => setTopPage(p => Math.max(1, p - 1))}
              disabled={topPage === 1}
              aria-label="Previous"
              className="w-8 h-8 flex items-center justify-center border border-border rounded hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTopPage(p => p + 1)}
              disabled={topStories.length < PER_PAGE}
              aria-label="Next"
              className="w-8 h-8 flex items-center justify-center border border-border rounded hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <GoingViralBlock />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <CategoryBlock slug="business" />
        </div>

        <div className="space-y-8">
          {/* Opinion block — sits at the top of the sidebar, next to the Business section */}
          <OpinionBlock />
        </div>
      </div>

      {/* Lifestyle — full-width purple section, placed right after Business */}
      <LifestyleBlock />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {FEATURED_CATEGORY_SLUGS.map(slug => (
            <CategoryBlock key={slug} slug={slug} />
          ))}
        </div>
      </div>
    </div>
  )
}