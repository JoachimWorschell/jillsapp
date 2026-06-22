'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface SpotifyTrack {
  id: string
  name: string
  artists: { name: string }[]
  album: { images: { url: string }[]; name: string }
  external_urls: { spotify: string }
}

interface SpotifyArtist {
  id: string
  name: string
  images: { url: string }[]
  genres: string[]
  external_urls: { spotify: string }
}

interface SpotifyData {
  connected: boolean
  topTracks?: SpotifyTrack[]
  topArtists?: SpotifyArtist[]
}

function MusicContent() {
  const params = useSearchParams()
  const [data,    setData]    = useState<SpotifyData | null>(null)
  const [loading, setLoading] = useState(true)

  const justConnected = params.get('connected') === '1'
  const errorParam    = params.get('error')

  useEffect(() => {
    fetch('/api/spotify/stats')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({ connected: false }))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen pb-24 pt-6" style={{ backgroundColor: '#E2DDD5' }}>

      {/* Header */}
      <div className="px-4 flex items-center gap-3 mb-6">
        <svg className="w-5 h-5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
        <h1 className="font-serif text-2xl text-warm-800">Music</h1>
      </div>

      {/* Toast messages */}
      {justConnected && (
        <div className="mx-4 mb-4 card p-4 border border-green-200 text-green-700 text-sm">
          ✓ Spotify connected! Your top songs update automatically.
        </div>
      )}
      {errorParam && (
        <div className="mx-4 mb-4 card p-4 border border-red-200 text-red-600 text-sm">
          {errorParam === 'spotify_denied' ? 'Spotify access was denied.' : 'Something went wrong connecting Spotify.'}
        </div>
      )}

      {loading ? (
        <div className="px-4 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-4 flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-warm-200 flex-shrink-0"/>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-warm-200 rounded w-2/3"/>
                <div className="h-3 bg-warm-200 rounded w-1/2"/>
              </div>
            </div>
          ))}
        </div>
      ) : data?.connected ? (
        <div className="px-4 space-y-6">

          {/* Top Tracks */}
          <div>
            <p className="text-warm-400 text-[11px] uppercase tracking-widest mb-3">Top Tracks</p>
            <div className="space-y-2.5">
              {(data.topTracks ?? []).map((track, i) => (
                <a
                  key={track.id}
                  href={track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-4 flex items-center gap-3 group active:scale-[0.98] transition-transform block"
                >
                  <span className="text-warm-300 font-serif text-lg w-5 text-center flex-shrink-0">{i + 1}</span>
                  {track.album.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={track.album.images[0].url} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm flex-shrink-0"/>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-warm-800 font-medium text-sm truncate group-hover:text-warm-600 transition-colors">{track.name}</p>
                    <p className="text-warm-400 text-xs truncate">{track.artists.map(a => a.name).join(', ')}</p>
                    <p className="text-warm-300 text-xs truncate">{track.album.name}</p>
                  </div>
                  <svg className="w-4 h-4 text-warm-300 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Top Artists */}
          <div>
            <p className="text-warm-400 text-[11px] uppercase tracking-widest mb-3">Top Artists</p>
            <div className="space-y-2.5">
              {(data.topArtists ?? []).map((artist, i) => (
                <a
                  key={artist.id}
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-4 flex items-center gap-3 group active:scale-[0.98] transition-transform block"
                >
                  <span className="text-warm-300 font-serif text-lg w-5 text-center flex-shrink-0">{i + 1}</span>
                  {artist.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={artist.images[0].url} alt="" className="w-12 h-12 rounded-full object-cover shadow-sm flex-shrink-0"/>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-warm-200 flex-shrink-0"/>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-warm-800 font-medium text-sm truncate group-hover:text-warm-600 transition-colors">{artist.name}</p>
                    {artist.genres[0] && <p className="text-warm-400 text-xs capitalize">{artist.genres[0]}</p>}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="card p-4 text-center">
            <p className="text-warm-400 text-xs mb-3">Updates pull your last 4 weeks of listening</p>
            <a href="/api/spotify/auth" className="text-[#1DB954] text-sm font-medium hover:underline">
              Reconnect Spotify →
            </a>
          </div>
        </div>
      ) : (
        /* Not connected */
        <div className="mx-4 card p-8 text-center">
          <div className="flex justify-center mb-4 text-[#1DB954]">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <p className="font-serif text-warm-800 text-xl mb-2">Connect Spotify</p>
          <p className="text-warm-400 text-sm mb-6 leading-relaxed">
            Connect your account to automatically pull in your top songs and artists from the last 4 weeks.
          </p>
          <a
            href="/api/spotify/auth"
            className="inline-block px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: '#1DB954' }}
          >
            Connect Spotify
          </a>
        </div>
      )}
    </div>
  )
}

export default function MusicPage() {
  return (
    <Suspense>
      <MusicContent />
    </Suspense>
  )
}
