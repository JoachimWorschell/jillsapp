'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Post {
  id: string
  text: string
  created_at: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function PostsPage() {
  const [posts,   setPosts]   = useState<Post[]>([])
  const [text,    setText]    = useState('')
  const [sending, setSending] = useState(false)
  const [sent,    setSent]    = useState(false)

  async function load() {
    const res = await fetch('/api/posts')
    const data = await res.json()
    setPosts(data.posts ?? [])
  }

  useEffect(() => { load() }, [])

  async function submit(e: React.FormEvent) {
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
    await load()
    setSending(false)
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#E2DDD5' }}>

      <div className="sticky top-0 z-10 bg-warm-50/80 backdrop-blur-md px-4 py-4 border-b border-warm-200/40">
        <h1 className="text-xl font-serif text-warm-800">Posts</h1>
      </div>

      {/* Composer */}
      <form onSubmit={submit} className="p-4">
        <div className="card p-4">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent text-warm-800 placeholder-warm-300 text-sm resize-none outline-none leading-relaxed"
            rows={4}
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-warm-100">
            <p className="text-warm-400 text-xs">He&apos;ll be notified when you post</p>
            <button type="submit" disabled={!text.trim() || sending} className="btn-primary py-2 px-5">
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

      {/* Feed */}
      <div className="px-4 space-y-3">
        {posts.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-warm-500 font-medium">No posts yet</p>
            <p className="text-warm-400 text-sm mt-1">Share something above</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="card p-5">
              <p className="text-warm-800 text-sm leading-relaxed whitespace-pre-wrap">{post.text}</p>
              <p className="text-warm-400 text-xs mt-3">{formatDate(post.created_at)}</p>
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
