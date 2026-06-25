// Centralised hierarchical menu structure for thesun.
// Each leaf has slug -> WordPress category slug used by /category/:slug route.

export const MAIN_MENU = [
  { label: 'Home', to: '/' },
  {
    label: 'News',
    children: [
      {
        label: 'Malaysia',
        slug: 'malaysia-news',
        children: [
          { label: 'Politics', slug: 'politics' },
          { label: 'Crime', slug: 'crime' },
          { label: 'Courts', slug: 'courts' },
          { label: 'People & Issues', slug: 'people-issues' },
        ],
      },
      {
        label: 'World',
        slug: 'world',
        children: [
          { label: 'Asia', slug: 'asia' },
        ],
      },
    ],
  },
  { label: 'Going Viral', slug: 'going-viral' },
  {
    label: 'Sports',
    slug: 'sports',
    children: [
      { label: 'Athletics', slug: 'athletics' },
      { label: 'Badminton', slug: 'badminton' },
      { label: 'Basketball', slug: 'basketball' },
      { label: 'Cricket', slug: 'cricket' },
      { label: 'Cycling', slug: 'cycling' },
      { label: 'F1', slug: 'f1' },
      { label: 'Football', slug: 'football' },
      { label: 'Golf', slug: 'golf' },
      { label: 'MotoGP', slug: 'motogp' },
      { label: 'Squash', slug: 'squash' },
      { label: 'Tennis', slug: 'tennis' },
    ],
  },
  { label: 'Opinion', slug: 'opinion' },
  {
    label: 'Lifestyle',
    slug: 'lifestyle',
    children: [
      { label: 'Boo! and Beyond', slug: 'boo-and-beyond' },
      { label: 'Culture', slug: 'culture' },
      { label: 'Food & Beverage', slug: 'food-beverage' },
      { label: 'Entertainment', slug: 'entertainment' },
      { label: 'Travel & Leisure', slug: 'travel' },
      { label: 'Family & Parenting', slug: 'family-parenting' },
      { label: 'Technology & Social Media', slug: 'technology' },
      { label: 'Fashion & Beauty', slug: 'fashion-beauty' },
      { label: 'Health', slug: 'health' },
      { label: 'Home & Living', slug: 'home-living' },
    ],
  },
  { label: 'Spotlight', slug: 'spotlight' },
  {
    label: 'Business',
    slug: 'business',
    children: [
      { label: 'Spotlight', slug: 'spotlight' },
      { label: 'Business', slug: 'business' },
      { label: 'Local', slug: 'local' },
      { label: 'Global', slug: 'global-business' },
      { label: 'ASEAN', slug: 'asean-business' },
      { label: 'SMEs / MSMEs', slug: 'smes-msmes' },
      { label: 'Corporate News', slug: 'corporate-news' },
    ],
  },
  { label: 'Classifieds', slug: 'classifieds' },
  {
    label: 'Motoring',
    slug: 'motoring',
    children: [
      { label: 'Bike', slug: 'bike' },
      { label: 'Car', slug: 'car' },
    ],
  },
  { label: 'Education', slug: 'education' },
  { label: "World Cup '26", to: 'https://worldcup2026.thesun.my/', worldcup: true },
]

// Resolve an item's href: prefer explicit `to`, then `slug` -> /category/:slug
export function itemHref(item) {
  if (item.to) return item.to
  if (item.slug) return `/category/${item.slug}`
  return '#'
}