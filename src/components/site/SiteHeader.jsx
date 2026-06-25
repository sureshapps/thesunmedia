import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, Menu, Calendar, ChevronDown, ChevronRight } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import Logo from './Logo'
import SearchBar from './SearchBar'
import SocialIcons from './SocialIcons'
import { MAIN_MENU, itemHref } from '@/lib/menu'

const IPAPER_LOGO = 'https://customer-assets.emergentagent.com/job_headless-newsroom/artifacts/0tbdiob5_IPAPER.png'
const IPAPER_URL = 'https://thesun-ipaper.cld.bz/'
const TOP_BAR_BG = '#CFCFCF'

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

  // Determine if we should render a mega menu (two-or-more columns) vs simple list.
  // "News" and "More" want a multi-column layout because their children contain sub-groups.
  const hasGrouped = item.children.some(c => c.children && c.children.length)
  const cols = hasGrouped ? (item.children.length <= 2 ? 2 : item.children.length) : 1

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      {trigger}
      {open && (
        <div
          className={`absolute left-0 top-full pt-1 z-50`}
          style={{ minWidth: hasGrouped ? '520px' : '240px' }}
        >
          <div
            className={`bg-white border border-border shadow-xl rounded-md p-4 grid gap-x-6 gap-y-3`}
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
        className={`flex items-center justify-between ${padding} pr-3 py-2.5 rounded hover:bg-white/10 ${fontWeight} ${fontSize}`}
      >
        {item.label}
        <ChevronRight className="h-4 w-4 opacity-40" />
      </Link>
    )
  }

  return (
    <div>
      <div className={`flex items-center ${padding} pr-1 py-2.5 rounded hover:bg-white/10 ${fontWeight} ${fontSize}`}>
        {item.to || item.slug ? (
          <Link to={itemHref(item)} onClick={onNavigate} className="flex-1">
            {item.label}
          </Link>
        ) : (
          <span className="flex-1">{item.label}</span>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Expand"
          className="p-2 -mr-1"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {open && (
        <div className="border-l border-white/10 ml-3">
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
  const [today, setToday] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setToday(new Date().toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobile = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-border">
      {/* Top bar (#CFCFCF) */}
      <div className="text-xs text-black" style={{ backgroundColor: TOP_BAR_BG }}>
        <div className="container mx-auto px-4 flex justify-between items-center h-9 gap-4">
          <div className="flex items-center gap-2 font-medium">
            <Calendar className="h-3.5 w-3.5" />
            <span>{today || 'Loading...'}</span>
          </div>
          <SocialIcons size="sm" />
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] sm:w-[380px] bg-black text-white p-0 overflow-y-auto">
              <div className="p-5 border-b border-white/10 bg-black">
                <Logo size="md" />
              </div>
              <div className="p-4 border-b border-white/10">
                <SearchBar onSubmit={closeMobile} />
              </div>
              <nav className="flex flex-col px-2 py-3">
                {MAIN_MENU.map((item) => (
                  <MobileMenuItem key={item.label} item={item} onNavigate={closeMobile} />
                ))}
              </nav>
              <div className="px-5 py-4 border-t border-white/10">
                <p className="text-xs text-white/60 mb-3 uppercase tracking-wider">Follow Us</p>
                <SocialIcons size="md" />
              </div>
            </SheetContent>
          </Sheet>

          <Logo size={scrolled ? 'sm' : 'md'} className="transition-all" />

          <div className="hidden md:block flex-1 max-w-md mx-auto">
            <SearchBar />
          </div>

          <div className="flex items-center gap-2">
            <Link to="/search" className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Search">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            {/* iPaper button */}
            <a
              href={IPAPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read iPaper"
              className="hidden sm:inline-flex items-center rounded-md overflow-hidden border border-border bg-white hover:shadow-md transition-shadow"
            >
              <img src={IPAPER_LOGO} alt="iPaper" className="h-10 w-auto" />
            </a>
          </div>
        </div>

        {/* Desktop nav with dropdowns */}
        <nav className="hidden lg:flex items-center gap-0 border-t border-border">
          {MAIN_MENU.map((item) => (
            <Dropdown key={item.label} item={item} />
          ))}
        </nav>
      </div>
    </header>
  )
}
