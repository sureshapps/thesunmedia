import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Search, Menu, X, ChevronDown,
  Home as HomeIcon, Newspaper, Flame, Briefcase, MessageSquare,
  Coffee, Trophy, Car, GraduationCap, PlayCircle, MoreHorizontal,
  Tag, Mail, ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Logo from './Logo'
import SearchBar from './SearchBar'
import SocialIcons from './SocialIcons'
import WeatherClock from './WeatherClock'
import { MAIN_MENU, itemHref } from '@/lib/menu'
import { postsKey, decodeHtml, asArray } from '@/lib/wp'
import useSWR from 'swr'

const IPAPER_LOGO = 'https://customer-assets.emergentagent.com/job_headless-newsroom/artifacts/0tbdiob5_IPAPER.png'
const IPAPER_URL = 'https://thesun-ipaper.cld.bz/'
const ADS_BANNER_URL = 'https://via.placeholder.com/728x90/cccccc/666666?text=Advertisement'
// e-Paper phone mockup shown in the mobile menu "Read e-Paper" card
const IPAPER_PHONE_MOCKUP = '/images/ipaper-iphone-mockup.png'

// Icon shown in the red badge next to each top-level mobile menu label.
// Matched by label text with a sane fallback, since MAIN_MENU items don't carry their own icon.
const MOBILE_MENU_ICONS = {
  'Home': HomeIcon,
  'News': Newspaper,
  'Going Viral': Flame,
  'Business': Briefcase,
  'Opinion': MessageSquare,
  'Lifestyle': Coffee,
  'Sports': Trophy,
  'Motoring': Car,
  'Education': GraduationCap,
  'Videos': PlayCircle,
  'More': MoreHorizontal,
}
function getMobileIcon(label) {
  return MOBILE_MENU_ICONS[label] || Tag
}

// Pull the primary category name from an embedded post (WP REST _embed).
function getCategoryName(post) {
  return post?._embedded?.['wp:term']?.[0]?.[0]?.name || null
}

// ---------- Inline Breaking Ticker for top bar ----------
function TopBarTicker() {
  const { data: postsRaw } = useSWR(postsKey({ per_page: 8 }))
  const posts = asArray(postsRaw)
  const items = posts.length ? [...posts, ...posts] : []

  return (
    <div className="flex items-stretch flex-1 min-w-0 overflow-hidden">
      {/* Label */}
      <div className="flex items-center gap-1.5 shrink-0 pr-3 mr-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none">
          NEWS<br />FEED
        </span>
      </div>
      {/* Scrolling ticker */}
      <div className="flex-1 overflow-hidden hover-ticker relative flex items-center">
        {items.length === 0 ? (
          <span className="text-xs text-white/60 px-2">Loading latest headlines…</span>
        ) : (
          <div className="ticker-track flex items-center whitespace-nowrap" style={{ width: 'max-content' }}>
            {items.map((p, i) => {
              const cat = getCategoryName(p)
              return (
                <Link
                  key={`${p.id}-${i}`}
                  to={`/article/${p.slug}`}
                  className="text-xs px-5 hover:text-primary inline-flex items-center gap-2.5 text-white/90"
                >
                  {cat && (
                    <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-primary bg-white rounded px-1.5 py-0.5 shadow-sm">
                      {decodeHtml(cat)}
                    </span>
                  )}
                  {decodeHtml(p.title?.rendered || '')}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}


// ---------- Animated World Cup nav item (desktop) ----------
function WorldCupLink() {
  return (
    <a
      href="https://worldcup2026.thesun.my/"
      target="_blank"
      rel="noopener noreferrer"
      className="mx-1 my-1 px-3 py-2 text-sm font-extrabold uppercase tracking-wide whitespace-nowrap inline-flex items-center gap-1.5 bg-primary/85 hover:bg-primary/95 backdrop-blur-md border border-white/15 shadow-md shadow-primary/25 text-white rounded transition-colors"
    >
      World Cup '26
      <span className="inline-block animate-bounce" style={{ animationDuration: '0.8s' }}>⚽</span>
    </a>
  )
}

// ---------- Desktop Dropdown ----------
function Dropdown({ item }) {
  if (item.worldcup) return <WorldCupLink />
  const [open, setOpen] = useState(false)
  const timer = useRef(null)
  const hasChildren = !!(item.children && item.children.length)
  const { pathname } = useLocation()
  const isActive = item.to ? pathname === item.to : item.slug ? pathname.startsWith(`/category/${item.slug}`) : false
  const activeCls = isActive
    ? 'bg-primary/10 backdrop-blur-md border-primary/25 text-primary shadow-sm shadow-primary/10'
    : 'border-transparent'

  function show() { clearTimeout(timer.current); setOpen(true) }
  function hide() {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(false), 120)
  }

  const trigger = (
    <span className={`px-3 py-2 my-1 text-sm font-semibold uppercase tracking-wide hover:text-primary border hover:border-primary rounded transition-colors inline-flex items-center gap-1 cursor-pointer ${activeCls}`}>
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
    if (item.worldcup) {
      return (
        <a
          href={item.to}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-1 my-1 px-3 py-2 text-sm font-extrabold uppercase tracking-wide whitespace-nowrap inline-flex items-center gap-1.5 bg-primary/85 hover:bg-primary/95 backdrop-blur-md border border-white/15 shadow-md shadow-primary/25 text-white rounded transition-colors"
        >
          World Cup '26
          <span className="inline-block animate-bounce" style={{ animationDuration: '1.8s' }}>⚽</span>
        </a>
      )
    }
    return (
      <Link to={itemHref(item)} className={`px-3 py-2 my-1 text-sm font-semibold uppercase tracking-wide hover:text-primary border hover:border-primary rounded transition-colors whitespace-nowrap ${activeCls}`}>
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

// ---------- Mobile full-page menu: World Cup promo banner ----------
function MobileWorldCupBanner({ item, onNavigate }) {
  return (
    <a
      href={item.to}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-primary/5 via-primary/5 to-transparent p-3.5"
    >
      <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white shadow-sm shrink-0 text-xl">
        ⚽
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-bold text-sm">{item.label}</span>
        <span className="block text-xs text-muted-foreground">Latest updates, fixtures, and more</span>
      </span>
      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white shrink-0">
        <ArrowRight className="h-4 w-4" />
      </span>
    </a>
  )
}

// ---------- Mobile full-page menu: top-level row (icon badge + label + chevron) ----------
function MobileMenuItem({ item, onNavigate }) {
  if (item.worldcup) return <MobileWorldCupBanner item={item} onNavigate={onNavigate} />

  const [open, setOpen] = useState(false)
  const hasChildren = !!(item.children && item.children.length)
  const Icon = getMobileIcon(item.label)

  const row = (
    <div className="flex items-center gap-3 px-3.5 py-3">
      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-white shrink-0">
        <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
      </span>
      {item.to || item.slug ? (
        <Link to={itemHref(item)} onClick={onNavigate} className="flex-1 font-semibold text-[15px]">
          {item.label}
        </Link>
      ) : (
        <span className="flex-1 font-semibold text-[15px]">{item.label}</span>
      )}
      {hasChildren && (
        <button
          onClick={() => setOpen(o => !o)}
          aria-label={`${open ? 'Collapse' : 'Expand'} ${item.label}`}
          aria-expanded={open}
          className="p-1.5 -mr-1 text-muted-foreground shrink-0"
        >
          <ChevronDown className={`h-[18px] w-[18px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  )

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {!item.to && !item.slug && hasChildren ? (
        <button onClick={() => setOpen(o => !o)} className="w-full text-left" aria-expanded={open}>
          {row}
        </button>
      ) : (
        row
      )}
      {hasChildren && (
        <div
          className={`grid transition-all duration-200 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-border bg-muted/30 py-1.5">
              {item.children.map((c) => (
                <MobileSubItem key={c.label} item={c} onNavigate={onNavigate} depth={1} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- Mobile full-page menu: nested child row (no icon badge) ----------
function MobileSubItem({ item, onNavigate, depth = 1 }) {
  const [open, setOpen] = useState(false)
  const hasChildren = !!(item.children && item.children.length)
  const padding = depth === 1 ? 'pl-[3.25rem]' : 'pl-[4.5rem]'

  if (!hasChildren) {
    return (
      <Link
        to={itemHref(item)}
        onClick={onNavigate}
        className={`flex items-center justify-between ${padding} pr-3.5 py-2 text-[13.5px] text-foreground/85 hover:text-primary`}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div>
      <div className={`flex items-center ${padding} pr-2 py-2 text-[13.5px] font-medium`}>
        {item.to || item.slug ? (
          <Link to={itemHref(item)} onClick={onNavigate} className="flex-1">{item.label}</Link>
        ) : (
          <span className="flex-1">{item.label}</span>
        )}
        <button onClick={() => setOpen(o => !o)} aria-label="Expand" className="p-1.5">
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {open && (
        <div>
          {item.children.map((c) => (
            <MobileSubItem key={c.label} item={c} onNavigate={onNavigate} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

// ---------- Mobile full-page menu (custom fade in/out overlay) ----------
function MobileFullPageMenu({ open, onClose }) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let raf, timeout
    if (open) {
      setMounted(true)
      raf = requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
      timeout = setTimeout(() => setMounted(false), 300)
    }
    return () => { cancelAnimationFrame(raf); clearTimeout(timeout) }
  }, [open])

  // Lock body scroll while the full-page menu is open
  useEffect(() => {
    if (!mounted) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [mounted])

  // Close on Escape
  useEffect(() => {
    if (!mounted) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mounted, onClose])

  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white overflow-y-auto transition-opacity duration-300 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      {/* Top row: logo + close */}
      <div className="flex items-center justify-between px-4 py-4">
        <Logo size="md" />
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="flex items-center justify-center w-9 h-9 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors shrink-0"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-4">
        <SearchBar onSubmit={onClose} />
      </div>

      {/* Explore */}
      <div className="px-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">Explore</p>
        <nav className="flex flex-col gap-2">
          {MAIN_MENU.map((item) => (
            <MobileMenuItem key={item.label} item={item} onNavigate={onClose} />
          ))}
        </nav>
      </div>

      {/* Stay informed / Subscribe */}
      <div className="px-4 mt-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">Stay Informed</p>
        <a
          href="/newsletter"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl bg-primary p-4 hover:bg-primary/90 transition-colors"
        >
          <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-white/15 text-white shrink-0">
            <Mail className="h-5 w-5" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-bold text-sm text-white">Subscribe to theSun</span>
            <span className="block text-xs text-white/80">Get the latest headlines delivered to you daily.</span>
          </span>
          <span className="shrink-0 bg-white text-primary font-bold text-xs uppercase tracking-wide rounded-md px-3.5 py-2">
            Subscribe
          </span>
        </a>
      </div>

      {/* Read e-Paper */}
      <div className="px-4 mt-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">Read e-Paper</p>
        <a
          href={IPAPER_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Read iPaper"
          className="relative flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 pr-2 overflow-hidden hover:bg-muted/50 transition-colors"
        >
          <span className="flex-1 min-w-0">
            <img src={IPAPER_LOGO} alt="iPaper" className="h-6 w-auto mb-2" />
            <span className="block font-bold text-sm">iPaper</span>
            <span className="block text-xs text-muted-foreground">Read today's edition anytime, anywhere.</span>
          </span>
          <img
            src={IPAPER_PHONE_MOCKUP}
            alt=""
            aria-hidden="true"
            className="w-24 h-auto shrink-0 -mb-4 -mr-2 drop-shadow-md"
          />
        </a>
      </div>

      {/* Follow us */}
      <div className="px-4 mt-6 pb-8">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">Follow Us</p>
        <SocialIcons size="md" dark />
      </div>
    </div>
  )
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobile = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <style>{`@keyframes wcBounce { from { transform: translateY(0) rotate(0deg); } to { transform: translateY(-5px) rotate(20deg); } }`}</style>

      {/* Mobile full-page menu (trigger lives in the mobile logo row below) */}
      <MobileFullPageMenu open={open} onClose={closeMobile} />

      {/* ── ROW 1: Dark ticker bar ── */}
      <div className="bg-[#2d2d2d] text-white">
        <div className="container mx-auto px-4 flex items-center h-10 gap-3">

          {/* Ticker */}
          <TopBarTicker />

          {/* Right-side controls — desktop only, mobile has its own row below */}
          <div className="hidden lg:flex items-center gap-1 shrink-0 ml-2">
            {/* Search icon */}
            <button
              onClick={() => setSearchOpen(o => !o)}
              aria-label="Search"
              className="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Subscribe button */}
            <a
              href="/newsletter"
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 px-2.5 py-1 rounded text-white transition-colors whitespace-nowrap"
            >
              Subscribe
            </a>

            {/* Divider */}
            <span className="w-px h-4 bg-white/20 mx-1" />

            {/* Social icons */}
            <SocialIcons size="sm" />

            {/* Divider */}
            <span className="w-px h-4 bg-white/20 mx-1" />

            {/* iPaper button */}
            <a
              href={IPAPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read iPaper"
              className="inline-flex items-center rounded overflow-hidden hover:opacity-80 transition-opacity"
            >
              <img src={IPAPER_LOGO} alt="iPaper" className="h-7 w-auto" />
            </a>
          </div>
        </div>

        {/* Expandable search bar under ticker — desktop only */}
        {searchOpen && (
          <div className="hidden lg:block border-t border-white/10 bg-[#262626]">
            <div className="container mx-auto px-4 py-2">
              <SearchBar onSubmit={() => setSearchOpen(false)} />
            </div>
          </div>
        )}
      </div>

      {/* ── ROW 1.5 (mobile only): Logo + Search + Menu, always visible, never collapses on scroll ── */}
      <div className="lg:hidden bg-white border-b border-border">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-3">
          <Logo size="sm" />
          <div className="flex items-center gap-1.5 shrink-0">
            <WeatherClock variant="compact" />
            <button
              onClick={() => setMobileSearchOpen(o => !o)}
              aria-label="Search"
              className="p-2 rounded-md border-2 border-border bg-muted/40 text-foreground hover:bg-muted hover:border-primary/50 transition-colors"
            >
              <Search className="h-5 w-5" strokeWidth={2.75} />
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(true)}
              className="h-9 w-9 rounded-md border-2 border-border bg-muted/40 text-foreground hover:bg-muted hover:border-primary/50"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" strokeWidth={2.75} />
            </Button>
          </div>
        </div>
        {mobileSearchOpen && (
          <div className="border-t border-border bg-white">
            <div className="container mx-auto px-4 py-2">
              <SearchBar onSubmit={() => setMobileSearchOpen(false)} />
            </div>
          </div>
        )}
      </div>

      {/* ── ROW 2: Logo + Ads Banner — desktop only, collapses on scroll ── */}
      <div className={`hidden lg:block border-border bg-white overflow-hidden transition-all duration-300 ease-in-out ${scrolled ? 'max-h-0 border-b-0 opacity-0 pointer-events-none' : 'max-h-40 border-b opacity-100'}`}>
        <div className="container mx-auto px-4 py-3 flex items-center gap-6">
          {/* Logo */}
          <div className="shrink-0">
            <Logo size={scrolled ? 'sm' : 'md'} className="transition-all" />
          </div>

          {/* Ads Banner — takes remaining space */}
          <div className="flex-1 flex items-center justify-center min-h-[90px]">
            <a
              href="#"
              className="block w-full max-w-[728px] h-[90px] overflow-hidden rounded"
              aria-label="Advertisement"
            >
              <img src="/ads/top-bar-banner.png" alt="Advertisement" className="w-full h-full object-cover" />
            </a>
          </div>

          {/* Weather + date/time */}
          <WeatherClock variant="full" className="hidden xl:flex" />

        </div>
      </div>

      {/* ── ROW 3: Desktop nav ── */}
      <div className="hidden lg:block bg-white border-b border-border">
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