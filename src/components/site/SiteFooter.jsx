import { Link } from 'react-router-dom'
import SocialIcons from './SocialIcons'

// theSun app — single AppsFlyer OneLink smart link that routes the visitor
// to the correct store (App Store / Play Store / AppGallery) automatically.
// The banner AND the 3-badge image both point here — one link, not three.
const APP_LINK = 'https://onelink.to/k5mbcg'

const FOOTER_BG = '#545454'

// Two side-by-side link columns (left group)
const LINK_COLUMNS = [
  [
    { label: 'Malaysia', slug: 'malaysia-news' },
    { label: 'Asia', slug: 'asia' },
    { label: 'World', slug: 'world' },
    { label: 'Going Viral', slug: 'going-viral' },
    { label: 'Business', slug: 'business' },
    { label: 'Opinion', slug: 'opinion' },
  ],
  [
    { label: 'Lifestyle', slug: 'lifestyle' },
    { label: 'Spotlight', slug: 'spotlight' },
    { label: 'Sports', slug: 'sports' },
    { label: 'Education', slug: 'education' },
    { label: 'Property', slug: 'property' },
    { label: 'Motoring', slug: 'motoring' },
  ],
]

// Company column (right group, after the vertical divider)
const COMPANY_LINKS = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Advertise', to: '/advertise' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Use', to: '/terms' },
  { label: 'Disclaimer', to: '/disclaimer' },
]

export default function SiteFooter() {
  return (
    <footer className="text-white mt-16 overflow-hidden" style={{ backgroundColor: FOOTER_BG }}>
      {/* Decorative wave — sits inside the footer so the dark footer bg shows through
          its transparent areas, creating the wavy white/gray transition at the top */}
      <img
        src="/footer/wave-top.png"
        alt=""
        aria-hidden="true"
        className="w-full h-auto block select-none pointer-events-none"
      />

      <div className="container mx-auto px-4 pt-2 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10">
          {/* Logo + tagline + app promo + social */}
          <div className="lg:col-span-5">
            <Link to="/" aria-label="theSun - Home" className="inline-block">
              <img src="/footer/logo-gray.png" alt="theSun" className="h-16 w-auto" />
            </Link>

            <p className="mt-4 text-base text-white/80 font-semibold">
              Independent Malaysian Journalism.
            </p>

            {/* "Download theSun app now" banner — links to the OneLink smart link */}
            <a
              href={APP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download theSun app"
              className="mt-5 block max-w-[300px] transition-opacity hover:opacity-90"
            >
              <img
                src="/footer/download-app-banner.png"
                alt="Download theSun App Now"
                className="w-full h-auto"
              />
            </a>

            {/* App Store / Play Store / AppGallery badges — same OneLink for all three */}
            <a
              href={APP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get theSun app on the App Store, Play Store or AppGallery"
              className="mt-3 block max-w-[360px] transition-transform hover:scale-[1.02]"
            >
              <img
                src="/footer/store-badges.png"
                alt="Download it from App Store, Get it on Play Store, Explore it AppGallery"
                className="w-full h-auto"
              />
            </a>

            <p className="mt-5 text-sm text-white/60">
              Your trusted source for news that matters.
            </p>

            <div className="mt-6">
              <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-2.5">
                Follow The Sun Malaysia
              </p>
              <SocialIcons />
            </div>
          </div>

          {/* Section links — column 1 */}
          <div className="lg:col-span-2">
            <ul className="space-y-3 text-[15px] text-white/75">
              {LINK_COLUMNS[0].map((item) => (
                <li key={item.slug}>
                  <Link to={`/category/${item.slug}`} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section links — column 2 */}
          <div className="lg:col-span-2">
            <ul className="space-y-3 text-[15px] text-white/75">
              {LINK_COLUMNS[1].map((item) => (
                <li key={item.slug}>
                  <Link to={`/category/${item.slug}`} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links — separated by a vertical divider on desktop */}
          <div className="lg:col-span-3 lg:pl-8 lg:border-l lg:border-white/20">
            <ul className="space-y-3 text-[15px] text-white/75">
              {COMPANY_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 text-xs text-white/60 text-center md:text-right">
          <p>© 1993-2026 All Rights Reserved.</p>
          <p>The Sun Malaysia is proudly owned by Sun Media Corporation Sdn Bhd. (221220-K)</p>
        </div>
      </div>
    </footer>
  )
}
