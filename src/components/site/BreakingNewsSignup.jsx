import { useState } from 'react'

export default function BreakingNewsSignup() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setDone(true)
    setEmail('')
    setTimeout(() => setDone(false), 4000)
  }

  return (
    <section className="relative bg-white rounded-2xl border border-border shadow-md overflow-hidden pt-8 pb-6 px-6 text-center">
      {/* Top accent bar */}
      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-1.5 rounded-b-full bg-gradient-to-r from-orange-400 to-primary" />

      <h3 className="text-lg text-neutral-600">
        Sign up for{' '}
        <span className="font-serif-headline font-bold">
          <span className="text-secondary italic">the</span>
          <span className="text-primary">Sun</span>
        </span>
      </h3>
      <p className="text-2xl font-extrabold text-foreground mt-0.5 tracking-tight">Breaking News Alert</p>
      <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-xs mx-auto">
        Get real-time breaking news alerts and stay up-to-date with the most important headlines from around the globe.
      </p>

      {done ? (
        <div className="mt-5 bg-muted rounded-lg p-3 text-sm font-medium text-foreground">
          Thanks! You're subscribed.
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail address"
            className="w-full rounded-full border border-border bg-white px-5 py-3 text-sm text-center placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-black hover:bg-black/85 text-white font-semibold py-3 text-sm transition-colors"
          >
            Subscribe
          </button>
        </form>
      )}

      <p className="text-xs text-muted-foreground mt-4">
        By signing up, you agree to our{' '}
        <a href="/privacy-policy" className="underline font-semibold text-foreground hover:text-primary">
          Privacy Policy
        </a>
      </p>
    </section>
  )
}
