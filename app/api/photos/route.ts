import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    photos: data,
    urls: data.map((p: { url: string }) => p.url),
  })
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('photo') as File | null

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const bytes  = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const path   = `photos/${Date.now()}-${file.name.replace(/\s+/g, '-')}`

  const { error: uploadError } = await supabaseAdmin.storage
    .from('jills-photos')
    .upload(path, buffer, { contentType: file.type })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: urlData } = supabaseAdmin.storage
    .from('jills-photos')
    .getPublicUrl(path)

  const { data, error } = await supabaseAdmin
    .from('photos')
    .insert({ storage_path: path, url: urlData.publicUrl })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ photo: data })
}
