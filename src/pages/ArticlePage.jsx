import useSWR from 'swr'
import { Link, useParams } from 'react-router-dom'
import { Clock, User, Tag as TagIcon, Facebook, Twitter, Linkedin, MessageCircle, ChevronRight } from 'lucide-react'
import Sidebar from '@/components/site/Sidebar'
import { FeatureCard, FeatureCardSkeleton } from '@/components/site/NewsCard'
import useSeo from '@/lib/useSeo'
import {
  postBySlugKey, postsKey, getFeaturedImage, getLargeImage, getImageAlt,
  getPrimaryCategory, getTags, getAuthor, decodeHtml, formatDateTime, stripHtml,
  LOGO_URL,
} from '@/lib/wp'

export default function ArticlePage() {
  const { slug } = useParams()
  const { data: posts, isLoading, error } = useSWR(postBySlugKey(slug))
  const post = posts && posts[0]

  const catIds = (post?.categories || []).slice(0, 2).join(',')
  const { data: related } = useSWR(
    post ? postsKey({ per_page: 4, categories: catIds, exclude: post.id }) : null
  )

  const title = decodeHtml(post?.title?.rendered || '')
  const description = stripHtml(post?.excerpt?.rendered, 200)
  const heroImg = post ? getLargeImage(post) : null
  const cat = post ? getPrimaryCategory(post) : null
  const tags = post ? getTags(post) : []
  const author = post ? getAuthor(post) : null

  const url = window.location.origin + `/article/${slug}`
  const jsonLd = post ? {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    image: heroImg ? [heroImg] : [],
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: [{ '@type': 'Person', name: author?.name }],
    publisher: { '@type': 'Organization', name: 'theSun', logo: { '@type': 'ImageObject', url: LOGO_URL } },
    description,
  } : null

  useSeo({ title: title || 'Article', description, image: heroImg, type: 'article', url, jsonLd })

  if (isLoading) return <ArticleSkeleton />
  if (error || !post) return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="font-serif-headline text-3xl font-bold mb-2">Article not found</h1>
      <p className="text-muted-foreground mb-4">The article you're looking for doesn't exist or has been removed.</p>
      <Link to="/" className="text-primary font-semibold hover:underline">← Back to home</Link>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        {cat && <><Link to={`/category/${cat.slug}`} className="hover:text-primary">{cat.name}</Link><ChevronRight className="h-3 w-3" /></>}
        <span className="text-foreground line-clamp-1">{title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <article className="lg:col-span-2">
          {cat && (
            <Link to={`/category/${cat.slug}`} className="inline-block bg-primary text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">{cat.name}</Link>
          )}
          <h1 className="font-serif-headline text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">{title}</h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground border-y border-border py-3 mb-6">
            {author && <div className="flex items-center gap-1.5"><User className="h-4 w-4" /><span className="font-medium text-foreground">{author.name}</span></div>}
            <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /><span>{formatDateTime(post.date)}</span></div>
            {post.post_views_count != null && <div className="text-xs">{Number(post.post_views_count).toLocaleString()} views</div>}
          </div>

          {heroImg && (
            <figure className="mb-6">
              <img src={heroImg} alt={getImageAlt(post)} className="w-full h-auto rounded-lg" />
            </figure>
          )}

          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">Share:</span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90"><Facebook className="h-4 w-4" /></a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90"><Twitter className="h-4 w-4" /></a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-90"><Linkedin className="h-4 w-4" /></a>
            <a href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90"><MessageCircle className="h-4 w-4" /></a>
          </div>

          <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content?.rendered || '' }} />

          {tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex flex-wrap items-center gap-2">
                <TagIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold mr-2">Tags:</span>
                {tags.map(t => (
                  <Link key={t.id} to={`/search?q=${encodeURIComponent(t.name)}`} className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-primary hover:text-white transition">#{t.name}</Link>
                ))}
              </div>
            </div>
          )}

          {(related && related.length > 0) && (
            <section className="mt-10 pt-8 border-t border-border">
              <h2 className="font-serif-headline text-2xl font-bold border-b-2 border-primary pb-2 mb-5 flex items-center gap-2">
                <span className="w-1 h-7 bg-primary inline-block" /> Related Articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map(p => <FeatureCard key={p.id} post={p} />)}
              </div>
            </section>
          )}
        </article>

        <Sidebar excludeId={post.id} />
      </div>
    </div>
  )
}

function ArticleSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 w-24 skeleton-shimmer rounded" />
          <div className="h-12 w-full skeleton-shimmer rounded" />
          <div className="h-12 w-3/4 skeleton-shimmer rounded" />
          <div className="h-4 w-1/2 skeleton-shimmer rounded" />
          <div className="aspect-[16/9] w-full skeleton-shimmer rounded-lg" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 w-full skeleton-shimmer rounded" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 w-full skeleton-shimmer rounded" />)}
        </div>
      </div>
    </div>
  )
}
