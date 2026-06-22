import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const svc  = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side (used in browser, limited by RLS)
export const supabase = createClient(url, anon)

// Server-side (API routes only — bypasses RLS, never expose to browser)
export const supabaseAdmin = createClient(url, svc)
