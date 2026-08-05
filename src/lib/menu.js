// Centralised hierarchical menu structure for thesun.
// Each leaf has slug -> WordPress category slug used by /category/:slug route.

export const MAIN_MENU = [
  { label: 'Home', to: '/' },
  {
    label: 'News',
    children: [
      { label: 'Malaysia', slug: 'malaysia-news' },
      { label: 'Asia', slug: 'asia' },
      { label: 'World', slug: 'world-news' },
    ],
  },
  { label: 'Going Viral', slug: 'going-viral' },
  {
    label: 'Business',
    slug: 'business',
    children: [
      { label: 'Local Business', slug: 'local-business' },
      { label: 'Global Business', slug: 'global-business' },
      { label: 'Corporate News', slug: 'corporate-news' },
    ],
  },
  { label: 'Opinion', slug: 'opinion' },
  {
    label: 'Lifestyle',
    slug: 'lifestyle',
    children: [
      { label: 'Boo! and Beyond', slug: 'boo-and-beyond' },
      { label: 'Technology & Social Media', slug: 'technology-social-media' },
      { label: 'Family & Health', slug: 'family-parenting' },
      { label: 'Fashion & Beauty', slug: 'fashion-beauty' },
      { label: 'Home & Living', slug: 'home-living' },
      { label: 'Travel & Leisure', slug: 'travel-leisure' },
      { label: 'Food & Beverage', slug: 'food-beverage' },
      { label: 'Culture & Entertainment', slug: 'entertainment' },
    ],
  },
  { label: 'Spotlight', slug: 'spotlight' },
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
      { label: 'Other Sports', slug: 'other-sports' },
    ],
  },
  { label: 'Education', slug: 'education' },
  { label: 'Videos', slug: 'videos' },
  {
    label: 'More',
    children: [
      { label: 'Property', slug: 'property' },
      { label: 'Motoring', slug: 'motoring' },
      { label: 'People & Issues', slug: 'people-issues' },
      { label: 'Most Views', to: '/latest' },
      { label: 'Latest News', to: '/latest' },
      { label: 'Top Stories', to: '/' },
    ],
  },
  // Highlighted pill-style nav button (was the World Cup promo slot) — same
  // treatment, just pointed at Classifieds and without the animated ball icon.
  { label: 'Classifieds', to: 'https://sunmedia.my', highlight: true },
]

// Resolve an item's href: prefer explicit `to`, then `slug` -> /category/:slug
export function itemHref(item) {
  if (item.to) return item.to
  if (item.slug) return `/category/${item.slug}`
  return '#'
}
