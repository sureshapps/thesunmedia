import useSWR from 'swr'
import { Link } from 'react-router-dom'
import BreakingBadge from './BreakingBadge'
import { postsKey, decodeHtml, asArray } from '@/lib/wp'

// Pull the primary category name from an embedded post (WP REST _embed).
function getCategoryName(post) {
  return post?._embedded?.['wp:term']?.[0]?.[0]?.name || null
}

export default function BreakingTicker() {
  const { data: postsRaw } = useSWR(postsKey({ per_page: 8 }))
  const posts = asArray(postsRaw)
  if (!posts.length) {
    return (
      <div className="bg-black text-white border-b border-white/10">
        <div className="container mx-auto px-0 sm:px-4 flex items-stretch">
          <BreakingBadge />
          <div className="flex-1 px-4 py-2 text-xs text-white/60 flex items-center">Loading latest headlines…</div>
        </div>
      </div>
    )
  }
  const items = [...posts, ...posts]
  return (
    <div className="bg-black text-white border-b border-white/10">
      <div className="container mx-auto px-0 sm:px-4 flex items-stretch">
        <BreakingBadge />
        <div className="flex-1 overflow-hidden hover-ticker relative">
          <div className="ticker-track flex items-center whitespace-nowrap py-2" style={{ width: 'max-content' }}>
            {items.map((p, i) => {
              const cat = getCategoryName(p)
              return (
                <Link key={`${p.id}-${i}`} to={`/article/${p.slug}`} className="text-sm px-6 hover:text-primary inline-flex items-center gap-2.5">
                  {cat && (
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-white bg-primary rounded px-1.5 py-0.5">
                      {decodeHtml(cat)}
                    </span>
                  )}
                  {decodeHtml(p.title?.rendered || '')}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
