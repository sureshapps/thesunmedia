import { Link } from 'react-router-dom'
import SocialIcons from './SocialIcons'

// theSun app — single AppsFlyer OneLink smart link that routes the visitor
// to the correct store (App Store / Play Store / AppGallery) automatically.
const APP_LINK = 'https://onelink.to/k5mbcg'

// Footer background follows the KL skyline artwork. There are now TWO
// versions of that art — a mobile crop (skyline-mobile.png) and a wider
// desktop crop (skyline-desktop.png) — swapped at the same `md` breakpoint
// used elsewhere below. Each art file's silhouette bleeds into a solid
// black panel at a very slightly different near-black tone, so each has
// its own seam color to guarantee a perfectly seamless join into the
// footer body regardless of which asset is showing.
const FOOTER_BG = '#030307'
const FOOTER_BG_SEAM_DESKTOP = '#030307'
const FOOTER_BG_SEAM_MOBILE = '#0c0c11'

// Two side-by-side nav columns (white text) — unchanged.
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

// Company column — 3rd column in the mockups, now rendered in the brand
// red (text-primary) instead of the old dimmed/muted white.
const COMPANY_LINKS = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Advertise', to: '/advertise' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Use', to: '/terms' },
]

// Advertise / subscriptions column — new 4th column from the mockups,
// also rendered in brand red. Only "Advertise" has a real route today
// (AdvertisePage in App.jsx), so both Advertise entries point there for
// now; the rest are placeholders — swap `href`/`to` for the real
// destinations once those pages/links exist.
const ADVERTISE_LINKS = [
  { label: 'Advertise (Print Media)', to: '/advertise' },
  { label: 'Advertise (Digital Media)', to: '/advertise' },
  { label: 'Newsletter Subscriptions', to: '/' }, // TODO: point at the real newsletter signup
  { label: 'iPaper Subscriptions', href: 'https://www.thesunit.my/ipaper' },
  { label: 'Classifieds', href: 'https://www.thesunit.my/classifieds' }, // TODO: confirm real classifieds URL
]

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

      <div className="container mx-auto px-4 pt-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-8">

          {/* Link cluster — 4 narrow columns side-by-side even on mobile.
              Shown FIRST on mobile, but sits on the RIGHT on desktop, separated
              from the logo block by a vertical divider. */}
          <div className="order-1 lg:order-2 lg:col-span-7 lg:border-0 lg:border-white/15 lg:pl-8">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 lg:gap-x-0">
              <ul className="space-y-2 sm:space-y-2.5 lg:space-y-3 text-[11px] sm:text-sm lg:text-[15px] leading-snug text-white/85">
                {LINK_COLUMNS[0].map((item) => (
                  <li key={item.slug}>
                    <Link to={`/category/${item.slug}`} className="hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="space-y-2 sm:space-y-2.5 lg:space-y-3 text-[11px] sm:text-sm lg:text-[15px] leading-snug text-white/85 lg:border-0 lg:border-white/15 lg:pl-6">
                {LINK_COLUMNS[1].map((item) => (
                  <li key={item.slug}>
                    <Link to={`/category/${item.slug}`} className="hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="space-y-2 sm:space-y-2.5 lg:space-y-3 text-[11px] sm:text-sm lg:text-[15px] leading-snug text-primary lg:border-0 lg:border-white/15 lg:pl-6">
                {COMPANY_LINKS.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="space-y-2 sm:space-y-2.5 lg:space-y-3 text-[11px] sm:text-sm lg:text-[15px] leading-snug text-primary lg:border-0 lg:border-white/15 lg:pl-6">
                {ADVERTISE_LINKS.map((item) => (
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
                    ) : (
                      <Link to={item.to} className="hover:text-white transition-colors">
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Logo + tagline + app promo — shown SECOND on mobile, LEFT on desktop. */}
          <div className="order-2 lg:order-1 lg:col-span-5">
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

            <a
              href={APP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get theSun app on the App Store, Play Store or AppGallery"
              className="mt-3 flex flex-wrap gap-2 max-w-[420px] transition-opacity hover:opacity-90"
            >
              <img
                src="/footer/store-badges.png"
                alt="Download it from App Store, Get it on Play Store, Explore it AppGallery"
                className="w-full h-auto"
              />
            </a>
          </div>
        </div>

        {/* Follow Us (left) + sister-site mastheads (right) — new full-width
            row from the mockups, sitting under the main grid and above the
            copyright line. Stacks on narrow phones, sits side-by-side from
            `sm` up. Mobile gets the 2x2 sister-sites art, desktop gets the
            single-row version. */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-2.5">Follow Us</p>
            <SocialIcons size="md" />
          </div>

          <picture>
            <source media="(min-width: 768px)" srcSet="/footer/sister-sites-desktop.png" />
            <img
              src="/footer/sister-sites-mobile.png"
              alt="theSun Sports, theSun LYFE, theSun Classifieds, theSun Biz & Finance"
              className="w-40 sm:w-48 md:w-auto md:h-7 lg:h-14 h-auto opacity-80 select-none"
            />
          </picture>
        </div>

        {/* Copyright */}
        <div className="mt-10 text-xs text-white/50 text-left">
          <p>© 1993-2026 All Rights Reserved.</p>
          <p>The Sun Malaysia is proudly owned by Sun Media Corporation Sdn Bhd. (221220-K)</p>
        </div>
      </div>
    </footer>
  )
}
