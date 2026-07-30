import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import useSWR from 'swr'
import { ChevronLeft, ChevronRight, Hash } from 'lucide-react'
import { HorizontalCard, HorizontalCardSkeleton } from '@/components/site/NewsCard'
import { buildUrl, tagsKey, asArray, decodeHtml } from '@/lib/wp'
import useSeo from '@/lib/useSeo'

const PER_PAGE = 10

export default function TagPage() {
  const { slug } = useParams()
  const [page, setPage] = useState(1)

  // Resolve the tag itself (need its numeric id to filter /posts, and its
  // display name for the heading + SEO title).
  const { data: tagData, isLoading: tagLoading } = useSWR(tagsKey({ slug }))
  const tag = asArray(tagData)[0] || null
  const tagName = tag ? decodeHtml(tag.name) : slug

  // Only fetch posts once we know the tag's id.
  const postsUrl = tag
    ? buildUrl('/posts', { tags: tag.id, per_page: PER_PAGE, page, _embed: 1 })
    : null
  const { data: posts, isLoading: postsLoading } = useSWR(postsUrl)
  const postsArr = asArray(posts)

  useSeo({
    title: tag ? `#${tagName}` : `#${slug}`,
    description: tag ? `Latest stories tagged #${tagName}.` : `Latest stories tagged #${slug}.`,
    url: window.location.href,
  })

  const loading = tagLoading || postsLoading
  const notFound = !tagLoading && !tag

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-serif-headline text-3xl font-bold mb-3">Tag not found</h1>
        <p className="text-muted-foreground mb-6">There's nothing tagged #{slug} right now.</p>
        <Link to="/" className="text-primary font-semibold hover:underline">Back to home</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
        <Hash className="h-6 w-6 text-primary shrink-0" strokeWidth={3} />
        <h1 className="font-serif-headline text-2xl sm:text-3xl font-extrabold">
          {tagLoading ? 'Loading…' : tagName}
        </h1>
      </div>

      <div className="max-w-3xl mx-auto divide-y divide-border">
        {loading
          ? [...Array(PER_PAGE)].map((_, i) => <HorizontalCardSkeleton key={i} />)
          : postsArr.length === 0
            ? <p className="text-muted-foreground py-10 text-center">No stories found for this tag.</p>
            : postsArr.map(p => <HorizontalCard key={p.id} post={p} />)}
      </div>

      {!loading && postsArr.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous"
            className="w-9 h-9 flex items-center justify-center border border-border rounded hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-muted-foreground px-2">Page {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={postsArr.length < PER_PAGE}
            aria-label="Next"
            className="w-9 h-9 flex items-center justify-center border border-border rounded hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
