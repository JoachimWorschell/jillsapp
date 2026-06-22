'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const FIELDS = [
  { key: 'favorite_foods',      label: 'Favorite Foods',   placeholder: 'What she loves to eat…' },
  { key: 'favorite_flowers',    label: 'Favorite Flowers', placeholder: 'Flowers she adores…' },
  { key: 'favorite_songs',      label: 'Favorite Songs',   placeholder: 'Songs she keeps coming back to…' },
  { key: 'gift_ideas',          label: 'Gift Ideas',       placeholder: 'Things she might love…' },
  { key: 'important_dates',     label: 'Important Dates',  placeholder: 'Dates that matter…' },
  { key: 'things_she_likes',    label: 'Things She Likes', placeholder: 'Hobbies, activities, anything…' },
  { key: 'things_she_dislikes', label: "Doesn't Like",     placeholder: 'Things to avoid…' },
  { key: 'notes',               label: 'My Notes',         placeholder: 'Anything else to remember…' },
]

export default function AboutPage() {
  const [about,   setAbout]   = useState<Record<string, string>>({})
  const [role,    setRole]    = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState<Record<string, string>>({})
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    fetch('/api/about')
      .then(r => r.json())
      .then(d => { setAbout(d.about ?? {}); setDraft(d.about ?? {}) })
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setRole(d.role))
  }, [])

  async function save() {
    setSaving(true)
    await Promise.all(
      Object.entries(draft).map(([key, value]) =>
        fetch('/api/about', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        })
      )
    )
    setAbout(draft)
    setEditing(false)
    setSaving(false)
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#E2DDD5' }}>

      <div className="sticky top-0 z-10 bg-warm-50/80 backdrop-blur-md px-4 py-4 border-b border-warm-200/40">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-serif text-warm-800">About Jill</h1>
          {role === 'admin' && !editing && (
            <button onClick={() => setEditing(true)} className="btn-secondary py-2 px-4">Edit</button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {FIELDS.map(field => (
          <div key={field.key} className="card p-4">
            <p className="text-warm-500 text-xs mb-2 uppercase tracking-widest">{field.label}</p>
            {editing && role === 'admin' ? (
              <textarea
                value={draft[field.key] ?? ''}
                onChange={e => setDraft(d => ({ ...d, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full bg-transparent text-warm-800 text-sm resize-none outline-none placeholder-warm-300 leading-relaxed"
                rows={3}
              />
            ) : (
              <p className="text-warm-800 text-sm leading-relaxed whitespace-pre-wrap">
                {about[field.key] || <span className="text-warm-300 italic">Not filled in yet</span>}
              </p>
            )}
          </div>
        ))}

        {editing && (
          <div className="flex gap-3 pt-2">
            <button onClick={() => { setEditing(false); setDraft(about) }} className="btn-secondary flex-1">Cancel</button>
            <button onClick={save} disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-warm-200/40 p-4">
        <Link href="/home" className="block text-center text-warm-500 text-sm">← Back home</Link>
      </div>
    </div>
  )
}
