import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import {
  postsKey, categoryBySlugKey,
  getThumbnail, getImageAlt, getAuthor, decodeHtml, stripHtml, timeAgo, asArray, FALLBACK_IMAGE,
} from '@/lib/wp'

const ITEM_COUNT = 4 // one row per section on desktop

function NewsCard({ post }) {
  const author = getAuthor(post)
  const commentCount = post.comment_count ?? post.comments_count ?? null

  return (
    <Link
      to={`/article/${post.slug}`}
      className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-border/60 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={getThumbnail(post) || FALLBACK_IMAGE}
          alt={getImageAlt(post)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 flex flex-col p-4">
        <h3 className="font-bold text-base leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-3 mb-1.5">
          {decodeHtml(post.title?.rendered || '')}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {stripHtml(post.excerpt?.rendered || '', 110)}
        </p>
        <div className="text-xs text-muted-foreground space-y-0.5 mt-auto">
          {author?.name && author.name !== 'theSun' && (
            <p className="font-semibold text-foreground/80">{author.name}</p>
          )}
          <p className="flex items-center gap-1.5">
            <span>{timeAgo(post.date)}</span>
            {commentCount !== null && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {commentCount}
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </Link>
  )
}

function NewsCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border border-border/60 shadow-sm">
      <div className="aspect-[4/3] skeleton-shimmer" />
      <div className="flex-1 p-4">
        <div className="h-4 w-full skeleton-shimmer rounded mb-1.5" />
        <div className="h-4 w-2/3 skeleton-shimmer rounded mb-3" />
        <div className="h-3 w-full skeleton-shimmer rounded mb-1" />
        <div className="h-3 w-3/4 skeleton-shimmer rounded mb-3" />
        <div className="h-2.5 w-16 skeleton-shimmer rounded mb-1" />
        <div className="h-2.5 w-20 skeleton-shimmer rounded" />
      </div>
    </div>
  )
}

// One label + rule + "view all" unit, reused for both NEWS and BERITA in the
// shared header row.
function SectionHeaderPiece({ slug, label }) {
  return (
    <>
      <span className="bg-primary text-white font-extrabold uppercase tracking-wide text-lg sm:text-xl rounded-lg px-5 py-2.5 shrink-0">
        {label}
      </span>
      <span className="flex-1 h-[2px] bg-primary min-w-[24px]" />
      <Link
        to={`/category/${slug}`}
        className="shrink-0 border border-primary text-primary font-bold text-xs sm:text-sm uppercase tracking-wide rounded-md px-3 py-1.5 hover:bg-primary hover:text-white transition-colors"
      >
        view all
      </Link>
    </>
  )
}

function useCategoryPosts(slug) {
  const { data: catsRaw } = useSWR(categoryBySlugKey(slug))
  const cats = asArray(catsRaw)
  const cat = cats[0]
  const { data: postsRaw } = useSWR(cat ? postsKey({ categories: cat.id, per_page: ITEM_COUNT }) : null)
  const posts = asArray(postsRaw)
  const loading = !cat || !postsRaw
  return { posts, loading }
}

// Two sections — News and Berita — sharing one header row (each with its own
// label + rule + "view all"), followed by their own 4-card row each.
export default function NewsBeritaBlock() {
  const news = useCategoryPosts('news')
  const berita = useCategoryPosts('berita')

  return (
    <section>
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <SectionHeaderPiece slug="news" label="News" />
        <SectionHeaderPiece slug="berita" label="Berita" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 mb-5 sm:mb-6">
        {news.loading
          ? [...Array(ITEM_COUNT)].map((_, i) => <NewsCardSkeleton key={i} />)
          : news.posts.slice(0, ITEM_COUNT).map((p) => <NewsCard key={p.id} post={p} />)}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6">
        {berita.loading
          ? [...Array(ITEM_COUNT)].map((_, i) => <NewsCardSkeleton key={i} />)
          : berita.posts.slice(0, ITEM_COUNT).map((p) => <NewsCard key={p.id} post={p} />)}
      </div>
    </section>
  )
}
