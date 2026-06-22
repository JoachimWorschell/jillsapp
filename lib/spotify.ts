import { supabaseAdmin } from './supabase'

const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!

const basicAuth = () =>
  Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

// Retrieve a valid access token — refreshing automatically if expired
export async function getSpotifyToken(): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from('about')
    .select('key, value')
    .in('key', ['spotify_access_token', 'spotify_refresh_token', 'spotify_token_expiry'])

  const t = Object.fromEntries((data ?? []).map(r => [r.key, r.value]))

  if (!t.spotify_refresh_token) return null

  const expiry = Number(t.spotify_token_expiry ?? 0)

  // Refresh if expired or expiring within 60 s
  if (Date.now() > expiry - 60_000) {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth()}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: t.spotify_refresh_token,
      }),
    })

    if (!res.ok) return null
    const refreshed = await res.json()

    await supabaseAdmin.from('about').upsert([
      { key: 'spotify_access_token', value: refreshed.access_token },
      { key: 'spotify_token_expiry', value: String(Date.now() + refreshed.expires_in * 1000) },
    ])

    return refreshed.access_token
  }

  return t.spotify_access_token ?? null
}

export async function storeSpotifyTokens(code: string, redirectUri: string) {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth()}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  })

  if (!res.ok) throw new Error('Token exchange failed')
  const tokens = await res.json()

  await supabaseAdmin.from('about').upsert([
    { key: 'spotify_access_token',  value: tokens.access_token },
    { key: 'spotify_refresh_token', value: tokens.refresh_token },
    { key: 'spotify_token_expiry',  value: String(Date.now() + tokens.expires_in * 1000) },
  ])
}
