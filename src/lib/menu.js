// Centralised hierarchical menu structure for thesun.
// Each leaf has slug -> WordPress category slug used by /category/:slug route.

export const MAIN_MENU = [
  { label: 'Home', to: '/' },
  {
    label: 'News',
    children: [
      { label: 'Malaysia', slug: 'malaysia-news' },
      { label: 'Asia', slug: 'asia' },
      { label: 'World', slug: 'world' },
    ],
  },
  { label: 'Going Viral', slug: 'going-viral' },
  {
    label: 'Business',
    slug: 'business',
    children: [
      { label: 'Local', slug: 'local' },
      { label: 'World', slug: 'global-business' },
    ],
  },
  { label: 'Opinion', slug: 'opinion' },
  {
    label: 'Lifestyle',
    slug: 'lifestyle',
    children: [
      { label: 'Technology & Social Media', slug: 'technology' },
      { label: 'Family & Health', slug: 'family-parenting' },
      { label: 'Fashion & Beauty', slug: 'fashion-beauty' },
      { label: 'Home & Living', slug: 'home-living' },
      { label: 'Travel & Leisure', slug: 'travel' },
      { label: 'Food & Beverage', slug: 'food-beverage' },
      { label: 'Culture & Entertainment', slug: 'entertainment' },
    ],
  },
  {
    label: 'Sports',
    slug: 'sports',
    children: [
      { label: 'Football', slug: 'football' },
      { label: 'Badminton', slug: 'badminton' },
      { label: 'Tennis', slug: 'tennis' },
      { label: 'F1', slug: 'f1' },
      { label: 'Cricket', slug: 'cricket' },
      { label: 'Golf', slug: 'golf' },
    ],
  },
  { label: 'Motoring', slug: 'motoring' },
  { label: 'Education', slug: 'education' },
  { label: 'Videos', slug: 'videos' },
  {
    label: 'More',
    children: [
      { label: 'Property', slug: 'property' },
      { label: 'Classifieds', slug: 'classifieds' },
      { label: 'Most Views', to: '/latest' },
      { label: 'Latest News', to: '/latest' },
      { label: 'Top Stories', to: '/' },
      { label: 'Traveling', slug: 'travel' },
    ],
  },
  { label: "World Cup '26", to: 'https://worldcup2026.thesun.my/', worldcup: true },
]

// Resolve an item's href: prefer explicit `to`, then `slug` -> /category/:slug
export function itemHref(item) {
  if (item.to) return item.to
  if (item.slug) return `/category/${item.slug}`
  return '#'
}