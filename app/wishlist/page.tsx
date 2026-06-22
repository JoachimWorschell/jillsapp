'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface WishItem {
  id: string
  text: string
  url: string | null
  purchased: boolean
  created_at: string
}

export default function WishlistPage() {
  const [items, setItems]     = useState<WishItem[]>([])
  const [text, setText]       = useState('')
  const [url, setUrl]         = useState('')
  const [adding, setAdding]   = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function load() {
    const res = await fetch('/api/wishlist')
    const d   = await res.json()
    setItems(d.items ?? [])
  }

  useEffect(() => { load() }, [])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setAdding(true)
    await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, url }),
    })
    setText('')
    setUrl('')
    setShowForm(false)
    await load()
    setAdding(false)
  }

  async function togglePurchased(item: WishItem) {
    await fetch(`/api/wishlist/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ purchased: !item.purchased }),
    })
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, purchased: !i.purchased } : i))
  }

  async function remove(id: string) {
    if (!confirm('Remove this?')) return
    await fetch(`/api/wishlist/${id}`, { method: 'DELETE' })
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const active    = items.filter(i => !i.purchased)
  const gotten    = items.filter(i => i.purchased)

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#E2DDD5' }}>

      {/* Header */}
      <div className="sticky top-0 z-10 bg-warm-100/90 backdrop-blur-md px-4 py-4 border-b border-warm-200/60">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-serif text-warm-800">Wishlist</h1>
          <button onClick={() => setShowForm(v => !v)} className="btn-primary py-2 px-4">
            {showForm ? 'Cancel' : '+ Add'}
          </button>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={add} className="p-4 border-b border-warm-200/60 bg-white animate-fade-up">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What do you want?"
            className="input mb-2"
            autoFocus
          />
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Link (optional)"
            className="input mb-3"
            type="url"
          />
          <button type="submit" disabled={!text.trim() || adding} className="btn-primary w-full">
            {adding ? 'Adding…' : 'Add to Wishlist'}
          </button>
        </form>
      )}

      <div className="p-4 space-y-4">
        {/* Active items */}
        {active.length > 0 && (
          <div className="space-y-2">
            {active.map(item => (
              <WishCard key={item.id} item={item} onToggle={togglePurchased} onDelete={remove} />
            ))}
          </div>
        )}

        {items.length === 0 && (
          <div className="text-center pt-20">
            <p className="text-4xl mb-3">🎁</p>
            <p className="text-warm-600 font-serif text-lg">Nothing yet</p>
            <p className="text-warm-400 text-sm mt-1">Add things you want above</p>
          </div>
        )}

        {/* Gotten items */}
        {gotten.length > 0 && (
          <div>
            <p className="text-warm-400 text-[11px] uppercase tracking-widest mb-2">Already gotten</p>
            <div className="space-y-2 opacity-50">
              {gotten.map(item => (
                <WishCard key={item.id} item={item} onToggle={togglePurchased} onDelete={remove} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-warm-100/90 backdrop-blur-md border-t border-warm-200/60 p-4">
        <Link href="/home" className="block text-center text-warm-500 text-sm">← Back home</Link>
      </div>
    </div>
  )
}

function WishCard({ item, onToggle, onDelete }: {
  item: WishItem
  onToggle: (item: WishItem) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="card p-4 flex items-start gap-3">
      {/* Checkbox */}
      <button
        onClick={() => onToggle(item)}
        className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-full border-2 transition-colors ${
          item.purchased
            ? 'bg-warm-500 border-warm-500'
            : 'border-warm-300 hover:border-warm-500'
        }`}
      >
        {item.purchased && (
          <svg className="w-full h-full text-white p-0.5" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-relaxed ${item.purchased ? 'line-through text-warm-400' : 'text-warm-800'}`}>
          {item.text}
        </p>
        {item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer"
            className="text-warm-500 text-xs underline mt-1 block truncate">
            {item.url}
          </a>
        )}
      </div>

      <button
        onClick={() => onDelete(item.id)}
        className="text-warm-300 hover:text-warm-500 transition-colors flex-shrink-0 text-lg leading-none"
      >
        ×
      </button>
    </div>
  )
}
