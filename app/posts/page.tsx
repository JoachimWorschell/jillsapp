'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Post {
  id: string
  text: string
  created_at: string
}

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

const CATEGORY_ICONS: Record<string, string> = {
  food_spot:      'F',
  flowers:        'Fl',
  songs:          'S',
  gift:           'G',
  important_date: 'D',
  misc:           'M',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  })
}

export default function PostsPage() {
  const [posts,    setPosts]    = useState<Post[]>([])
  const [text,     setText]     = useState('')
  const [sending,  setSending]  = useState(false)
  const [sent,     setSent]     = useState(false)

  const [reminders,    setReminders]    = useState<Reminder[]>([])
  const [remCategory,  setRemCategory]  = useState('food_spot')
  const [remText,      setRemText]      = useState('')
  const [addingRem,    setAddingRem]    = useState(false)
  const [savingRem,    setSavingRem]    = useState(false)

  async function loadPosts() {
    const res = await fetch('/api/posts')
    const data = await res.json()
    setPosts(data.posts ?? [])
  }

  async function loadReminders() {
    const res = await fetch('/api/reminders')
    const data = await res.json()
    setReminders(data.reminders ?? [])
  }

  useEffect(() => {
    loadPosts()
    loadReminders()
  }, [])

  async function submitPost(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    setText('')
    setSent(true)
    setTimeout(() => setSent(false), 3000)
    await loadPosts()
    setSending(false)
  }

  async function saveReminder() {
    if (!remText.trim() || savingRem) return
    setSavingRem(true)
    await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: remCategory, text: remText }),
    })
    setRemText('')
    setAddingRem(false)
    await loadReminders()
    setSavingRem(false)
  }

  async function deleteReminder(id: string) {
    await fetch('/api/reminders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setReminders(r => r.filter(x => x.id !== id))
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#E2DDD5' }}>

      {/* Header */}
      <div className="sticky top-0 z-10 bg-warm-50/80 backdrop-blur-md px-4 py-4 border-b border-warm-200/40">
        <h1 className="text-xl font-serif text-warm-800">Posts</h1>
      </div>

      {/* Post composer */}
      <form onSubmit={submitPost} className="p-4">
        <div className="card p-4">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent text-warm-800 placeholder-warm-300 text-sm resize-none outline-none leading-relaxed"
            rows={4}
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-warm-100">
            <p className="text-warm-400 text-xs">He'll be notified when you post</p>
            <button
              type="submit"
              disabled={!text.trim() || sending}
              className="btn-primary py-2 px-5"
            >
              {sending ? 'Sending…' : 'Post'}
            </button>
          </div>
        </div>
        {sent && (
          <p className="text-center text-warm-500 text-sm mt-3 animate-fade-up">
            Posted! He&apos;s been notified.
          </p>
        )}
      </form>

      {/* Reminders section */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-warm-400 text-[11px] uppercase tracking-widest">Reminders</p>
          <button
            onClick={() => setAddingRem(v => !v)}
            className="text-warm-500 text-sm font-medium"
          >
            {addingRem ? 'Cancel' : '+ Add'}
          </button>
        </div>

        {/* Add reminder form */}
        {addingRem && (
          <div className="card p-4 mb-3 space-y-3">
            <select
              value={remCategory}
              onChange={e => setRemCategory(e.target.value)}
              className="input"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <textarea
              value={remText}
              onChange={e => setRemText(e.target.value)}
              placeholder="Write your reminder..."
              className="input resize-none"
              rows={3}
            />
            <button
              onClick={saveReminder}
              disabled={!remText.trim() || savingRem}
              className="btn-primary w-full"
            >
              {savingRem ? 'Saving…' : 'Save Reminder'}
            </button>
          </div>
        )}

        {/* Reminders list */}
        {reminders.length > 0 ? (
          <div className="space-y-2.5">
            {reminders.map(rem => (
              <div key={rem.id} className="card p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-warm-200/80 flex-shrink-0 flex items-center justify-center">
                  <span className="text-warm-600 text-[10px] font-semibold uppercase">
                    {CATEGORY_ICONS[rem.category] ?? 'M'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-warm-400 text-[10px] uppercase tracking-widest mb-1">
                    {CATEGORIES.find(c => c.value === rem.category)?.label ?? rem.category}
                  </p>
                  <p className="text-warm-800 text-sm leading-relaxed">{rem.text}</p>
                  <p className="text-warm-300 text-xs mt-1">{shortDate(rem.created_at)}</p>
                </div>
                <button
                  onClick={() => deleteReminder(rem.id)}
                  className="text-warm-300 hover:text-warm-500 transition-colors flex-shrink-0 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          !addingRem && (
            <div className="card p-6 text-center">
              <p className="text-warm-400 text-sm">No reminders yet</p>
              <p className="text-warm-300 text-xs mt-1">Tap + Add to set one</p>
            </div>
          )
        )}
      </div>

      {/* Post feed */}
      {posts.length > 0 && (
        <div className="px-4 space-y-3">
          <p className="text-warm-400 text-[11px] uppercase tracking-widest mb-3">Your Posts</p>
          {posts.map(post => (
            <div key={post.id} className="card p-5">
              <p className="text-warm-800 text-sm leading-relaxed whitespace-pre-wrap">{post.text}</p>
              <p className="text-warm-400 text-xs mt-3">{formatDate(post.created_at)}</p>
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
