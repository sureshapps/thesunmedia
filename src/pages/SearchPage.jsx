import useSWR from 'swr'
import { Link, useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { FeatureCard, FeatureCardSkeleton } from '@/components/site/NewsCard'
import Sidebar from '@/components/site/Sidebar'
import { Button } from '@/components/ui/button'
import { buildUrl } from '@/lib/wp'
import useSeo from '@/lib/useSeo'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const q = (searchParams.get('q') || '').trim()
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const perPage = 12

  const url = q ? buildUrl('/posts', { search: q, per_page: perPage, page, _embed: 1 }) : null

  const { data, isLoading } = useSWR(url, async (u) => {
    const res = await fetch(u)
    if (!res.ok) throw new Error('Failed')
    const posts = await res.json()
    return {
      posts,
      total: parseInt(res.headers.get('x-wp-total') || '0', 10),
      totalPages: parseInt(res.headers.get('x-wp-totalpages') || '0', 10),
    }
  })

  const posts = data?.posts || []
  const total = data?.total || 0
  const totalPages = data?.totalPages || 0

  useSeo({
    title: q ? `Search: ${q}` : 'Search',
    description: q ? `Search results for "${q}" on theSun.` : 'Search the latest news on theSun.',
    url: window.location.origin + `/search?q=${encodeURIComponent(q)}`,
  })

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="border-b-2 border-primary pb-4 mb-8">
        <div className="flex items-center gap-3">
          <SearchIcon className="h-7 w-7 text-primary" />
          <h1 className="font-serif-headline text-3xl md:text-4xl font-bold">
            {q ? <>Results for <span className="text-primary">"{q}"</span></> : 'Search'}
          </h1>
        </div>
        {q && <p className="mt-2 text-sm text-muted-foreground">{total.toLocaleString()} articles found</p>}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {!q && (
            <div className="text-center py-16 text-muted-foreground">
              <SearchIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>Use the search bar above to look up news, topics, or authors.</p>
            </div>
          )}
          {q && isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => <FeatureCardSkeleton key={i} />)}
            </div>
          )}
          {q && !isLoading && posts.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">No articles match your search. Try different keywords.</div>
          )}
          {!isLoading && posts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map(p => <FeatureCard key={p.id} post={p} />)}
            </div>
          )}

          {q && posts.length > 0 && (
            <div className="flex items-center justify-between pt-8 mt-6 border-t border-border">
              <Button asChild variant="outline" className={page <= 1 ? 'pointer-events-none opacity-50' : ''}>
                <Link to={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}><ChevronLeft className="h-4 w-4 mr-1" /> Previous</Link>
              </Button>
              <span className="text-sm text-muted-foreground">Page {page}{totalPages ? ` of ${Math.min(totalPages, 50)}` : ''}</span>
              <Button asChild variant="outline" className={(totalPages && page >= totalPages) ? 'pointer-events-none opacity-50' : ''}>
                <Link to={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}>Next <ChevronRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </div>
          )}
        </div>

        <Sidebar />
      </div>
    </div>
  )
}
