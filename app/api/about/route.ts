import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabaseAdmin.from('about').select('*')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Convert rows → { key: value } object for easy consumption
  const about = Object.fromEntries(
    (data ?? []).map((row: { key: string; value: string }) => [row.key, row.value])
  )
  return NextResponse.json({ about })
}

export async function PUT(req: NextRequest) {
  const { key, value } = await req.json()

  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('about')
    .upsert({ key, value, updated_at: new Date().toISOString() })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
