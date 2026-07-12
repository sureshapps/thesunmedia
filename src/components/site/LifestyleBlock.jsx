import { useEffect, useRef } from 'react'
import useSWR from 'swr'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { postsKey, categoryBySlugKey, getFeaturedImage, getPrimaryCategory, getImageAlt, decodeHtml, stripHtml, timeAgo, asArray, FALLBACK_IMAGE } from '@/lib/wp'

const CARD_W = 304
const CARD_H = 430
const RADIUS = 650
const DRAG_SENSITIVITY = 0.15
const CLICK_THRESHOLD = 6 // px of movement below which a mouseup/touchend counts as a click, not a drag

export default function LifestyleBlock({ slug = 'lifestyle', name = 'Lifestyle' }) {
  const { data: catsRaw } = useSWR(categoryBySlugKey(slug))
  const cats = asArray(catsRaw)
  const cat = cats[0]
  const { data: postsRaw } = useSWR(
    cat ? postsKey({ categories: cat.id, per_page: 6 }) : null
  )

  const loading = !cat || !postsRaw || !Array.isArray(postsRaw)
  const basePosts = asArray(postsRaw)
  // Triple the set so the ring has enough cards to feel continuous
  const data = basePosts.length ? [...basePosts, ...basePosts, ...basePosts] : []
  const cardCount = data.length
  const displayName = decodeHtml(name || cat?.name || 'Lifestyle')

  const navigate = useNavigate()
  const viewportRef = useRef(null)
  const carouselRef = useRef(null)
  const rotationRef = useRef(0)
  const velocityRef = useRef(0)
  const draggingRef = useRef(false)
  const lastXRef = useRef(0)
  const dragDistanceRef = useRef(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!cardCount) return undefined

    const viewport = viewportRef.current
    const carousel = carouselRef.current
    if (!viewport || !carousel) return undefined

    const animate = () => {
      if (!draggingRef.current) {
        rotationRef.current += velocityRef.current
        velocityRef.current *= 0.95
        if (Math.abs(velocityRef.current) < 0.01) {
          rotationRef.current -= 0.05
        }
      }
      carousel.style.transform = `translate(-50%, -50%) rotateY(${rotationRef.current}deg)`
      rafRef.current = requestAnimationFrame(animate)
    }

    const getX = (e) => e.pageX ?? (e.touches ? e.touches[0].pageX : 0)

    const onStart = (e) => {
      draggingRef.current = true
      lastXRef.current = getX(e)
      dragDistanceRef.current = 0
      velocityRef.current = 0
    }

    const onMove = (e) => {
      if (!draggingRef.current) return
      if (e.touches) e.preventDefault()
      const x = getX(e)
      const deltaX = x - lastXRef.current
      rotationRef.current += deltaX * DRAG_SENSITIVITY
      velocityRef.current = deltaX * DRAG_SENSITIVITY
      dragDistanceRef.current += Math.abs(deltaX)
      lastXRef.current = x
    }

    const onEnd = () => {
      draggingRef.current = false
    }

    const onWheel = (e) => {
      velocityRef.current += e.deltaY * 0.01
    }

    viewport.addEventListener('mousedown', onStart)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onEnd)
    viewport.addEventListener('touchstart', onStart, { passive: false })
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onEnd)
    viewport.addEventListener('wheel', onWheel, { passive: true })

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      viewport.removeEventListener('mousedown', onStart)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onEnd)
      viewport.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
      viewport.removeEventListener('wheel', onWheel)
    }
  }, [cardCount])

  const handleCardClick = (postSlug) => {
    if (dragDistanceRef.current > CLICK_THRESHOLD) return
    navigate(`/article/${postSlug}`)
  }

  if (!cat) return null

  return (
    <section className="py-6">
      <div className="flex items-center justify-between border-b-2 border-primary pb-2 mb-5">
        <h2 className="font-serif-headline text-2xl font-bold flex items-center gap-2">
          <span className="w-1 h-7 bg-primary inline-block" />
          {displayName}
        </h2>
        <Link to={`/category/${cat.slug}`} className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {loading && (
        <div className="w-full h-[420px] rounded-2xl skeleton-shimmer" />
      )}

      {!loading && cardCount > 0 && (
        <>
          <style>{`
            .lsc-viewport {
              width: 100%;
              height: 65vh;
              min-height: 460px;
              max-height: 560px;
              display: flex;
              justify-content: center;
              align-items: center;
              perspective: 1000px;
              perspective-origin: 50% 50%;
              cursor: grab;
              position: relative;
              overflow: hidden;
            }
            .lsc-viewport:active { cursor: grabbing; }
            .lsc-carousel {
              position: absolute;
              top: 50%;
              left: 50%;
              width: ${CARD_W}px;
              transform-style: preserve-3d;
              will-change: transform;
            }
            .lsc-card {
              position: absolute;
              width: ${CARD_W}px;
              height: ${CARD_H}px;
              background: #fff;
              border-radius: 28px;
              padding: 24px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.08);
              border: 1px solid rgba(0,0,0,0.04);
              backface-visibility: hidden;
              display: flex;
              flex-direction: column;
              left: 50%;
              top: 50%;
              margin-left: -${CARD_W / 2}px;
              margin-top: -${CARD_H / 2}px;
              cursor: pointer;
              user-select: none;
              overflow: hidden;
            }
            .lsc-card img {
              width: 100%;
              aspect-ratio: 4/3;
              border-radius: 20px;
              margin-bottom: 20px;
              object-fit: cover;
              pointer-events: none;
            }
            .lsc-card-meta {
              font-size: 12px;
              line-height: 16px;
              font-weight: 700;
              color: #aaa;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              text-transform: uppercase;
              letter-spacing: 0.02em;
            }
            .lsc-card-dot {
              width: 6px;
              height: 6px;
              background: hsl(var(--primary));
              border-radius: 50%;
              margin-right: 6px;
              flex-shrink: 0;
            }
            .lsc-card h3 {
              font-size: 20px;
              line-height: 28px;
              font-weight: 700;
              color: #111;
              margin-bottom: 20px;
              text-align: left;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              font-family: inherit;
            }
            .lsc-card p {
              font-size: 14px;
              line-height: 20px;
              color: #666;
              text-align: left;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            @media (max-width: 768px) {
              .lsc-viewport { height: 60vh; min-height: 420px; }
            }
          `}</style>

          <div className="lsc-viewport" ref={viewportRef}>
            <div className="lsc-carousel" ref={carouselRef}>
              {data.map((post, i) => {
                const angle = (i * 360) / cardCount
                const catName = getPrimaryCategory(post)?.name || displayName
                return (
                  <div
                    key={`${post.id}-${i}`}
                    className="lsc-card"
                    style={{ transform: `rotateY(${angle}deg) translateZ(${RADIUS}px) rotateY(180deg)` }}
                    onClick={() => handleCardClick(post.slug)}
                  >
                    <img
                      src={getFeaturedImage(post) || FALLBACK_IMAGE}
                      alt={getImageAlt(post)}
                      loading="lazy"
                      draggable={false}
                    />
                    <div className="lsc-card-meta">
                      <span className="lsc-card-dot" />
                      {catName.toUpperCase()} • {timeAgo(post.date)}
                    </div>
                    <h3>{decodeHtml(post.title?.rendered || '')}</h3>
                    <p>{stripHtml(post.excerpt?.rendered, 120)}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
