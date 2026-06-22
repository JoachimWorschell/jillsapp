import { NextRequest, NextResponse } from 'next/server'
import { storeSpotifyTokens } from '@/lib/spotify'

// Spotify redirects here after Jill approves access
export async function GET(req: NextRequest) {
  const code  = req.nextUrl.searchParams.get('code')
  const error = req.nextUrl.searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL('/music?error=spotify_denied', req.url))
  }

  try {
    await storeSpotifyTokens(code, process.env.SPOTIFY_REDIRECT_URI!)
    return NextResponse.redirect(new URL('/music?connected=1', req.url))
  } catch {
    return NextResponse.redirect(new URL('/music?error=token_failed', req.url))
  }
}
