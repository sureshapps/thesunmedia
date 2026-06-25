import useSWR from 'swr'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { HeroCard, FeatureCard, FeatureCardSkeleton } from '@/components/site/NewsCard'
import Sidebar from '@/components/site/Sidebar'
import { Button } from '@/components/ui/button'
import { categoryBySlugKey, buildUrl, decodeHtml, stripHtml } from '@/lib/wp'
import useSeo from '@/lib/useSeo'

function usePostsWithHeaders(url) {
  // Custom fetcher that returns data + headers
  const { data, error, isLoading } = useSWR(url, async (u) => {
    const res = await fetch(u)
    if (!res.ok) throw new Error('Failed')
    const json = await res.json()
    return {
      posts: json,
      total: parseInt(res.headers.get('x-wp-total') || '0', 10),
      totalPages: parseInt(res.headers.get('x-wp-totalpages') || '0', 10),
    }
  })
  return { data, error, isLoading }
}

export default function CategoryPage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const perPage = 12

  const { data: cats } = useSWR(categoryBySlugKey(slug))
  const cat = cats && cats[0]

  const postsUrl = cat ? buildUrl('/posts', { categories: cat.id, per_page: perPage, page, _embed: 1 }) : null
  const { data: pageData, isLoading } = usePostsWithHeaders(postsUrl)
  const posts = pageData?.posts || []
  const totalPages = pageData?.totalPages || 0

  useSeo({
    title: cat ? `${decodeHtml(cat.name)} News` : 'Category',
    description: cat ? stripHtml(cat.description || `Latest ${decodeHtml(cat.name)} news on theSun.`, 200) : '',
    url: window.location.origin + `/category/${slug}`,
  })

  if (!cat && cats !== undefined) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-serif-headline text-3xl font-bold mb-2">Category not found</h1>
        <Link to="/" className="text-primary font-semibold hover:underline">← Back to home</Link>
      </div>
    )
  }

  const lead = page === 1 ? posts[0] : null
  const rest = page === 1 ? posts.slice(1) : posts

  return (
    <div className="container mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{cat ? decodeHtml(cat.name) : 'Loading...'}</span>
      </nav>

      <header className="border-b-2 border-primary pb-4 mb-8">
        <div className="flex items-baseline gap-3">
          <span className="w-1.5 h-9 bg-primary inline-block" />
          <h1 className="font-serif-headline text-4xl md:text-5xl font-bold">{cat ? decodeHtml(cat.name) : ' '}</h1>
        </div>
        {cat?.description && <p className="mt-3 text-muted-foreground max-w-3xl">{stripHtml(cat.description, 240)}</p>}
        {cat && <p className="text-xs text-muted-foreground mt-2">{cat.count?.toLocaleString()} articles · Page {page}{totalPages ? ` of ${Math.min(totalPages, 100)}` : ''}</p>}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(8)].map((_, i) => <FeatureCardSkeleton key={i} />)}
            </div>
          )}
          {!isLoading && posts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No articles found.</div>
          )}
          {lead && <HeroCard post={lead} />}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {rest.map(p => <FeatureCard key={p.id} post={p} />)}
            </div>
          )}

          {posts.length > 0 && (
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <Button asChild variant="outline" className={page <= 1 ? 'pointer-events-none opacity-50' : ''}>
                <Link to={`/category/${slug}?page=${page - 1}`}><ChevronLeft className="h-4 w-4 mr-1" /> Previous</Link>
              </Button>
              <span className="text-sm text-muted-foreground">Page {page}{totalPages ? ` of ${Math.min(totalPages, 100)}` : ''}</span>
              <Button asChild variant="outline" className={(totalPages && page >= totalPages) ? 'pointer-events-none opacity-50' : ''}>
                <Link to={`/category/${slug}?page=${page + 1}`}>Next <ChevronRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </div>
          )}
        </div>

        <Sidebar />
      </div>
    </div>
  )
}
