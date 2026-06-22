'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const KEYS = ['1','2','3','4','5','6','7','8','9','','0','del']

export default function LoginPage() {
  const [pin, setPin]             = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const router = useRouter()

  function pressKey(key: string) {
    if (loading || pin.length >= 4) return
    const next = pin + key
    setPin(next)
    setError('')
    if (next.length === 4) submit(next)
  }

  function deleteKey() {
    if (loading) return
    setPin(p => p.slice(0, -1))
    setError('')
  }

  async function submit(code: string) {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: code }),
      })
      if (res.ok) {
        // Trigger zoom-in unlock animation, then navigate
        setUnlocking(true)
        setTimeout(() => router.push('/home'), 650)
      } else {
        setPin('')
        setError('Wrong passcode')
        setTimeout(() => setError(''), 2200)
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">

      {/* Blurry Rushmore background */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/jill-rushmore.jpg"
          alt=""
          className="w-full h-full object-cover object-top scale-110"
          style={{ filter: 'blur(18px)' }}
          draggable={false}
        />
        {/* Dark warm overlay */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(31,26,14,0.55)' }} />
      </div>

      {/* Zoom-in overlay that fills the screen on unlock */}
      <div
        className="absolute inset-0 z-20 pointer-events-none transition-all duration-700 ease-in"
        style={{
          backgroundColor: '#E2DDD5',
          opacity: unlocking ? 1 : 0,
          transform: unlocking ? 'scale(1)' : 'scale(0.92)',
        }}
      />

      {/* Content — fades + zooms out as unlock overlay comes in */}
      <div
        className="relative z-10 w-full flex flex-col items-center transition-all duration-500 ease-in"
        style={{
          opacity:    unlocking ? 0 : 1,
          transform:  unlocking ? 'scale(1.08)' : 'scale(1)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-14 animate-fade-up">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="text-white text-3xl font-serif font-light tracking-wide">For Jill</h1>
          <p className="text-white/60 text-sm mt-2 tracking-wider">Enter your passcode</p>
        </div>

        {/* PIN dots */}
        <div className="flex gap-5 mb-8">
          {[0,1,2,3].map(i => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
                i < pin.length
                  ? 'bg-white border-white scale-110'
                  : 'border-white/40'
              }`}
            />
          ))}
        </div>

        {/* Error */}
        <div className={`text-red-300 text-sm mb-6 h-5 transition-opacity duration-300 ${error ? 'opacity-100' : 'opacity-0'}`}>
          {error || ' '}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-[260px]">
          {KEYS.map((key, i) => {
            if (!key) return <div key={i} />

            if (key === 'del') return (
              <button
                key="del"
                onClick={deleteKey}
                className="h-[68px] flex items-center justify-center text-white/80 text-2xl rounded-full active:bg-white/20 transition-colors"
              >
                ⌫
              </button>
            )

            return (
              <button
                key={key}
                onClick={() => pressKey(key)}
                disabled={loading}
                className="h-[68px] bg-white/10 text-white text-2xl font-light rounded-full
                           hover:bg-white/20 active:bg-white/30 transition-colors"
              >
                {key}
              </button>
            )
          })}
        </div>

        {loading && !unlocking && (
          <p className="text-white/50 text-sm mt-8 animate-pulse-soft">Checking...</p>
        )}
      </div>
    </div>
  )
}
