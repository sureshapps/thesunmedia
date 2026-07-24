import { useState } from 'react'
import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { HeroCard, FeatureCard, HorizontalCard, TimelineCard, TimelineCardSkeleton, FeatureCardSkeleton, HorizontalCardSkeleton } from '@/components/site/NewsCard'
import TrendingHashtagBar from '@/components/site/TrendingHashtagBar'
import CategoryBlock from '@/components/site/CategoryBlock'
import LifestyleBlock from '@/components/site/LifestyleBlock'
import TrendingBlock from '@/components/site/TrendingBlock'
import GoingViralBlock from '@/components/site/GoingViralBlock'
import SpotlightBlock from '@/components/site/SpotlightBlock'
import MostViewedBlock from '@/components/site/MostViewedBlock'
import OpinionBlock from '@/components/site/OpinionBlock'
import VideoBlock from '@/components/site/VideoBlock'
import SportsBlock from '@/components/site/SportsBlock'
import BreakingNewsSignup from '@/components/site/BreakingNewsSignup'
import CategoriesGlassBlock from '@/components/site/CategoriesGlassBlock'
import CategoryTripleBlock from '@/components/site/CategoryTripleBlock'
import AppPromoBanner from '@/components/site/AppPromoBanner'
import RegionNewsBlock from '@/components/site/RegionNewsBlock'
import AdBanner from '@/components/site/AdBanner'
import ipaperBanner from '@/assets/ipaper-banner.webp'
import { postsKey, buildUrl, asArray } from '@/lib/wp'
import useSeo from '@/lib/useSeo'

// 'sports' and 'malaysia-news' are rendered up top via <SportsBlock /> and
// <RegionNewsBlock /> now, so they're excluded here to avoid duplicates.
// 'education', 'motoring', and 'entertainment' now render earlier in the
// dedicated 3-column row right before RegionNewsBlock, so they're excluded
// here too to avoid showing the same category twice.
const FEATURED_CATEGORY_SLUGS = [
  'crime',
  'people-issues',
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
      {/* Main column (hero, 4-cards, Spotlight, Going Viral) and the sidebar
          (Latest News, ad, Most Viewed) each flow independently top-to-bottom —
          Spotlight starts right under the 4 cards regardless of how tall the
          sidebar ends up being, instead of waiting for both columns to finish. */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 space-y-6">
          <TrendingHashtagBar />

          {top ? <HeroCard post={top} /> : <div className="aspect-[16/9] rounded-lg skeleton-shimmer" />}

          {/* Small news cards under the hero */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {heroBelowGrid.length === 0
              ? [...Array(4)].map((_, i) => <FeatureCardSkeleton key={i} />)
              : heroBelowGrid.map(p => <FeatureCard key={p.id} post={p} />)}
          </div>

          {/* Spotlight — now directly under the 4 cards, not gated on the sidebar's height */}
          <SpotlightBlock />

          {/* Going Viral — full width of the main column */}
          <GoingViralBlock />
        </div>

        <div className="space-y-6">
          <section className="border border-border rounded-md overflow-hidden h-fit">
            <div className="bg-primary text-white font-extrabold italic uppercase tracking-wide text-xl sm:text-2xl px-5 py-4">
              Latest News
            </div>
            <div className="px-5 pt-5 overflow-hidden min-h-[380px]">
              {topLoading
                ? [...Array(PER_PAGE)].map((_, i) => <TimelineCardSkeleton key={i} />)
                : topStories.map((p, i) => (
                    <TimelineCard key={p.id} post={p} isLast={i === topStories.length - 1} />
                  ))}
            </div>
            {/* Prev / Next buttons */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
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
          </section>

          {/* theSun i-paper promo banner — moved up to sit directly under Latest News,
              right after the Page 1 pagination, so it no longer leaves a gap below. */}
          <a
            href="https://www.thesunit.my/ipaper"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-md overflow-hidden border border-border bg-white"
          >
            <img
              src={ipaperBanner}
              alt="theSun i-paper — Your Paper. Your Way. Anywhere, Anytime."
              className="w-full h-auto object-contain"
            />
          </a>

          {/* Opinion — follows immediately after the banner in the same sidebar flow */}
          <OpinionBlock />

          {/* Ad banner */}
          <AdBanner />
        </div>
      </section>

      {/* Business + Most Viewed Stories side by side, matching the reference layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-6">
        <div className="lg:col-span-2 space-y-10">
          <CategoryBlock slug="business" />
        </div>

        <div className="space-y-6">
          <MostViewedBlock />
        </div>
      </div>

      {/* Lifestyle — full-width section, placed right after Business, spanning both columns */}
      <LifestyleBlock />

      {/* Weekly Trending / Breaking News — full-width, auto-advancing, placed after Lifestyle */}
      <TrendingBlock />

      {/* theSun Videos — full-width dark video hub card, pulling the channel's latest
          uploads from the same YouTube Data API v3 source as the standalone Videos page */}
      <VideoBlock />

      {/* Sports spotlight (2/3, with the app promo banner directly beneath it so the
          banner only spans the sports column's width) + Breaking News signup and
          glassmorphic Categories (1/3), placed right below the video block, matching
          the reference layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-20">
        <div className="lg:col-span-2 space-y-6">
          <SportsBlock />
          <AppPromoBanner />
        </div>
        <div className="space-y-6">
          <BreakingNewsSignup />
          <CategoriesGlassBlock />
        </div>
      </div>

      {/* Education / Motoring / Property — 3-column row of mini category blocks,
          placed right after the Sports/Categories section and before the
          Malaysia / Asia / World region grid */}
      <div className="mt-10">
        <CategoryTripleBlock
          columns={[
            { slug: 'education', label: 'Education' },
            { slug: 'motoring', label: 'Motoring' },
            { slug: 'entertainment', label: 'Entertainment' },
          ]}
        />
      </div>

      {/* Malaysia / Asia / World — 3-column responsive glass grid */}
      <div className="mt-10">
        <RegionNewsBlock />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
        <div className="lg:col-span-2 space-y-10">
          {FEATURED_CATEGORY_SLUGS.map(slug => (
            <CategoryBlock key={slug} slug={slug} />
          ))}
        </div>
      </div>
    </div>
  )
}
