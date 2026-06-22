import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendSMS } from '@/lib/twilio'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ posts: data })
}

export async function POST(req: NextRequest) {
  const { text } = await req.json()

  if (!text?.trim()) {
    return NextResponse.json({ error: 'Post cannot be empty' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('posts')
    .insert({ text: text.trim() })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Text Joachim — fire and forget, don't fail the post if SMS errors
  sendSMS(`🌸 Jill just posted: "${text.slice(0, 120)}${text.length > 120 ? '...' : ''}"`)
    .catch(err => console.error('Twilio error:', err))

  return NextResponse.json({ post: data })
}
