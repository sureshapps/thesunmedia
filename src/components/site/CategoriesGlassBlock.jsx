import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { LayoutGrid } from 'lucide-react'
import { categoriesKey, decodeHtml, asArray } from '@/lib/wp'

export default function CategoriesGlassBlock({ limit = 16 }) {
  const { data: catsRaw } = useSWR(categoriesKey({ per_page: limit, orderby: 'count', order: 'desc' }))
  const cats = asArray(catsRaw).filter((c) => c.slug !== 'uncategorized')

  return (
    <section className="relative rounded-[2rem] p-5 sm:p-6 overflow-hidden bg-gradient-to-br from-primary via-red-700 to-[#5c0e12] shadow-[0_25px_50px_-15px_rgba(150,15,20,0.55)]">
      {/* Decorative glass orbs — depth without a texture image */}
      <div className="pointer-events-none absolute -top-12 -right-8 w-44 h-44 rounded-full bg-white/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-black/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10" />

      <h3 className="relative text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
        <LayoutGrid className="h-4 w-4" /> Browse Categories
      </h3>

      <div className="relative grid grid-cols-2 gap-2.5">
        {cats.length === 0
          ? [...Array(limit)].map((_, i) => (
              <div key={i} className="h-11 rounded-xl bg-white/10 border border-white/10 animate-pulse" />
            ))
          : cats.map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.slug}`}
                className="group relative flex items-center justify-center gap-1 text-center px-3 py-2.5 rounded-xl
                           text-xs sm:text-[13px] font-semibold text-white overflow-hidden
                           bg-white/10 backdrop-blur-md border border-white/20
                           shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_10px_-4px_rgba(0,0,0,0.4)]
                           hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5 hover:shadow-lg
                           transition-all duration-200"
              >
                {/* subtle glass sheen sweep on hover */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative truncate">{decodeHtml(c.name)}</span>
                <span className="relative text-white/70 font-normal shrink-0">({c.count})</span>
              </Link>
            ))}
      </div>
    </section>
  )
}
