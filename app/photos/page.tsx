'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Photo {
  id: string
  url: string
  created_at: string
}

export default function PhotosPage() {
  const [photos, setPhotos]     = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    const res = await fetch('/api/photos')
    const data = await res.json()
    setPhotos(data.photos ?? [])
  }

  useEffect(() => { load() }, [])

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)

    for (const file of files) {
      const form = new FormData()
      form.append('photo', file)
      await fetch('/api/photos', { method: 'POST', body: form })
    }

    await load()
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function deletePhoto(id: string) {
    if (!confirm('Remove this photo?')) return
    await fetch(`/api/photos/${id}`, { method: 'DELETE' })
    setPhotos(ps => ps.filter(p => p.id !== id))
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#E2DDD5' }}>

      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-warm-50/80 backdrop-blur-md px-4 py-4 border-b border-warm-200/40">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-serif text-warm-800">Our Photos 📸</h1>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="btn-primary py-2 px-4"
          >
            {uploading ? 'Uploading…' : '+ Add'}
          </button>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={upload}
      />

      {/* Empty state */}
      {photos.length === 0 && !uploading && (
        <div className="flex flex-col items-center justify-center pt-32 text-center px-6">
          <div className="text-5xl mb-4">🖼️</div>
          <p className="text-warm-700 font-medium">No photos yet</p>
          <p className="text-warm-400 text-sm mt-1">Tap "+ Add" to upload some memories</p>
        </div>
      )}

      {/* Masonry grid */}
      {photos.length > 0 && (
        <div className="p-4 columns-2 gap-3">
          {photos.map(photo => (
            <div key={photo.id} className="mb-3 break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt=""
                className="w-full object-cover"
                loading="lazy"
              />
              {/* Delete button — shows on long-press / hover */}
              <button
                onClick={() => deletePhoto(photo.id)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full
                           text-xs flex items-center justify-center
                           opacity-0 group-active:opacity-100 md:group-hover:opacity-100 transition-opacity"
                aria-label="Delete photo"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-warm-200/40 p-4">
        <Link href="/home" className="block text-center text-warm-500 text-sm">← Back home</Link>
      </div>
    </div>
  )
}
