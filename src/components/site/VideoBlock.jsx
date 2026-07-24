import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { useLatestVideos, formatViews, timeAgo } from '@/lib/youtube'
import sunVideoLogo from '@/assets/sun-video-logo.svg'

// Optional mascot image. Drop a file at /public/images/video-robot.png to show it —
// if it's missing the <img> just quietly disappears instead of breaking the layout.
const ROBOT_SRC = '/images/video-robot.png'

const UP_NEXT_COUNT = 5

function formatPublishedAt(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    const day = d.getDate()
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    return `${month} ${day} ${time}`
  } catch {
    return ''
  }
}

function PlayButton({ size = 48 }) {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 border border-white/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      style={{ width: size, height: size }}
    >
      <Play className="text-white fill-white" style={{ width: size * 0.4, height: size * 0.4 }} />
    </div>
  )
}

function VideoThumb({ video, playing, onPlay, large = false }) {
  if (playing) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-neutral-700/60 shadow-lg">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }
  return (
    <button
      onClick={onPlay}
      className="group relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-neutral-700/60 hover:border-neutral-500 transition-colors shadow-lg"
    >
      <img src={video.thumb} alt="" loading="lazy" className="w-full h-full object-cover" />
      <span className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-full border border-white/10">
        {video.duration}
      </span>
      <PlayButton size={large ? 60 : 44} />
    </button>
  )
}

function UpNextItem({ video, onPlay }) {
  return (
    <button onClick={onPlay} className="group w-full flex items-start gap-3 text-left">
      <span className="flex-1 text-neutral-100 text-sm font-semibold leading-snug line-clamp-3 group-hover:text-primary transition-colors">
        {video.title}
      </span>
      <div className="relative w-24 h-16 sm:w-28 sm:h-[4.5rem] shrink-0 rounded-lg overflow-hidden">
        <img src={video.thumb} alt="" loading="lazy" className="w-full h-full object-cover" />
        <span className="absolute bottom-1 right-1 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white/10">
          {video.duration}
        </span>
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
          <Play className="w-5 h-5 text-white fill-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </button>
  )
}

function UpNextSkeleton() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 space-y-2 pt-0.5">
        <div className="h-3.5 w-full bg-neutral-800 rounded animate-pulse" />
        <div className="h-3.5 w-4/5 bg-neutral-800 rounded animate-pulse" />
      </div>
      <div className="w-24 h-16 sm:w-28 sm:h-[4.5rem] shrink-0 rounded-lg bg-neutral-800 animate-pulse" />
    </div>
  )
}

export default function VideoBlock() {
  const { videos, isLoading, error } = useLatestVideos(1 + UP_NEXT_COUNT)
  const [activeId, setActiveId] = useState(null)
  const [playingId, setPlayingId] = useState(null)

  // Nothing to show and nothing wrong — just skip the section rather than showing an empty shell.
  if (!isLoading && !error && videos.length === 0) return null

  const active = videos.find((v) => v.id === activeId) || videos[0]
  const upNext = videos.filter((v) => v.id !== active?.id).slice(0, UP_NEXT_COUNT)

  function playInMain(id) {
    setActiveId(id)
    setPlayingId(id)
  }

  return (
    <section className="relative w-full bg-[#14151c] rounded-2xl border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.35)] p-5 md:p-8 mt-16 mb-10">

      {/* Header: theSun video logo left, Watch More link right */}
      <div className="flex items-center justify-between mb-6">
        <img src={sunVideoLogo} alt="theSun Video" className="h-7 sm:h-8 w-auto" />
        <Link
          to="/category/videos"
          className="text-neutral-300 hover:text-primary text-sm font-semibold transition-colors"
        >
          Watch More
        </Link>
      </div>

      {error ? (
        <div className="text-center py-16 text-neutral-400 text-sm">
          Unable to load videos right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main video */}
          <div className="lg:col-span-2">
            {isLoading || !active ? (
              <>
                <div className="w-full aspect-video rounded-xl bg-neutral-800 animate-pulse" />
                <div className="mt-4 space-y-3">
                  <div className="h-5 w-3/4 bg-neutral-700 rounded animate-pulse" />
                  <div className="h-3 w-1/3 bg-neutral-700 rounded animate-pulse" />
                </div>
              </>
            ) : (
              <>
                <VideoThumb
                  video={active}
                  playing={playingId === active.id}
                  onPlay={() => setPlayingId(active.id)}
                  large
                />
                <h2 className="text-white text-xl md:text-2xl font-bold leading-snug mt-4 mb-2">
                  {active.title}
                </h2>
                <p className="text-neutral-500 text-xs font-semibold tracking-wide">
                  {active.publishedAt
                    ? formatPublishedAt(active.publishedAt)
                    : `${formatViews(active.views)} views · ${timeAgo(active.publishedAt)}`}
                </p>
              </>
            )}
          </div>

          {/* Up Next list */}
          <div className="lg:col-span-1">
            <h3 className="text-primary font-bold text-lg mb-5">Up Next</h3>
            <div className="space-y-5">
              {isLoading
                ? [...Array(UP_NEXT_COUNT)].map((_, i) => <UpNextSkeleton key={i} />)
                : upNext.map((v) => (
                    <UpNextItem key={v.id} video={v} onPlay={() => playInMain(v.id)} />
                  ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating mascot robot — quietly disappears if the asset isn't present */}
      <img
        src={ROBOT_SRC}
        alt=""
        aria-hidden="true"
        onError={(e) => { e.currentTarget.style.display = 'none' }}
        className="absolute -bottom-14 -left-6 md:-bottom-20 md:-left-14 w-28 md:w-48 pointer-events-none select-none z-50"
        style={{ animation: 'thesunVideoRobotFloat 5s ease-in-out infinite' }}
      />
      <style>{`
        @keyframes thesunVideoRobotFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(3deg); }
        }
      `}</style>
    </section>
  )
}
