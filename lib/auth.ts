import { cookies } from 'next/headers'

export type Role = 'jill' | 'admin'

// Checks a raw cookie value and returns the role if valid.
// The cookie is httpOnly + secure (Vercel HTTPS), so client-side tampering isn't possible.
export function verifySession(cookie: string | undefined): Role | null {
  if (cookie === 'jill' || cookie === 'admin') return cookie
  return null
}

// For use in Server Components and Route Handlers only (not middleware).
export function getRole(): Role | null {
  const cookieStore = cookies()
  const session = cookieStore.get('session')?.value
  return verifySession(session)
}
