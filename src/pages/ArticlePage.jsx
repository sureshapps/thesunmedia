import useSWR from 'swr'
import { Link, useParams } from 'react-router-dom'
import { Clock, User, Tag as TagIcon, Facebook, Linkedin, Mail, ChevronRight } from 'lucide-react'
import Sidebar from '@/components/site/Sidebar'
import { FeatureCard, FeatureCardSkeleton } from '@/components/site/NewsCard'
import StayCurrentBanner from '@/components/site/StayCurrentBanner'
import useSeo from '@/lib/useSeo'
import {
  postBySlugKey, postsKey, getFeaturedImage, getLargeImage, getImageAlt,
  getPrimaryCategory, getTags, getAuthor, decodeHtml, formatDateTime, stripHtml,
  LOGO_URL,
} from '@/lib/wp'

// Brand icons not covered by lucide-react — kept minimal/monochrome (currentColor)
// so they inherit the white icon color used inside each share button.
function XSvg(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function WhatsAppSvg(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5c1.5.8 3.3 1.3 5.2 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
    </svg>
  )
}

function ThreadsSvg(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.7 11.37c-.1-.05-.2-.1-.3-.14-.18-2.87-1.75-4.51-4.36-4.53h-.04c-1.53 0-2.8.65-3.6 1.85l1.44.99c.6-.9 1.53-1.09 2.16-1.09h.03c.79.01 1.38.23 1.76.66.28.31.46.74.55 1.28-.69-.12-1.43-.15-2.22-.11-2.24.12-3.68 1.4-3.58 3.19.05.91.51 1.69 1.29 2.2.66.43 1.51.64 2.39.59 1.16-.06 2.07-.51 2.71-1.32.49-.62.8-1.42.93-2.42.56.34 .97.78 1.2 1.32.39.91.41 2.41-.81 3.63-1.07 1.06-2.35 1.52-4.29 1.53-2.15-.02-3.78-.7-4.84-2.03-.99-1.24-1.5-3.03-1.52-5.32.02-2.29.53-4.08 1.52-5.32 1.06-1.33 2.69-2.01 4.84-2.03 2.17.02 3.83.71 4.93 2.05.54.66.95 1.48 1.22 2.43l1.68-.45c-.33-1.2-.86-2.24-1.58-3.11C15.53 3.98 13.44 3.02 10.72 3h-.02c-2.71.02-4.78.98-6.16 2.85C3.31 7.5 2.68 9.79 2.66 12.5v.03c.02 2.71.65 5 1.88 6.65 1.38 1.87 3.45 2.83 6.16 2.85h.02c2.36-.02 4.02-.6 5.4-1.97 1.8-1.78 1.75-4.01 1.15-5.38-.43-.98-1.24-1.77-2.33-2.31zm-3.85 3.79c-.97.05-1.98-.4-2.03-1.37-.04-.72.51-1.52 2.09-1.61.18-.01.36-.02.53-.02.57 0 1.1.06 1.59.17-.18 2.25-1.24 2.77-2.18 2.83z" />
    </svg>
  )
}

function TelegramSvg(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.5 2.5L2.5 10.2c-.9.3-.9 1.4 0 1.7l4.9 1.5 1.9 5.9c.2.7 1.1.9 1.6.3l2.5-2.8 4.6 3.4c.7.5 1.7.1 1.8-.7l2.6-15.4c.2-1-.7-1.8-1.6-1.4zM10 14.8l-.5 4 1.4-3.6 7.4-7-8.3 6.6z" />
    </svg>
  )
}

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

          <div className="flex items-center flex-wrap gap-2 mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">Share:</span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90"><Facebook className="h-4 w-4" /></a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90"><XSvg className="h-4 w-4" /></a>
            <a href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90"><WhatsAppSvg className="h-4 w-4" /></a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-90"><Linkedin className="h-4 w-4" /></a>
            <a href={`https://www.threads.net/intent/post?text=${encodeURIComponent(title + ' ' + url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Threads" className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90"><ThreadsSvg className="h-4 w-4" /></a>
            <a href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Telegram" className="w-8 h-8 rounded-full bg-[#26A5E4] text-white flex items-center justify-center hover:opacity-90"><TelegramSvg className="h-4 w-4" /></a>
            <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`} aria-label="Share via Email" className="w-8 h-8 rounded-full bg-muted-foreground text-white flex items-center justify-center hover:opacity-90"><Mail className="h-4 w-4" /></a>
          </div>

          <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content?.rendered || '' }} />

          <StayCurrentBanner />

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
