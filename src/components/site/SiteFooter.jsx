import { Link } from 'react-router-dom'
import Logo from './Logo'
import SocialIcons from './SocialIcons'

const APP_BADGES = [
  {
    name: 'App Store',
    href: 'https://itunes.apple.com/my/app/the-sun-daily-epaper/id1440139272',
    img: 'https://customer-assets.emergentagent.com/job_headless-newsroom/artifacts/ohyk04tp_Apple-strore-Logo.png',
  },
  {
    name: 'Google Play',
    href: 'https://play.google.com/store/apps/details?id=my.thesundaily.android',
    img: 'https://customer-assets.emergentagent.com/job_headless-newsroom/artifacts/7359gfbr_Google-Playstore-logo.png',
  },
  {
    name: 'Huawei AppGallery',
    href: 'https://appgallery7.huawei.com/#/app/C101189379',
    img: 'https://customer-assets.emergentagent.com/job_headless-newsroom/artifacts/fhivby7m_Huawei-Gallery-logo.png',
  },
]

const FOOTER_BG = '#111111'

export default function SiteFooter() {
  return (
    <footer className="text-white mt-16" style={{ backgroundColor: FOOTER_BG }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white inline-block p-2 rounded">
              <Logo size="lg" />
            </div>
            <p className="mt-4 text-base text-white/80 font-semibold">
              Independent Malaysian journalism.
            </p>

            {/* App store badges */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {APP_BADGES.map((b) => (
                <a
                  key={b.name}
                  href={b.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Download from ${b.name}`}
                  className="block transition-transform hover:scale-105"
                >
                  <img
                    src={b.img}
                    alt={b.name}
                    className="h-10 sm:h-11 md:h-12 w-auto rounded-md"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>

            <div className="mt-5">
              <SocialIcons />
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase text-sm tracking-wider mb-4 text-white">Sections</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/category/malaysia-news" className="hover:text-primary">Malaysia</Link></li>
              <li><Link to="/category/business" className="hover:text-primary">Business</Link></li>
              <li><Link to="/category/world" className="hover:text-primary">World</Link></li>
              <li><Link to="/category/sports" className="hover:text-primary">Sports</Link></li>
              <li><Link to="/category/lifestyle" className="hover:text-primary">Lifestyle</Link></li>
              <li><Link to="/category/entertainment" className="hover:text-primary">Entertainment</Link></li>
              <li><Link to="/category/opinion" className="hover:text-primary">Opinion</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase text-sm tracking-wider mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link to="/advertise" className="hover:text-primary">Advertise</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary">Terms of Use</Link></li>
              <li><Link to="/disclaimer" className="hover:text-primary">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/20 text-xs text-white/60 text-center md:text-left">
          <p>© 1993-2026 All Rights Reserved. The Sun Malaysia is proudly owned by Sun Media Corporation Sdn Bhd. (221220-K)</p>
        </div>
      </div>
    </footer>
  )
}