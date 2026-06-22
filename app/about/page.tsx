'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Reminder {
  id: string
  category: string
  text: string
  created_at: string
}

const CATEGORIES = [
  { value: 'food_spot',      label: 'Food Spot' },
  { value: 'flowers',        label: 'Flowers' },
  { value: 'songs',          label: 'Songs' },
  { value: 'gift',           label: 'Gift' },
  { value: 'important_date', label: 'Important Date' },
  { value: 'misc',           label: 'Misc' },
]

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function RemindersPage() {
  const [reminders,   setReminders]   = useState<Reminder[]>([])
  const [category,    setCategory]    = useState('food_spot')
  const [text,        setText]        = useState('')
  const [saving,      setSaving]      = useState(false)
  const [showForm,    setShowForm]    = useState(false)

  async function load() {
    const res = await fetch('/api/reminders')
    const data = await res.json()
    setReminders(data.reminders ?? [])
  }

  useEffect(() => { load() }, [])

  async function save() {
    if (!text.trim() || saving) return
    setSaving(true)
    await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, text }),
    })
    setText('')
    setShowForm(false)
    await load()
    setSaving(false)
  }

  async function remove(id: string) {
    await fetch('/api/reminders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setReminders(r => r.filter(x => x.id !== id))
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#E2DDD5' }}>

      <div className="sticky top-0 z-10 bg-warm-50/80 backdrop-blur-md px-4 py-4 border-b border-warm-200/40">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-serif text-warm-800">Reminders</h1>
          <button
            onClick={() => setShowForm(v => !v)}
            className="btn-primary py-2 px-4"
          >
            {showForm ? 'Cancel' : '+ New'}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">

        {/* Add form */}
        {showForm && (
          <div className="card p-4 space-y-3">
            <div>
              <p className="text-warm-500 text-xs uppercase tracking-widest mb-2">Category</p>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="input"
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-warm-500 text-xs uppercase tracking-widest mb-2">Note</p>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Write your reminder..."
                className="input resize-none"
                rows={3}
              />
            </div>
            <button
              onClick={save}
              disabled={!text.trim() || saving}
              className="btn-primary w-full"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        )}

        {/* Reminders list */}
        {reminders.length === 0 && !showForm ? (
          <div className="card p-8 text-center">
            <p className="text-warm-500 font-medium">No reminders yet</p>
            <p className="text-warm-400 text-sm mt-1">Tap + New to add one</p>
          </div>
        ) : (
          reminders.map(rem => (
            <div key={rem.id} className="card p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-warm-400 text-[10px] uppercase tracking-widest mb-1">
                  {CATEGORIES.find(c => c.value === rem.category)?.label ?? rem.category}
                  <span className="ml-2 normal-case">{shortDate(rem.created_at)}</span>
                </p>
                <p className="text-warm-800 text-sm leading-relaxed">{rem.text}</p>
              </div>
              <button
                onClick={() => remove(rem.id)}
                className="text-warm-300 hover:text-warm-500 transition-colors flex-shrink-0 text-xl leading-none mt-0.5"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-warm-200/40 p-4">
        <Link href="/home" className="block text-center text-warm-500 text-sm">← Back home</Link>
      </div>
    </div>
  )
}
