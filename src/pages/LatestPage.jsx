import { useEffect, useRef, useState, useCallback } from 'react'
import { Newspaper, Loader2 } from 'lucide-react'
import { FeatureCard, FeatureCardSkeleton } from '@/components/site/NewsCard'
import Sidebar from '@/components/site/Sidebar'
import { buildUrl, asArray } from '@/lib/wp'
import useSeo from '@/lib/useSeo'

export default function LatestPage() {
  useSeo({ title: 'Latest News', description: 'Latest news from theSun, Malaysia.', url: window.location.origin + '/latest' })

  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef(null)

  const loadPage = useCallback(async (p) => {
    setLoading(true)
    try {
      const url = buildUrl('/posts', { per_page: 12, page: p, _embed: 1 })
      const res = await fetch(url)
      if (!res.ok) { setHasMore(false); return }
      const raw = await res.json()
      const data = asArray(raw)
      const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '0', 10)
      setPosts(prev => p === 1 ? data : [...prev, ...data])
      if (p >= Math.min(totalPages, 50) || data.length === 0) setHasMore(false)
    } catch (e) { setHasMore(false) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadPage(1) }, [loadPage])

  // Infinite scroll
  useEffect(() => {
    if (!hasMore) return
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        setPage(prev => {
          const next = prev + 1
          loadPage(next)
          return next
        })
      }
    }, { rootMargin: '300px' })
    if (sentinelRef.current) obs.observe(sentinelRef.current)
    return () => obs.disconnect()
  }, [hasMore, loading, loadPage])

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="border-b-2 border-primary pb-4 mb-8">
        <div className="flex items-center gap-3">
          <Newspaper className="h-7 w-7 text-primary" />
          <h1 className="font-serif-headline text-3xl md:text-4xl font-bold">Latest News</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.map(p => <FeatureCard key={p.id} post={p} />)}
            {loading && posts.length === 0 && [...Array(6)].map((_, i) => <FeatureCardSkeleton key={i} />)}
          </div>

          <div ref={sentinelRef} className="py-10 text-center text-sm text-muted-foreground">
            {loading && <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading more…</span>}
            {!hasMore && posts.length > 0 && <span>You've reached the end.</span>}
          </div>
        </div>

        <Sidebar />
      </div>
    </div>
  )
}