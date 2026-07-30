import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { Zap, Newspaper } from 'lucide-react'
import { postsKey, decodeHtml, asArray } from '@/lib/wp'
import SocialIcons from './SocialIcons'

const IPAPER_URL = 'https://thesun-ipaper.cld.bz/'

// iPaper button — adapted from the Uiverse "New Updates" notification card:
// bell → newspaper icon, label → "iPaper", subtitle dropped, red ping badge kept.
function IpaperButton() {
  return (
    <a
      href={IPAPER_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Read iPaper"
      className="group relative shrink-0"
    >
      {/* Notification badge */}
      <div className="absolute -right-1.5 -top-1.5 z-10">
        <div className="flex h-4 w-4 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            3
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg bg-gradient-to-bl from-gray-900 via-gray-950 to-black p-[1px] shadow-lg shadow-emerald-500/20">
        <div className="relative flex items-center gap-2.5 rounded-lg bg-gray-950 px-3 py-1.5 transition-all duration-300 group-hover:bg-gray-950/50">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600 transition-transform duration-300 group-hover:scale-110">
            <Newspaper className="h-3.5 w-3.5 text-white" strokeWidth={2.25} />
            <div className="absolute inset-0 rounded-md bg-emerald-500/50 blur-sm transition-all duration-300 group-hover:blur-md" />
          </div>
          <span className="text-xs font-semibold text-white whitespace-nowrap">iPaper</span>
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-emerald-500 transition-transform duration-300 group-hover:scale-150" />
            <div className="h-1 w-1 rounded-full bg-emerald-500/50 transition-transform duration-300 group-hover:scale-150 group-hover:delay-100" />
            <div className="h-1 w-1 rounded-full bg-emerald-500/30 transition-transform duration-300 group-hover:scale-150 group-hover:delay-200" />
          </div>
        </div>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 opacity-20 transition-opacity duration-300 group-hover:opacity-40" />
      </div>
    </a>
  )
}

export default function BreakingTicker() {
  const { data: postsRaw } = useSWR(postsKey({ per_page: 8 }))
  const posts = asArray(postsRaw)
  if (!posts.length) {
    return (
      <div className="bg-black text-white border-b border-white/10">
        <div className="container mx-auto px-0 sm:px-4 flex items-stretch">
          <div className="flex items-center gap-1.5 bg-primary text-white px-3 py-2 text-xs font-bold uppercase tracking-wider shrink-0">
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span className="hidden sm:inline">Breaking</span>
          </div>
          <div className="flex-1 px-4 py-2 text-xs text-white/60">Loading latest headlines…</div>
          <div className="hidden sm:flex items-center gap-3 pl-3 pr-1 border-l border-white/10 shrink-0">
            <IpaperButton />
            <SocialIcons size="sm" />
          </div>
        </div>
      </div>
    )
  }
  const items = [...posts, ...posts]
  return (
    <div className="bg-black text-white border-b border-white/10">
      <div className="container mx-auto px-0 sm:px-4 flex items-stretch">
        <div className="flex items-center gap-1.5 bg-primary text-white px-3 py-2 text-xs font-bold uppercase tracking-wider shrink-0">
          <Zap className="h-3.5 w-3.5 fill-current" />
          <span className="hidden sm:inline">Breaking</span>
        </div>
        <div className="flex-1 overflow-hidden hover-ticker relative">
          <div className="ticker-track flex items-center whitespace-nowrap py-2" style={{ width: 'max-content' }}>
            {items.map((p, i) => (
              <Link key={`${p.id}-${i}`} to={`/article/${p.slug}`} className="text-sm px-6 hover:text-primary inline-flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                {decodeHtml(p.title?.rendered || '')}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 pl-3 pr-1 border-l border-white/10 shrink-0">
          <IpaperButton />
          <SocialIcons size="sm" />
        </div>
      </div>
    </div>
  )
}
