'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// ─── UPDATE THIS: Jill's Florida flight date ────────────────
const FLORIDA_DATE = new Date('2026-08-01T00:00:00')

// ── Time helpers ─────────────────────────────────────────────

function timeUntil(target: Date) {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, past: true }
  return {
    days:  Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    mins:  Math.floor((diff % 3_600_000)  / 60_000),
    past:  false,
  }
}

function nextDate(month: number, day: number): Date {
  const d = new Date(new Date().getFullYear(), month - 1, day)
  if (d <= new Date()) d.setFullYear(d.getFullYear() + 1)
  return d
}

// ── Inline SVG icons ─────────────────────────────────────────

const IconCamera = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
)

const IconPen = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const IconSpotifyFill = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)

const IconSpotifyNav = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 11.5c2.5-1 5.5-1 8 0M7 15c3-1.2 6.5-1.2 9.5 0M9 8c2-0.7 4.5-0.7 6.5 0"/>
  </svg>
)

const IconGift = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/>
    <rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
)

const IconBell = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

const IconMusic = () => (
  <svg className="w-8 h-8 text-warm-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="18" cy="16" r="3"/>
  </svg>
)

// ── Spotify types ─────────────────────────────────────────────

interface SpotifyTrack {
  id: string
  name: string
  artists: { name: string }[]
  album: { images: { url: string }[] }
  external_urls: { spotify: string }
}

interface SpotifyArtist {
  id: string
  name: string
  images: { url: string }[]
  external_urls: { spotify: string }
}

interface SpotifyData {
  connected: boolean
  topTracks?: SpotifyTrack[]
  topArtists?: SpotifyArtist[]
}

// Example placeholder data shown before Spotify is connected
const EXAMPLE_TRACKS: { name: string; artist: string }[] = [
  { name: 'Espresso', artist: 'Sabrina Carpenter' },
  { name: 'Please Please Please', artist: 'Sabrina Carpenter' },
]
const EXAMPLE_ARTIST = 'Sabrina Carpenter'

// ── Spotify Widget ────────────────────────────────────────────

function SpotifyWidget({ data }: { data: SpotifyData | null }) {
  const connected = data?.connected && (data.topTracks?.length ?? 0) > 0

  return (
    <div className="mx-4 card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-warm-400 text-[11px] uppercase tracking-widest font-medium">
          Top Songs
        </p>
        <span className="text-[#1DB954]">
          <IconSpotifyFill />
        </span>
      </div>

      {connected ? (
        <>
          {/* Real top tracks */}
          <div className="space-y-3 mb-4">
            {(data!.topTracks ?? []).slice(0, 2).map((track, i) => (
              <a
                key={track.id}
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                {track.album.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={track.album.images[0].url}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover shadow-sm flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-warm-200 flex-shrink-0 flex items-center justify-center">
                    <IconMusic />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-warm-800 text-sm font-medium truncate group-hover:text-warm-600 transition-colors">
                    {track.name}
                  </p>
                  <p className="text-warm-400 text-xs truncate">
                    {track.artists.map(a => a.name).join(', ')}
                  </p>
                </div>
                <span className="ml-auto text-[10px] font-medium text-warm-400 flex-shrink-0">
                  #{i + 1}
                </span>
              </a>
            ))}
          </div>

          {/* Top artist */}
          {data!.topArtists?.[0] && (
            <div className="pt-3 border-t border-warm-200/60 flex items-center gap-3">
              <p className="text-warm-400 text-[10px] uppercase tracking-widest">Top Artist</p>
              <a
                href={data!.topArtists[0].external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-2 group"
              >
                {data!.topArtists[0].images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data!.topArtists[0].images[0].url}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <p className="text-warm-700 text-sm font-medium group-hover:text-warm-500 transition-colors">
                  {data!.topArtists[0].name}
                </p>
              </a>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Placeholder examples */}
          <div className="space-y-3 mb-4 opacity-50">
            {EXAMPLE_TRACKS.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warm-200 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-warm-800 text-sm font-medium truncate">{t.name}</p>
                  <p className="text-warm-400 text-xs truncate">{t.artist}</p>
                </div>
                <span className="ml-auto text-[10px] font-medium text-warm-400 flex-shrink-0">
                  #{i + 1}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-warm-200/60 flex items-center gap-3 opacity-50 mb-4">
            <p className="text-warm-400 text-[10px] uppercase tracking-widest">Top Artist</p>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-warm-200" />
              <p className="text-warm-700 text-sm font-medium">{EXAMPLE_ARTIST}</p>
            </div>
          </div>
          {/* Connect CTA */}
          <a
            href="/api/spotify/auth"
            className="block w-full text-center py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ backgroundColor: '#1DB954', color: '#fff' }}
          >
            Connect Spotify
          </a>
          <p className="text-center text-warm-400 text-[10px] mt-2">
            Connect on the Music page to see her real top songs
          </p>
        </>
      )}
    </div>
  )
}

// ── Live Countdown Card ───────────────────────────────────────

function CountdownCard({ label, target }: { label: string; target: Date }) {
  const [time, setTime] = useState(timeUntil(target))

  useEffect(() => {
    const id = setInterval(() => setTime(timeUntil(target)), 60_000)
    return () => clearInterval(id)
  }, [target])

  if (time.past) {
    return (
      <div className="card px-5 py-4 text-center">
        <p className="text-warm-400 text-[10px] uppercase tracking-widest mb-1">{label}</p>
        <p className="text-warm-800 font-serif text-xl">Today</p>
      </div>
    )
  }

  return (
    <div className="card px-5 py-4">
      <p className="text-warm-400 text-[10px] uppercase tracking-widest mb-3">{label}</p>
      <div className="flex items-end gap-2.5">
        {time.days > 0 && (
          <div className="text-center">
            <p className="text-3xl font-serif text-warm-800 leading-none tabular-nums">{time.days}</p>
            <p className="text-warm-400 text-[10px] mt-0.5">days</p>
          </div>
        )}
        <div className="text-center">
          <p className="text-3xl font-serif text-warm-800 leading-none tabular-nums">
            {String(time.hours).padStart(2, '0')}
          </p>
          <p className="text-warm-400 text-[10px] mt-0.5">hrs</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-serif text-warm-800 leading-none tabular-nums">
            {String(time.mins).padStart(2, '0')}
          </p>
          <p className="text-warm-400 text-[10px] mt-0.5">min</p>
        </div>
      </div>
    </div>
  )
}

// ── Photo Collage (always moving, smooth) ────────────────────

const PLACEHOLDERS = Array(10).fill(null)

function PhotoCollage({ urls }: { urls: string[] }) {
  const items  = urls.length > 0 ? urls : PLACEHOLDERS
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden my-1">
      <div className="collage-strip">
        {doubled.map((url, i) =>
          url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt=""
              className="w-32 h-32 flex-shrink-0 rounded-2xl object-cover shadow-sm"
              draggable={false}
            />
          ) : (
            <div
              key={i}
              className="w-32 h-32 flex-shrink-0 rounded-2xl bg-warm-200/70 shadow-sm"
            />
          )
        )}
      </div>
    </div>
  )
}

// ── Flight Animation ─────────────────────────────────────────

const FLIGHT_PATH = 'M 88 68 Q 198 12 308 68'

function FlightAnimation() {
  const { days, hours, mins, past } = timeUntil(FLORIDA_DATE)

  return (
    <div className="mx-4 card overflow-hidden">
      <div className="px-5 pt-4 pb-0 flex items-center justify-between">
        <p className="text-warm-400 text-[11px] uppercase tracking-widest font-medium">Florida Trip</p>
        {!past ? (
          <p className="text-warm-700 font-serif text-sm">
            {days}d {hours}h {mins}m
          </p>
        ) : (
          <p className="text-warm-500 text-sm">Enjoy the sun!</p>
        )}
      </div>

      <svg viewBox="0 0 400 125" className="w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-hard" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <path d="M 62,22 L 80,25 L 86,36 L 90,52 L 88,68 L 83,84 L 76,96 L 67,100 L 58,93 L 52,78 L 50,60 L 52,43 L 56,30 Z"
          fill="#b87a8e" fillOpacity="0.15" stroke="#b87a8e" strokeWidth="1.5" strokeOpacity="0.5"
          filter="url(#glow-soft)"/>
        <text x="68" y="113" textAnchor="middle" fill="#9e6278" fontSize="8" fontWeight="700" letterSpacing="0.8">CALIFORNIA</text>

        <path d="M 308,44 L 352,44 L 358,51 L 352,57 L 339,57 L 335,64 L 332,76 L 329,88 L 325,99 L 319,105 L 313,100 L 310,88 L 308,74 L 307,60 Z"
          fill="#b87a8e" fillOpacity="0.15" stroke="#b87a8e" strokeWidth="1.5" strokeOpacity="0.5"
          filter="url(#glow-soft)"/>
        <text x="330" y="113" textAnchor="middle" fill="#9e6278" fontSize="8" fontWeight="700" letterSpacing="0.8">FLORIDA</text>

        <path d={FLIGHT_PATH} fill="none" stroke="#b87a8e" strokeWidth="5"
          strokeDasharray="8 6" opacity="0.2" strokeLinecap="round" filter="url(#glow-hard)"/>
        <path d={FLIGHT_PATH} fill="none" stroke="#b87a8e" strokeWidth="1.5"
          strokeDasharray="6 5" opacity="0.45" strokeLinecap="round"/>

        <g filter="url(#glow-hard)">
          <path d="M 9,0 L -5,-5 L -3,0 L -5,5 Z M -3,0 L -9,-2.5 L -8,0 L -9,2.5 Z"
            fill="#b87a8e">
            <animateMotion dur="5s" repeatCount="indefinite" rotate="auto" path={FLIGHT_PATH}/>
          </path>
        </g>
      </svg>
    </div>
  )
}

// ── Nav Card ─────────────────────────────────────────────────

function NavCard({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href}
      className="card p-4 flex items-center gap-3 active:scale-95 transition-transform duration-100">
      <div className="text-warm-500 flex-shrink-0">{icon}</div>
      <p className="text-warm-800 font-medium text-sm">{label}</p>
    </Link>
  )
}

// ── Page ─────────────────────────────────────────────────────

export default function HomePage() {
  const [photoUrls, setPhotoUrls]   = useState<string[]>([])
  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null)
  const [recentPosts, setRecentPosts] = useState<Array<{ id: string; text: string; created_at: string }>>([])

  useEffect(() => {
    fetch('/api/photos').then(r => r.json()).then(d => setPhotoUrls(d.urls ?? [])).catch(() => {})
    fetch('/api/spotify/stats').then(r => r.json()).then(setSpotifyData).catch(() => {})
    fetch('/api/posts').then(r => r.json()).then(d => setRecentPosts((d.posts ?? []).slice(0, 2))).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#E2DDD5', animation: 'unlockIn 0.55s ease-out both' }}>

      {/* Mount Rushmore hero */}
      <div className="relative w-full overflow-hidden" style={{ height: '300px' }}>
        <img src="/jill-rushmore.jpg" alt="" className="w-full h-full object-cover object-top" draggable={false}/>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, transparent 30%, rgba(226,221,213,0.6) 70%, #E2DDD5 100%)'
        }}/>
      </div>

      {/* Smooth photo collage */}
      <PhotoCollage urls={photoUrls} />

      {/* ── Spotify widget ── */}
      <div className="mt-4 mb-4">
        <SpotifyWidget data={spotifyData} />
      </div>

      {/* ── Countdown timers — equal 2-col grid ── */}
      <div className="px-4 mb-4 grid grid-cols-2 gap-3">
        <CountdownCard label="Turning 22" target={nextDate(9, 3)} />
        <CountdownCard label="1 Year"     target={nextDate(5, 24)} />
      </div>

      {/* Nav cards */}
      <div className="px-4 grid grid-cols-2 gap-2.5 mb-4">
        <NavCard href="/photos"   icon={<IconCamera />}     label="Add Photo" />
        <NavCard href="/posts"    icon={<IconPen />}        label="Add Post" />
        <NavCard href="/music"    icon={<IconSpotifyNav />} label="Music" />
        <NavCard href="/wishlist" icon={<IconGift />}       label="Wishlist" />
        <Link href="/about"
          className="card p-4 flex items-center gap-3 active:scale-95 transition-transform duration-100 col-span-2">
          <div className="text-warm-500 flex-shrink-0"><IconBell /></div>
          <p className="text-warm-800 font-medium text-sm">Set Reminders</p>
        </Link>
      </div>

      {/* Flight animation */}
      <div className="mb-4">
        <FlightAnimation />
      </div>

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <div className="px-4">
          <p className="text-warm-400 text-[11px] uppercase tracking-widest mb-3">Recent</p>
          <div className="space-y-2.5">
            {recentPosts.map(post => (
              <div key={post.id} className="card p-4">
                <p className="text-warm-800 text-sm leading-relaxed">{post.text}</p>
                <p className="text-warm-400 text-xs mt-2">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
          <Link href="/posts" className="block text-center text-warm-500 text-sm mt-4">
            See all posts →
          </Link>
        </div>
      )}
    </div>
  )
}
