import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, ChevronRight } from 'lucide-react'
import { useLatestVideos, formatViews, timeAgo } from '@/lib/youtube'

// Optional mascot image. Drop a file at /public/images/video-robot.png to show it —
// if it's missing the <img> just quietly disappears instead of breaking the layout.
const ROBOT_SRC = '/images/video-robot.png'

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
      <div className={`relative w-full ${large ? 'aspect-video' : 'aspect-video'} bg-black rounded-xl overflow-hidden border border-neutral-700/60 shadow-lg`}>
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

function SideVideoCard({ video, playing, onPlay }) {
  return (
    <div className="flex flex-col gap-3">
      <VideoThumb video={video} playing={playing} onPlay={onPlay} />
      <div className="px-1">
        <h3 className="text-neutral-200 font-semibold text-sm leading-tight hover:text-primary transition-colors line-clamp-1 cursor-pointer">
          {video.title}
        </h3>
        <p className="text-neutral-500 text-xs mt-1 line-clamp-1">
          {formatViews(video.views)} views · {timeAgo(video.publishedAt)}
        </p>
      </div>
    </div>
  )
}

function SideVideoSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="w-full aspect-video rounded-xl bg-neutral-800 animate-pulse" />
      <div className="px-1 space-y-2">
        <div className="h-3.5 w-4/5 bg-neutral-800 rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-neutral-800 rounded animate-pulse" />
      </div>
    </div>
  )
}

export default function VideoBlock() {
  const { videos, isLoading, error } = useLatestVideos(5)
  const [playingId, setPlayingId] = useState(null)

  const main = videos[0]
  const left = videos.slice(1, 3)
  const right = videos.slice(3, 5)

  // Nothing to show and nothing wrong — just skip the section rather than showing an empty shell.
  if (!isLoading && !error && videos.length === 0) return null

  return (
    <section className="relative w-full bg-[#1c1c1e] rounded-[2.5rem] border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.35)] pt-16 pb-8 px-5 md:px-8 mt-16 mb-10">

    

      {/* Watch More */}
      <div className="absolute top-6 right-6 hidden md:block">
        <Link
          to="/category/videos"
          className="bg-[#2c2c2e] hover:bg-primary text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-semibold transition-all duration-300 shadow-md"
        >
          <Play className="w-4 h-4 fill-white" />
          Watch More
        </Link>
      </div>

      {error ? (
        <div className="text-center py-16 text-neutral-400 text-sm">
          Unable to load videos right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 xl:gap-8 mt-4 md:mt-8">

          {/* LEFT COLUMN */}
          <div className="col-span-1 order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {isLoading
              ? [...Array(2)].map((_, i) => <SideVideoSkeleton key={i} />)
              : left.map((v) => (
                  <SideVideoCard key={v.id} video={v} playing={playingId === v.id} onPlay={() => setPlayingId(v.id)} />
                ))}
          </div>

          {/* CENTER — main video */}
          <div className="col-span-1 lg:col-span-2 order-1 lg:order-2 flex flex-col gap-5">
            {isLoading || !main ? (
              <>
                <div className="w-full aspect-video rounded-2xl bg-neutral-800 animate-pulse" />
                <div className="bg-[#262628] rounded-2xl p-5 md:p-6 border border-neutral-700/40 space-y-3">
                  <div className="h-5 w-2/3 bg-neutral-700 rounded animate-pulse" />
                  <div className="h-3 w-full bg-neutral-700 rounded animate-pulse" />
                  <div className="h-3 w-4/5 bg-neutral-700 rounded animate-pulse" />
                </div>
              </>
            ) : (
              <>
                <VideoThumb video={main} playing={playingId === main.id} onPlay={() => setPlayingId(main.id)} large />
                <div className="bg-[#262628] rounded-2xl p-5 md:p-6 border border-neutral-700/40 shadow-inner">
                  <h2 className="text-2xl font-bold text-white mb-2 tracking-tight line-clamp-2">
                    {main.title}
                  </h2>
                  <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
                    {main.description || `${formatViews(main.views)} views · ${timeAgo(main.publishedAt)}`}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-span-1 order-3 lg:order-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {isLoading
              ? [...Array(2)].map((_, i) => <SideVideoSkeleton key={i} />)
              : right.map((v) => (
                  <SideVideoCard key={v.id} video={v} playing={playingId === v.id} onPlay={() => setPlayingId(v.id)} />
                ))}
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
