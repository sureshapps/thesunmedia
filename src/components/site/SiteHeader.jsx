import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, Menu, ChevronDown, ChevronRight } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import Logo from './Logo'
import SearchBar from './SearchBar'
import SocialIcons from './SocialIcons'
import { MAIN_MENU, itemHref } from '@/lib/menu'
import { postsKey, decodeHtml } from '@/lib/wp'
import useSWR from 'swr'
import { Zap } from 'lucide-react'

const IPAPER_LOGO = 'https://customer-assets.emergentagent.com/job_headless-newsroom/artifacts/0tbdiob5_IPAPER.png'
const IPAPER_URL = 'https://thesun-ipaper.cld.bz/'
const ADS_BANNER_URL = 'https://via.placeholder.com/728x90/cccccc/666666?text=Advertisement'

// ---------- Inline Breaking Ticker for top bar ----------
function TopBarTicker() {
  const { data: posts } = useSWR(postsKey({ per_page: 8 }))
  const items = posts?.length ? [...posts, ...posts] : []

  return (
    <div className="flex items-stretch flex-1 min-w-0 overflow-hidden">
      {/* Label */}
      <div className="flex items-center gap-1.5 shrink-0 pr-3 mr-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none">
          LATEST<br />HEADLINES
        </span>
      </div>
      {/* Scrolling ticker */}
      <div className="flex-1 overflow-hidden hover-ticker relative flex items-center">
        {items.length === 0 ? (
          <span className="text-xs text-white/60 px-2">Loading latest headlines…</span>
        ) : (
          <div className="ticker-track flex items-center whitespace-nowrap" style={{ width: 'max-content' }}>
            {items.map((p, i) => (
              <Link
                key={`${p.id}-${i}`}
                to={`/article/${p.slug}`}
                className="text-xs px-5 hover:text-primary inline-flex items-center gap-2.5 text-white/90"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block shrink-0" />
                {decodeHtml(p.title?.rendered || '')}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------- Desktop Dropdown ----------
function Dropdown({ item }) {
  const [open, setOpen] = useState(false)
  const timer = useRef(null)
  const hasChildren = !!(item.children && item.children.length)

  function show() { clearTimeout(timer.current); setOpen(true) }
  function hide() {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(false), 120)
  }

  const trigger = (
    <span className="px-3 py-3 text-sm font-semibold uppercase tracking-wide hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors inline-flex items-center gap-1 cursor-pointer">
      {item.to || item.slug ? (
        <Link to={itemHref(item)} className="focus:outline-none">
          {item.label}
        </Link>
      ) : (
        <span>{item.label}</span>
      )}
      {hasChildren && <ChevronDown className="h-3.5 w-3.5" />}
    </span>
  )

  if (!hasChildren) {
    return (
      <Link to={itemHref(item)} className="px-3 py-3 text-sm font-semibold uppercase tracking-wide hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors whitespace-nowrap">
        {item.label}
      </Link>
    )
  }

  const hasGrouped = item.children.some(c => c.children && c.children.length)
  const cols = hasGrouped ? (item.children.length <= 2 ? 2 : item.children.length) : 1

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      {trigger}
      {open && (
        <div className="absolute left-0 top-full pt-1 z-50" style={{ minWidth: hasGrouped ? '520px' : '240px' }}>
          <div
            className="bg-white border border-border shadow-xl rounded-md p-4 grid gap-x-6 gap-y-3"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {item.children.map((child) => (
              <div key={child.label} className="min-w-[160px]">
                {child.slug ? (
                  <Link to={itemHref(child)} className="block font-bold text-sm uppercase tracking-wide text-primary hover:underline mb-2">
                    {child.label}
                  </Link>
                ) : (
                  <div className="font-bold text-sm uppercase tracking-wide text-primary mb-2">{child.label}</div>
                )}
                {child.children && child.children.length > 0 && (
                  <ul className="space-y-1">
                    {child.children.map((g) => (
                      <li key={g.label}>
                        <Link to={itemHref(g)} className="block text-sm text-foreground hover:text-primary py-1">
                          {g.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- Mobile collapsible menu item ----------
function MobileMenuItem({ item, onNavigate, depth = 0 }) {
  const [open, setOpen] = useState(false)
  const hasChildren = !!(item.children && item.children.length)
  const padding = { 0: 'pl-3', 1: 'pl-6', 2: 'pl-9' }[depth] || 'pl-3'
  const fontWeight = depth === 0 ? 'font-semibold' : 'font-normal'
  const fontSize = depth === 0 ? 'text-sm' : 'text-[13px]'

  if (!hasChildren) {
    return (
      <Link
        to={itemHref(item)}
        onClick={onNavigate}
        className={`flex items-center justify-between ${padding} pr-3 py-2.5 rounded hover:bg-muted ${fontWeight} ${fontSize}`}
      >
        {item.label}
        <ChevronRight className="h-4 w-4 opacity-40" />
      </Link>
    )
  }

  return (
    <div>
      <div className={`flex items-center ${padding} pr-1 py-2.5 rounded hover:bg-muted ${fontWeight} ${fontSize}`}>
        {item.to || item.slug ? (
          <Link to={itemHref(item)} onClick={onNavigate} className="flex-1">{item.label}</Link>
        ) : (
          <span className="flex-1">{item.label}</span>
        )}
        <button onClick={() => setOpen(o => !o)} aria-label="Expand" className="p-2 -mr-1">
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {open && (
        <div className="border-l border-border ml-3">
          {item.children.map((c) => (
            <MobileMenuItem key={c.label} item={c} onNavigate={onNavigate} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobile = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      {/* ── ROW 1: Dark ticker bar ── */}
      <div className="bg-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 flex items-center h-10 gap-3">

          {/* Mobile hamburger (visible on small screens) */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10 h-7 w-7 shrink-0" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] sm:w-[380px] bg-white text-foreground p-0 overflow-y-auto">
              <div className="p-5 border-b border-border bg-white">
                <Logo size="md" />
              </div>
              <div className="p-4 border-b border-border">
                <SearchBar onSubmit={closeMobile} />
              </div>
              <nav className="flex flex-col px-2 py-3">
                {MAIN_MENU.map((item) => (
                  <MobileMenuItem key={item.label} item={item} onNavigate={closeMobile} />
                ))}
              </nav>
              <div className="px-5 py-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Follow Us</p>
                <SocialIcons size="md" dark />
              </div>
            </SheetContent>
          </Sheet>

          {/* Ticker */}
          <TopBarTicker />

          {/* Right-side controls */}
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {/* Search icon */}
            <button
              onClick={() => setSearchOpen(o => !o)}
              aria-label="Search"
              className="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Newsletter button */}
            <a
              href="/newsletter"
              className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider border border-white/50 hover:border-white px-2.5 py-1 rounded text-white/90 hover:text-white transition-colors whitespace-nowrap"
            >
              Newsletter
            </a>

            {/* Divider */}
            <span className="hidden sm:block w-px h-4 bg-white/20 mx-1" />

            {/* Social icons */}
            <div className="hidden md:block">
              <SocialIcons size="sm" />
            </div>

            {/* Divider */}
            <span className="hidden md:block w-px h-4 bg-white/20 mx-1" />

            {/* iPaper button */}
            <a
              href={IPAPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read iPaper"
              className="hidden sm:inline-flex items-center rounded overflow-hidden hover:opacity-80 transition-opacity"
            >
              <img src={IPAPER_LOGO} alt="iPaper" className="h-7 w-auto" />
            </a>
          </div>
        </div>

        {/* Expandable search bar under ticker */}
        {searchOpen && (
          <div className="border-t border-white/10 bg-[#111]">
            <div className="container mx-auto px-4 py-2">
              <SearchBar onSubmit={() => setSearchOpen(false)} />
            </div>
          </div>
        )}
      </div>

      {/* ── ROW 2: Logo + Ads Banner ── */}
      <div className={`border-border bg-white overflow-hidden transition-all duration-300 ease-in-out ${scrolled ? 'max-h-0 border-b-0 opacity-0 pointer-events-none' : 'max-h-40 border-b opacity-100'}`}>
        <div className="container mx-auto px-4 py-3 flex items-center gap-6">
          {/* Logo */}
          <div className="shrink-0">
            <Logo size={scrolled ? 'sm' : 'md'} className="transition-all" />
          </div>

          {/* Ads Banner — takes remaining space */}
          <div className="flex-1 flex items-center justify-center min-h-[90px]">
            {/* Replace the img below with your actual ad tag / component */}
            <div
              className="w-full max-w-[728px] h-[90px] bg-[#d0d0d0] flex items-center justify-center rounded text-sm font-bold text-[#555] tracking-wide uppercase select-none"
              aria-label="Advertisement"
            >
              ads banner
            </div>
          </div>

        </div>
      </div>

      {/* ── ROW 3: Desktop nav ── */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <nav className="hidden lg:flex items-center gap-0">
            {MAIN_MENU.map((item) => (
              <Dropdown key={item.label} item={item} />
            ))}
          </nav>
        </div>
      </div>

    </header>
  )
}