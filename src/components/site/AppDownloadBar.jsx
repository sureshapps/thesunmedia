import { useState, useEffect } from 'react'
import { X, Star, Apple, Smartphone } from 'lucide-react'

const DOWNLOAD_URL = 'https://onelink.to/k5mbcg'
const SHOW_DELAY_MS = 30000   // bar appears 30s after the page loads
const AUTO_HIDE_MS = 60000    // bar auto-disappears at the 1-minute mark
                               // (i.e. stays visible for 30s if not closed manually)

export default function AppDownloadBar() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return
    const showTimer = setTimeout(() => setVisible(true), SHOW_DELAY_MS)
    const hideTimer = setTimeout(() => setVisible(false), AUTO_HIDE_MS)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [dismissed])

  function handleClose() {
    setVisible(false)
    setDismissed(true)
  }

  if (!visible || dismissed) return null

  return (
    <div
      className="relative bg-primary text-white"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        aria-label="Close app download reminder"
        className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-6 h-6 rounded-full border border-white/50 flex items-center justify-center text-white/90 hover:bg-white/10 transition-colors z-10"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="container mx-auto px-4 py-2.5 flex items-center gap-3">
        {/* App "icon" — theSun wordmark in a white rounded box */}
        <div className="shrink-0 bg-white rounded-xl px-3 py-2 shadow-sm leading-none">
          <span className="font-black italic text-lg sm:text-xl" style={{ color: '#005926' }}>the</span>
          <span className="font-black italic text-lg sm:text-xl" style={{ color: '#ed1c24' }}>Sun</span>
        </div>

        {/* Name, publisher, rating */}
        <div className="flex-1 min-w-0 pr-8">
          <p className="font-extrabold text-sm sm:text-lg leading-tight truncate">The Sun Malaysia</p>
          <p className="text-[10px] sm:text-xs text-white/85 leading-tight truncate">Sun Media Corporation Sdn Bhd</p>
          <div className="flex items-center gap-0.5 mt-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>

        {/* Download button */}
        <a
          href={DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 bg-white text-primary font-extrabold text-xs sm:text-sm uppercase tracking-wide rounded-lg px-3 py-2 shadow-sm hover:bg-white/90 transition-colors"
        >
          <span className="inline-flex items-center gap-0.5">
            <Apple className="h-4 w-4" />
            <Smartphone className="h-4 w-4" />
          </span>
          Download
        </a>
      </div>
    </div>
  )
}
