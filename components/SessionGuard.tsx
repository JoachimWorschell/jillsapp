'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// sessionStorage is cleared whenever the browser is closed (unlike cookies which can persist).
// This component forces re-login every time the browser is fully closed and reopened,
// even if the httpOnly cookie is still alive.
export default function SessionGuard() {
  const router   = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Don't guard the login page itself
    if (pathname === '/login') return

    const active = sessionStorage.getItem('jill_active')
    if (!active) {
      // Browser was closed — clear the cookie server-side then redirect to login
      fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
        router.replace('/login')
      })
    }
  }, [pathname, router])

  return null
}
