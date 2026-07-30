import { useCallback, useEffect, useRef, useState } from 'react'

// Rough average speaking rate for a browser TTS voice — used only to estimate
// a duration/progress bar, not to control actual playback speed.
const WORDS_PER_MINUTE = 165

// Preferred voice name. Voices are supplied by the OS/browser, not by this
// app, so this is a best-effort match by name — if the device doesn't have
// a voice by this name installed, we silently fall back to the default.
const PREFERRED_VOICE_NAME = 'Osman'

let cachedVoices = []
let voicesReadyPromise = null

function loadVoices() {
  if (!('speechSynthesis' in window)) return Promise.resolve([])
  if (voicesReadyPromise) return voicesReadyPromise

  voicesReadyPromise = new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices()
    if (existing.length) {
      cachedVoices = existing
      resolve(existing)
      return
    }
    const onVoicesChanged = () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length) {
        cachedVoices = voices
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged)
        resolve(voices)
      }
    }
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged)
    // Some browsers never fire voiceschanged if voices are already loaded
    // synchronously by the time we get here — fall back to a short timeout.
    setTimeout(() => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length) {
        cachedVoices = voices
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged)
        resolve(voices)
      }
    }, 300)
  })
  return voicesReadyPromise
}

function getPreferredVoice() {
  const voices = cachedVoices.length ? cachedVoices : (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : [])
  if (!voices.length) return null
  const exact = voices.find((v) => v.name.toLowerCase() === PREFERRED_VOICE_NAME.toLowerCase())
  if (exact) return exact
  const partial = voices.find((v) => v.name.toLowerCase().includes('seraphina'))
  return partial || null
}

export function estimateSeconds(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(5, Math.round((words / WORDS_PER_MINUTE) * 60))
}

export function formatDuration(sec = 0) {
  sec = Math.round(sec)
  const m = Math.floor(sec / 60)
  const s = sec % 60
  if (m <= 0) return `${s} sec`
  return `${m} min ${String(s).padStart(2, '0')} sec`
}

export function formatClock(sec = 0) {
  sec = Math.max(0, Math.round(sec))
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * Drives browser text-to-speech (Web Speech API) over a queue of articles.
 * Each item is { id, slug, title, text }. Nothing is pre-recorded — every
 * headline's full text is synthesized live, on demand, which is what lets
 * this work for any article without a backend TTS service.
 */
export function useNewsReader(items) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    if (supported) loadVoices()
  }, [supported])

  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [muted, setMuted] = useState(false)

  const itemsRef = useRef(items)
  itemsRef.current = items
  const mutedRef = useRef(muted)
  mutedRef.current = muted
  const elapsedRef = useRef(0)
  const startOffsetSecRef = useRef(0)
  const startTimeRef = useRef(0)
  const rafRef = useRef(null)

  const stopTicker = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }, [])

  const tick = useCallback(() => {
    const sinceStart = (Date.now() - startTimeRef.current) / 1000
    const value = startOffsetSecRef.current + sinceStart
    elapsedRef.current = value
    setElapsed(value)
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const playFrom = useCallback((idx, charOffset = 0) => {
    if (!supported) return
    const it = itemsRef.current[idx]
    if (!it) { setPlaying(false); return }

    window.speechSynthesis.cancel()
    const fullText = it.text || it.title
    const text = fullText.slice(charOffset) || it.title
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = 1
    utter.pitch = 1
    utter.volume = mutedRef.current ? 0 : 1
    const voice = getPreferredVoice()
    if (voice) {
      utter.voice = voice
      utter.lang = voice.lang
    }

    utter.onend = () => {
      stopTicker()
      const nextIdx = idx + 1
      if (itemsRef.current[nextIdx]) {
        setIndex(nextIdx)
        setElapsed(0)
        elapsedRef.current = 0
        playFrom(nextIdx, 0)
      } else {
        setPlaying(false)
      }
    }
    utter.onerror = () => { stopTicker(); setPlaying(false) }

    const dur = estimateSeconds(fullText)
    const consumedFraction = fullText.length ? charOffset / fullText.length : 0
    startOffsetSecRef.current = consumedFraction * dur
    elapsedRef.current = startOffsetSecRef.current
    startTimeRef.current = Date.now()

    window.speechSynthesis.speak(utter)
    setPlaying(true)
    stopTicker()
    tick()
  }, [supported, stopTicker, tick])

  const play = useCallback(() => {
    if (!supported) return
    if (window.speechSynthesis.paused && window.speechSynthesis.speaking) {
      window.speechSynthesis.resume()
      startTimeRef.current = Date.now() - (elapsedRef.current - startOffsetSecRef.current) * 1000
      setPlaying(true)
      stopTicker()
      tick()
      return
    }
    playFrom(index, 0)
  }, [supported, index, playFrom, stopTicker, tick])

  const pause = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.pause()
    setPlaying(false)
    stopTicker()
  }, [supported, stopTicker])

  const toggle = useCallback(() => { playing ? pause() : play() }, [playing, pause, play])

  const selectIndex = useCallback((idx) => {
    setIndex(idx)
    setElapsed(0)
    elapsedRef.current = 0
    playFrom(idx, 0)
  }, [playFrom])

  const next = useCallback(() => {
    if (itemsRef.current[index + 1]) selectIndex(index + 1)
  }, [index, selectIndex])

  const prev = useCallback(() => {
    if (itemsRef.current[index - 1]) selectIndex(index - 1)
  }, [index, selectIndex])

  const seekFraction = useCallback((frac) => {
    const it = itemsRef.current[index]
    if (!it) return
    const fullText = it.text || it.title
    const charOffset = Math.floor(frac * fullText.length)
    playFrom(index, charOffset)
  }, [index, playFrom])

  const toggleMute = useCallback(() => {
    setMuted((prevMuted) => {
      const nextMuted = !prevMuted
      mutedRef.current = nextMuted
      // Utterance volume can't change mid-speech, so re-speak from the
      // current position with the new volume — imperceptible in practice.
      const it = itemsRef.current[index]
      if (playing && it) {
        const fullText = it.text || it.title
        const dur = estimateSeconds(fullText)
        const frac = dur > 0 ? Math.min(1, elapsedRef.current / dur) : 0
        const charOffset = Math.floor(frac * fullText.length)
        playFrom(index, charOffset)
      }
      return nextMuted
    })
  }, [playing, index, playFrom])

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel()
    stopTicker()
    setPlaying(false)
    setElapsed(0)
    elapsedRef.current = 0
  }, [supported, stopTicker])

  // Stop any speech and the ticker on unmount.
  useEffect(() => () => {
    stopTicker()
    if (supported) window.speechSynthesis.cancel()
  }, [supported, stopTicker])

  const current = items[index] || null
  const duration = current ? estimateSeconds(current.text || current.title) : 0

  return {
    supported, items, index, current, playing, elapsed, duration, muted,
    play, pause, toggle, next, prev, selectIndex, seekFraction, toggleMute, stop,
    hasPrev: index > 0, hasNext: index < items.length - 1,
  }
}
