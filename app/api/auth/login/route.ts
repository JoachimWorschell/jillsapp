import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { pin } = await req.json()

  const JILL_PIN  = process.env.JILL_PIN  || '0524'
  const ADMIN_PIN = process.env.ADMIN_PIN  || '8128'

  let role: 'jill' | 'admin' | null = null
  if (pin === JILL_PIN)  role = 'jill'
  if (pin === ADMIN_PIN) role = 'admin'

  if (!role) {
    return NextResponse.json({ error: 'Wrong passcode' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true, role })
  res.cookies.set('session', role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // No maxAge = session cookie: clears when browser closes
    path: '/',
    sameSite: 'lax',
  })
  return res
}
