import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Apple, PlayCircle, Smartphone } from 'lucide-react'
import SocialIcons from './SocialIcons'

// theSun app — single AppsFlyer OneLink smart link that routes the visitor
// to the correct store (App Store / Play Store / AppGallery) automatically.
const APP_LINK = 'https://onelink.to/k5mbcg'

// Footer background follows the KL skyline artwork. There are TWO versions
// of that art — a mobile crop (skyline-mobile.png) and a wider desktop crop
// (skyline-desktop.png) — swapped at the same `md` breakpoint used elsewhere
// below. Each art file's silhouette bleeds into a solid black panel at a
// very slightly different near-black tone, so each has its own seam color
// to guarantee a perfectly seamless join into the footer body regardless of
// which asset is showing.
const FOOTER_BG = '#030307'
const FOOTER_BG_SEAM_DESKTOP = '#030307'
const FOOTER_BG_SEAM_MOBILE = '#0c0c11'

// Three store badges rendered as individual bordered buttons (was one
// combined store-badges.png image before). Icons are generic lucide glyphs
// standing in for each store, not the stores' own brand marks.
const APP_STORES = [
  { eyebrow: 'Download it from', store: 'App Store', icon: Apple },
  { eyebrow: 'Get it on', store: 'Play Store', icon: PlayCircle },
  { eyebrow: 'Explore it', store: 'AppGallery', icon: Smartphone },
]

// 4 link columns, each with its own "Links" heading + red underline, matching
// the new mockup. Same underlying destinations as before, just grouped under
// explicit column headings instead of two plain nav lists + Company + Advertise.
const LINK_COLUMNS = [
  {
    heading: 'News',
    items: [
      { label: 'Malaysia', slug: 'malaysia-news' },
      { label: 'Asia', slug: 'asia' },
      { label: 'World', slug: 'world' },
      { label: 'Going Viral', slug: 'going-viral' },
      { label: 'Business', slug: 'business' },
      { label: 'Opinion', slug: 'opinion' },
    ],
  },
  {
    heading: 'More',
    items: [
      { label: 'Lifestyle', slug: 'lifestyle' },
      { label: 'Spotlight', slug: 'spotlight' },
      { label: 'Sports', slug: 'sports' },
      { label: 'Education', slug: 'education' },
      { label: 'Property', slug: 'property' },
      { label: 'Motoring', slug: 'motoring' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Advertise', to: '/advertise' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms of Use', to: '/terms' },
    ],
  },
  {
    heading: 'Subscriptions',
    items: [
      { label: 'Advertise (Print Media)', to: '/advertise' },
      { label: 'Advertise (Digital Media)', to: '/advertise' },
      { label: 'Newsletter Subscriptions', to: '/' }, // TODO: point at the real newsletter signup
      { label: 'iPaper Subscriptions', href: 'https://www.thesunit.my/ipaper' },
      { label: 'Classifieds', href: 'https://www.thesunit.my/classifieds' }, // TODO: confirm real classifieds URL
    ],
  },
]

// Partner / sister-site logo grid (the 6 "sample logo" boxes in the mockup).
// Placeholders until real logo images are supplied — swap `label` for an
// <img> per entry once assets exist.
const PARTNER_LOGOS = [
  { label: 'sample logo' },
  { label: 'sample logo' },
  { label: 'sample logo' },
  { label: 'sample logo' },
  { label: 'sample logo' },
  { label: 'sample logo' },
]

// Sunbot mascot + speech bubble that floats above the copyright bar.
// box-bubble.png is the speech-bubble artwork (tail pointing at the bot);
// the message is typed out on top of it once the footer mounts.
const SUNBOT_MESSAGE =
  "It's amazing that the amount of news that happens in the world every day always just exactly fits the newspaper.\n\nour support makes independent reporting possible. Welcome aboard!"

function SunbotMascot() {
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      i += 1
      setTyped(SUNBOT_MESSAGE.slice(0, i))
      if (i >= SUNBOT_MESSAGE.length) {
        clearInterval(timer)
        setDone(true)
      }
    }, 25)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex justify-center lg:justify-end">
      {/* Keyframes for the gentle float + typewriter cursor blink. */}
      <style>{`
        @keyframes sunbot-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes sunbot-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .sunbot-float { animation: sunbot-float 4.5s ease-in-out infinite; }
        .sunbot-cursor { animation: sunbot-blink 0.9s steps(1) infinite; }
      `}</style>

      <div className="sunbot-float flex items-end">
        <div className="relative w-[220px] sm:w-[280px]">
          <img
            src="/footer/box-bubble.png"
            alt=""
            aria-hidden="true"
            className="w-full h-auto select-none pointer-events-none"
          />
          <p className="absolute top-[14%] left-[7%] right-[16%] text-[10px] sm:text-xs leading-relaxed text-white/80 whitespace-pre-line">
            {typed}
            {!done && (
              <span className="sunbot-cursor inline-block w-[2px] h-[1em] -mb-[2px] bg-white/70 ml-0.5" aria-hidden="true" />
            )}
          </p>
        </div>
        <img
          src="/footer/sunbot.png"
          alt="theSun mascot"
          className="w-20 sm:w-28 h-auto -ml-2 sm:-ml-3 select-none pointer-events-none"
        />
      </div>
    </div>
  )
}

function LinkColumn({ heading, items }) {
  return (
    <div className="text-center sm:text-left">
      <h3 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wide pb-1.5 border-b-2 border-primary inline-block">
        {heading}
      </h3>
      <ul className="mt-3 space-y-2 sm:space-y-2.5 text-[11px] sm:text-sm leading-snug text-[#898989]">
        {items.map((item) => (
          <li key={item.label}>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ) : item.slug ? (
              <Link to={`/category/${item.slug}`} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            ) : (
              <Link to={item.to} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SiteFooter() {
  return (
    <footer className="text-white mt-16 overflow-hidden" style={{ backgroundColor: FOOTER_BG }}>
      {/* KL skyline artwork — white sky on top, solid black city silhouette on
          the bottom that fills edge-to-edge into the footer body below.
          Desktop gets the wider crop, mobile/tablet gets the taller crop
          made for narrower viewports; swapped via <picture> so only the
          needed asset is downloaded. */}
      <div className="relative leading-[0]">
        <picture>
          <source media="(min-width: 768px)" srcSet="/footer/skyline-desktop.png" />
          <img
            src="/footer/skyline-mobile.png"
            alt=""
            aria-hidden="true"
            className="w-full h-auto block select-none pointer-events-none"
          />
        </picture>
        <div
          className="absolute bottom-0 left-0 right-0 h-2 hidden md:block"
          style={{ backgroundColor: FOOTER_BG_SEAM_DESKTOP }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-2 block md:hidden"
          style={{ backgroundColor: FOOTER_BG_SEAM_MOBILE }}
        />
      </div>

      <div className="container mx-auto px-4 pt-10 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-8">

          {/* Logo + tagline + app promo + Follow Us + partner logos —
              centered on mobile, left-aligned on desktop. */}
          <div className="lg:col-span-5 flex flex-col items-center text-center lg:items-start lg:text-left">
            <Link to="/" aria-label="theSun - Home" className="inline-block">
              <img src="/footer/logo-color.png" alt="theSun" className="h-14 sm:h-16 w-auto" />
            </Link>

            <p className="mt-3 text-sm sm:text-base text-white/80 font-semibold">
              Independent Malaysian Journalism.
            </p>

            <div className="mt-6">
              <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wide">
                Download Our App Now.
              </h3>
              <p className="mt-1 text-sm text-white/60">
                Your trusted source for news that matters.
              </p>
            </div>

            <div className="mt-3 flex flex-wrap justify-center lg:justify-start gap-2">
              {APP_STORES.map(({ eyebrow, store, icon: Icon }) => (
                <a
                  key={store}
                  href={APP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${eyebrow} ${store}`}
                  className="flex items-center gap-2 rounded-md border border-white/25 px-3 py-2 hover:border-primary hover:bg-white/5 transition-colors"
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="leading-tight text-left">
                    <span className="block text-[9px] text-white/60">{eyebrow}</span>
                    <span className="block text-xs font-bold">{store}</span>
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-2.5">Follow Us</p>
              <SocialIcons size="md" />
            </div>

            {/* Partner / sister-site logo grid */}
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-[480px]">
              {PARTNER_LOGOS.map((logo, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center h-14 sm:h-16 rounded-md border border-white/25 text-white/40 text-[11px] sm:text-xs italic font-semibold text-center px-2"
                >
                  {logo.label}
                </div>
              ))}
            </div>
          </div>

          {/* Link columns — 4 across, each with its own heading + red underline. */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6">
              {LINK_COLUMNS.map((col) => (
                <LinkColumn key={col.heading} heading={col.heading} items={col.items} />
              ))}
            </div>
          </div>
        </div>

        {/* Sunbot mascot — floats gently, speech bubble types itself out. */}
        <div className="mt-10 lg:mt-6">
          <SunbotMascot />
        </div>

        {/* Copyright — separated by a top border, stacked/centered on mobile,
            split left/right on desktop. */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-white/50 text-center sm:text-left">
          <p>© 1993-2026 All Rights Reserved.</p>
          <p>The Sun Malaysia is proudly owned by Sun Media Corporation Sdn Bhd. (221220-K)</p>
        </div>
      </div>
    </footer>
  )
}
