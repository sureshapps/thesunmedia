// Minimal service worker for theSun PWA.
// Goal: satisfy installability requirements (Chrome/Android need an active SW
// with a fetch handler to fire `beforeinstallprompt`) and provide just enough
// offline app-shell support to survive a dropped connection — without ever
// caching the WordPress REST API responses, so news content always stays fresh.

const CACHE_NAME = 'thesun-shell-v1'
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Never intercept API calls (thesun.my WP REST, open-meteo, etc.) — always go to network.
  if (url.origin !== self.location.origin) return

  // App-shell navigations: network-first, fall back to cached shell when offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    )
    return
  }

  // Static same-origin assets (JS/CSS/images/icons): cache-first, then network.
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((res) => {
      if (res.ok) {
        const clone = res.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
      }
      return res
    }).catch(() => cached))
  )
})
