import { useEffect } from 'react'

// Simple DOM-based SEO hook for an SPA. Updates title + meta tags on mount
// and resets them on unmount where appropriate.
export default function useSeo({
  title,
  description,
  image,
  type = 'website',
  url,
  jsonLd,
} = {}) {
  useEffect(() => {
    const prevTitle = document.title
    if (title) document.title = title.includes('theSun') ? title : `${title} | theSun`

    const tagsCreated = []

    function setMeta(attr, name, content) {
      if (!content) return
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
        tagsCreated.push(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:image', image)
    setMeta('property', 'og:url', url || window.location.href)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', image)

    // canonical link
    let canonical = document.querySelector('link[rel="canonical"]')
    let canonicalCreated = false
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
      canonicalCreated = true
    }
    canonical.setAttribute('href', url || window.location.href)

    // JSON-LD structured data
    let ldScript = null
    if (jsonLd) {
      ldScript = document.createElement('script')
      ldScript.setAttribute('type', 'application/ld+json')
      ldScript.setAttribute('data-seo', '1')
      ldScript.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(ldScript)
    }

    return () => {
      document.title = prevTitle
      tagsCreated.forEach(el => el.remove())
      if (canonicalCreated && canonical) canonical.remove()
      if (ldScript) ldScript.remove()
    }
  }, [title, description, image, type, url, JSON.stringify(jsonLd)])
}
