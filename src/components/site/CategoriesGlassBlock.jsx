import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { LayoutGrid } from 'lucide-react'
import { categoriesKey, decodeHtml, asArray } from '@/lib/wp'

export default function CategoriesGlassBlock({ limit = 16 }) {
  const { data: catsRaw } = useSWR(categoriesKey({ per_page: limit, orderby: 'count', order: 'desc' }))
  const cats = asArray(catsRaw).filter((c) => c.slug !== 'uncategorized')

  return (
    <section className="relative rounded-[2rem] p-5 sm:p-6 overflow-hidden bg-gradient-to-b from-[#e2272c] via-[#b81f24] to-[#530d11] shadow-[0_25px_55px_-15px_rgba(140,10,15,0.55)]">
      {/* Soft blurred glass-colour blobs behind everything, red palette version of the
          "sample background" reference — depth without needing a texture image */}
      <div className="pointer-events-none absolute -top-16 -left-10 w-52 h-52 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-14 w-56 h-56 rounded-full bg-rose-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 w-56 h-56 rounded-full bg-black/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10" />

      <h3 className="relative font-serif-headline text-white font-bold text-base sm:text-lg uppercase tracking-wider mb-4 flex items-center gap-2">
        <LayoutGrid className="h-4 w-4 shrink-0" /> Browse Categories
      </h3>

      <div className="relative grid grid-cols-2 gap-3">
        {cats.length === 0
          ? [...Array(limit)].map((_, i) => (
              <div key={i} className="h-[52px] rounded-xl bg-white/10 border border-white/10 animate-pulse" />
            ))
          : cats.map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.slug}`}
                className="group relative flex items-center justify-center gap-1.5 text-center px-3 py-3.5 rounded-xl overflow-hidden
                           text-xs sm:text-[14px] font-bold text-white
                           bg-gradient-to-b from-white/25 to-white/5 backdrop-blur-md border border-white/25
                           shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_14px_-6px_rgba(0,0,0,0.45)]
                           hover:from-white/35 hover:to-white/10 hover:border-white/40 hover:-translate-y-0.5
                           transition-all duration-200"
              >
                {/* glass sheen sweep on hover */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <span className="relative truncate">{decodeHtml(c.name)}</span>
                <span className="relative font-normal text-white/70 shrink-0">({c.count})</span>
              </Link>
            ))}
      </div>
    </section>
  )
}
