import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Fetch storage path first so we can delete from bucket too
  const { data: photo } = await supabaseAdmin
    .from('photos')
    .select('storage_path')
    .eq('id', id)
    .single()

  if (photo?.storage_path) {
    await supabaseAdmin.storage
      .from('jills-photos')
      .remove([photo.storage_path])
  }

  const { error } = await supabaseAdmin
    .from('photos')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
