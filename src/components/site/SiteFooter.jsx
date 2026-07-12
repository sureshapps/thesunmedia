import { Link } from 'react-router-dom'

// theSun app — single AppsFlyer OneLink smart link that routes the visitor
// to the correct store (App Store / Play Store / AppGallery) automatically.
const APP_LINK = 'https://onelink.to/k5mbcg'

// Footer background now follows the KL skyline artwork (ff.png) — the
// silhouette bleeds into a solid black panel, so the footer bg must match
// the black used in that artwork exactly for the transition to be seamless.
const FOOTER_BG = '#000000'

// Two side-by-side link columns (left group in the "link cluster")
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

// Company column — rendered slightly dimmer (muted) than the other two,
// matching the reference mockups.
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
      {/* KL skyline artwork — white sky on top, solid black city silhouette on the
          bottom that's meant to fill edge-to-edge into FOOTER_BG below. The exported
          PNG has a few non-pure-black pixels right on its bottom edge, which shows up
          as a thin light seam — so a solid FOOTER_BG-colored strip is overlaid on top
          of the image's last couple of pixels to guarantee a perfectly seamless join,
          regardless of the source file. */}
      <div className="relative leading-[0]">
        <img
          src="/footer/skyline.png"
          alt=""
          aria-hidden="true"
          className="w-full h-auto block select-none pointer-events-none"
        />
        <div className="absolute bottom-0 left-0 right-0 h-2" style={{ backgroundColor: FOOTER_BG }} />
      </div>

      <div className="container mx-auto px-4 pt-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-8">

          {/* Link cluster — 3 narrow columns side-by-side even on mobile.
              Shown FIRST on mobile, but sits on the RIGHT on desktop, separated from
              the logo block by a vertical divider (matches the other two dividers below). */}
          <div className="order-1 lg:order-2 lg:col-span-7 lg:border-l lg:border-white/15 lg:pl-8">
            <div className="grid grid-cols-3 gap-3 sm:gap-6 lg:gap-x-0">
              <ul className="space-y-2.5 sm:space-y-3 text-sm lg:text-[15px] text-white/85">
                {LINK_COLUMNS[0].map((item) => (
                  <li key={item.slug}>
                    <Link to={`/category/${item.slug}`} className="hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="space-y-2.5 sm:space-y-3 text-sm lg:text-[15px] text-white/85 lg:border-l lg:border-white/15 lg:pl-8">
                {LINK_COLUMNS[1].map((item) => (
                  <li key={item.slug}>
                    <Link to={`/category/${item.slug}`} className="hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="space-y-2.5 sm:space-y-3 text-sm lg:text-[15px] text-white/45 lg:border-l lg:border-white/15 lg:pl-8">
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

        {/* Copyright */}
        <div className="mt-10 text-xs text-white/50 text-left">
          <p>© 1993-2026 All Rights Reserved.</p>
          <p>The Sun Malaysia is proudly owned by Sun Media Corporation Sdn Bhd. (221220-K)</p>
        </div>
      </div>
    </footer>
  )
}