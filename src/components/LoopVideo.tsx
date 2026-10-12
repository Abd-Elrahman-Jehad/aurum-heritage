import { useEffect, useRef } from 'react'
import { preloadAll, videoSrc } from '../lib/frameStore'

/** Muted looping film that melts into the page. Played from memory (preloaded), only while on screen. */
export default function LoopVideo({ name, className = '' }: { name: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    let alive = true
    // the film is set only once the preloader has it in memory (or has given up on it)
    void preloadAll().then(() => {
      if (!alive) return
      v.src = videoSrc(name)
      if (onScreen) void v.play().catch(() => {})
    })
    let onScreen = false
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return () => { alive = false }
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting
        if (e.isIntersecting) void v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.05 },
    )
    io.observe(v)
    return () => { alive = false; io.disconnect() }
  }, [name])
  return <video ref={ref} className={className} poster={`/video/${name}-poster.jpg`} muted loop playsInline preload="auto" aria-hidden tabIndex={-1} disablePictureInPicture />
}
