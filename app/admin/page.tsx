'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#E2DDD5' }}>

      {/* Header */}
      <div className="px-4 pt-14 pb-6">
        <p className="text-warm-400 text-sm">Welcome back,</p>
        <h1 className="text-3xl font-serif text-warm-800 mt-1">Joachim 🔐</h1>
      </div>

      <div className="px-4 space-y-3">

        <Link href="/about" className="card p-4 flex items-center gap-4 block active:scale-95 transition-transform">
          <div className="text-2xl w-10 text-center">🌸</div>
          <div className="flex-1">
            <p className="text-warm-800 font-medium">Edit About Her</p>
            <p className="text-warm-400 text-sm">Fill in things to remember about Jill</p>
          </div>
          <span className="text-warm-300 text-lg">→</span>
        </Link>

        <Link href="/posts" className="card p-4 flex items-center gap-4 block active:scale-95 transition-transform">
          <div className="text-2xl w-10 text-center">💌</div>
          <div className="flex-1">
            <p className="text-warm-800 font-medium">Her Posts</p>
            <p className="text-warm-400 text-sm">See everything she's shared</p>
          </div>
          <span className="text-warm-300 text-lg">→</span>
        </Link>

        <Link href="/photos" className="card p-4 flex items-center gap-4 block active:scale-95 transition-transform">
          <div className="text-2xl w-10 text-center">📸</div>
          <div className="flex-1">
            <p className="text-warm-800 font-medium">Photos</p>
            <p className="text-warm-400 text-sm">View the collage</p>
          </div>
          <span className="text-warm-300 text-lg">→</span>
        </Link>

        <Link href="/music" className="card p-4 flex items-center gap-4 block active:scale-95 transition-transform">
          <div className="text-2xl w-10 text-center">🎵</div>
          <div className="flex-1">
            <p className="text-warm-800 font-medium">Music</p>
            <p className="text-warm-400 text-sm">Update her favorites</p>
          </div>
          <span className="text-warm-300 text-lg">→</span>
        </Link>

        <Link href="/home" className="card p-4 flex items-center gap-4 block active:scale-95 transition-transform">
          <div className="text-2xl w-10 text-center">🏠</div>
          <div className="flex-1">
            <p className="text-warm-800 font-medium">Home</p>
            <p className="text-warm-400 text-sm">See the main page</p>
          </div>
          <span className="text-warm-300 text-lg">→</span>
        </Link>

        <div className="pt-4">
          <button onClick={logout} className="btn-secondary w-full">
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
