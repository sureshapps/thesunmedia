// WordPress REST API helpers for thesun.my (browser/SPA version)
export const WP_BASE = 'https://thesun.my/wp-json/wp/v2'

export function buildUrl(path, params = {}) {
  const url = new URL(`${WP_BASE}${path}`)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, String(v))
    }
  })
  return url.toString()
}

// Fetch and return both data + headers (used for pagination)
export async function wpFetch(path, params = {}) {
  const url = buildUrl(path, params)
  const res = await fetch(url)
  if (!res.ok) {
    return { data: [], total: 0, totalPages: 0 }
  }
  const data = await res.json()
  const total = parseInt(res.headers.get('x-wp-total') || '0', 10)
  const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '0', 10)
  return { data, total, totalPages }
}

// SWR keys (so all hooks dedupe + cache correctly)
export const postsKey = (params = {}) => buildUrl('/posts', { _embed: 1, ...params })
export const postBySlugKey = (slug) => buildUrl('/posts', { slug, _embed: 1 })
export const categoryBySlugKey = (slug) => buildUrl('/categories', { slug })
export const categoriesKey = (params = {}) => buildUrl('/categories', params)

// Guards against WP REST occasionally returning a non-array truthy payload
// (rate-limit / error JSON bodies, WAF challenge pages, etc.) instead of the
// expected list. Every component should read SWR `data` through this rather
// than trusting it directly — `data || []` does NOT catch this case, since a
// truthy non-array object still passes that check and blows up the first
// .map()/.filter()/.slice() call, taking the whole page blank with it.
export function asArray(data) {
  return Array.isArray(data) ? data : []
}

// ---------- Helpers to extract data from embedded API responses ----------
export function getFeaturedImage(post, size = 'medium_large') {
  if (!post) return null
  const media = post?._embedded?.['wp:featuredmedia']?.[0]
  if (!media || media.code === 'rest_forbidden') return null
  const sizes = media?.media_details?.sizes || {}
  const order = [size, 'medium_large', 'td_696x385', 'td_1068x580', 'td_485x360', 'medium', 'full']
  for (const s of order) {
    if (sizes[s]?.source_url) return sizes[s].source_url
  }
  return media.source_url || null
}

export function getThumbnail(post) {
  return getFeaturedImage(post, 'td_485x360') || getFeaturedImage(post, 'medium')
}

export function getLargeImage(post) {
  return getFeaturedImage(post, 'td_1068x580') || getFeaturedImage(post, 'full')
}

export function getImageAlt(post) {
  const media = post?._embedded?.['wp:featuredmedia']?.[0]
  return media?.alt_text || decodeHtml(post?.title?.rendered || '')
}

export function getPrimaryCategory(post) {
  const terms = post?._embedded?.['wp:term'] || []
  for (const group of terms) {
    for (const t of group) {
      if (t.taxonomy === 'category' && t.slug !== 'uncategorized') {
        return { name: decodeHtml(t.name), slug: t.slug, id: t.id }
      }
    }
  }
  return null
}

export function getAllCategories(post) {
  const terms = post?._embedded?.['wp:term'] || []
  const cats = []
  for (const group of terms) {
    for (const t of group) {
      if (t.taxonomy === 'category') cats.push({ name: decodeHtml(t.name), slug: t.slug, id: t.id })
    }
  }
  return cats
}

export function getTags(post) {
  const terms = post?._embedded?.['wp:term'] || []
  const tags = []
  for (const group of terms) {
    for (const t of group) {
      if (t.taxonomy === 'post_tag') tags.push({ name: decodeHtml(t.name), slug: t.slug, id: t.id })
    }
  }
  return tags
}

export function getAuthor(post) {
  const author = post?._embedded?.author?.[0]
  if (!author || author.code === 'rest_forbidden') return { name: 'theSun', slug: 'thesun' }
  return { name: author.name || 'theSun', slug: author.slug || 'thesun', avatar: author.avatar_urls?.['96'] }
}

export function decodeHtml(html = '') {
  if (!html) return ''
  return String(html)
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…')
}

export function stripHtml(html = '', maxLen = 200) {
  if (!html) return ''
  const text = String(html).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  const decoded = decodeHtml(text)
  if (decoded.length <= maxLen) return decoded
  return decoded.slice(0, maxLen).trim() + '…'
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch { return '' }
}

export function formatDateTime(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleString('en-MY', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch { return '' }
}

export function timeAgo(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return formatDate(dateStr)
}

export const NAV_CATEGORIES = [
  { slug: 'malaysia-news', name: 'Malaysia' },
  { slug: 'business', name: 'Business' },
  { slug: 'world', name: 'World' },
  { slug: 'sports', name: 'Sports' },
  { slug: 'lifestyle', name: 'Lifestyle' },
  { slug: 'entertainment', name: 'Entertainment' },
  { slug: 'education', name: 'Education' },
  { slug: 'opinion', name: 'Opinion' },
  { slug: 'going-viral', name: 'Viral' },
  { slug: 'berita', name: 'Berita' },
]

export const FEATURED_CATEGORY_SLUGS = [
  'malaysia-news', 'business', 'world', 'sports', 'lifestyle', 'entertainment', 'berita',
]

export const LOGO_URL = 'https://customer-assets.emergentagent.com/job_3108d35f-a45a-4c79-ae5b-d6401293d73f/artifacts/j5qi0lcz_350x180-no-outline.png'

export const FALLBACK_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9" width="800" height="450"><rect width="16" height="9" fill="%23e5e7eb"/><text x="50%25" y="55%25" text-anchor="middle" font-family="Arial" font-size="1" fill="%2399a">theSun</text></svg>'