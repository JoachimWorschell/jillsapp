import { NextResponse } from 'next/server'
import { getSpotifyToken } from '@/lib/spotify'

export async function GET() {
  const token = await getSpotifyToken()
  if (!token) return NextResponse.json({ connected: false })

  try {
    const [tracksRes, artistsRes] = await Promise.all([
      fetch('https://api.spotify.com/v1/me/top/tracks?limit=3&time_range=short_term', {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 }, // cache 1 hour
      }),
      fetch('https://api.spotify.com/v1/me/top/artists?limit=2&time_range=short_term', {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      }),
    ])

    if (!tracksRes.ok || !artistsRes.ok) {
      return NextResponse.json({ connected: false, error: 'spotify_api_error' })
    }

    const [tracks, artists] = await Promise.all([tracksRes.json(), artistsRes.json()])

    return NextResponse.json({
      connected: true,
      topTracks:  tracks.items  ?? [],
      topArtists: artists.items ?? [],
    })
  } catch {
    return NextResponse.json({ connected: false, error: 'fetch_failed' })
  }
}
