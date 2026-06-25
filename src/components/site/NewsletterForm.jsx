import { useState } from 'react'
import { Mail, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function NewsletterForm() {
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
    <section className="bg-gradient-to-br from-primary to-red-700 text-white rounded-lg p-5">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="h-5 w-5" />
        <h3 className="text-base font-bold uppercase tracking-wider">Newsletter</h3>
      </div>
      <p className="text-sm text-white/90 mb-3">Get the day's top stories delivered straight to your inbox every morning.</p>
      {done ? (
        <div className="flex items-center gap-2 bg-white/15 rounded p-3 text-sm">
          <CheckCircle2 className="h-5 w-5" />
          Thanks! You're subscribed.
        </div>
      ) : (
        <form className="space-y-2" onSubmit={submit}>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="bg-white text-foreground placeholder:text-muted-foreground border-0" />
          <Button type="submit" className="w-full bg-black hover:bg-black/80 text-white">Subscribe</Button>
        </form>
      )}
    </section>
  )
}
