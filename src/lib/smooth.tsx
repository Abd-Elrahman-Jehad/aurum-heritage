import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Ctx = createContext<Lenis | null>(null)
export const useLenis = () => useContext(Ctx)

/** Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger and Lenis share one clock. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const l = new Lenis({
      lerp: 0.12, // snappier than a long duration: the page follows the wheel quickly but still glides
      smoothWheel: true,
    })
    l.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => l.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setLenis(l)
    return () => {
      gsap.ticker.remove(tick)
      l.destroy()
      setLenis(null)
    }
  }, [])

  // any change of the page height (filters, images, accordions, language) re-measures every scroll trigger,
  // so sections below can never stay hidden or fire at the wrong place
  useEffect(() => {
    let t = 0
    let last = document.documentElement.scrollHeight
    const ro = new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight
      if (Math.abs(h - last) < 2) return
      last = h
      window.clearTimeout(t)
      t = window.setTimeout(() => { ScrollTrigger.refresh(); lenis?.resize() }, 120)
    })
    ro.observe(document.body)
    return () => { ro.disconnect(); window.clearTimeout(t) }
  }, [lenis])

  return <Ctx.Provider value={lenis}>{children}</Ctx.Provider>
}
