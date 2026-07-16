import appBanner from '@/assets/app-promo-banner.webp'

// Update this href to wherever the app download / smart-link page should point.
const APP_DOWNLOAD_URL = 'https://onelink.to/k5mbcg'

export default function AppPromoBanner() {
  return (
    <a
      href={APP_DOWNLOAD_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-2xl overflow-hidden shadow-md border border-border/60"
    >
      <img
        src={appBanner}
        alt="theSun app — News that matters. Now even better. Download the updated theSun app."
        className="w-full h-auto object-cover"
        loading="lazy"
      />
    </a>
  )
}
