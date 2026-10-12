import { useLayoutEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Count a number up from 0 — keeps prefix/suffix/commas/zero padding of the final text ("$24,500", "03"). */
function countUp(el: HTMLElement, dur = 1.1) {
  const final = el.dataset.final ?? (el.dataset.final = el.textContent || '')
  // freeze the final width (tabular digits) so the number counting up never re-wraps the title next to it
  if (!el.dataset.w) {
    const cur = el.textContent
    el.textContent = final
    const w = el.getBoundingClientRect().width
    el.textContent = cur
    if (w) { el.dataset.w = '1'; el.style.display = el.style.display || 'inline-block'; el.style.minWidth = `${Math.ceil(w)}px` }
  }
  const m = final.match(/^(\D*)([\d,]+)(.*)$/)
  if (!m) return null
  const [, pre, num, post] = m
  const target = parseInt(num.replace(/,/g, ''), 10)
  const pad = num.startsWith('0') && !num.includes(',') ? num.length : 0
  const comma = num.includes(',')
  const o = { v: 0 }
  return gsap.to(o, {
    v: target, duration: dur, ease: 'power3.out',
    onUpdate: () => {
      const n = Math.round(o.v)
      el.textContent = pre + (pad ? String(n).padStart(pad, '0') : comma ? n.toLocaleString('en-US') : String(n)) + post
    },
    onComplete: () => { el.textContent = final },
  })
}

/**
 * Scroll reveal that works in both directions: every `[data-r]` element rises in when it enters the viewport
 * (scrolling down OR back up) and eases out when it leaves. `[data-count]` numbers count up each time.
 */
export function useReveal(ref: RefObject<HTMLElement>, deps: unknown[] = []) {
  const mounted = useRef(false)
  useLayoutEffect(() => {
    // a re-run (language switch, filter…) must not blink the content that is already on screen
    const rerun = mounted.current
    mounted.current = true
    const off: Array<() => void> = []
    const ctx = gsap.context(() => {
      // sections that run their own reveal (contact form, footer) are never claimed by the page around them
      const els = gsap.utils.toArray<HTMLElement>('[data-r]').filter((el) => !el.parentElement?.closest('[data-own-reveal]') || el.closest('[data-own-reveal]') === ref.current)
      // measure first (before any offsets are applied) so cards in a row can arrive from different sides
      const dirs = els.map((el) => {
        const explicit = el.dataset.r
        if (explicit === 'left' || explicit === 'right' || explicit === 'up') return { side: explicit, pos: 0 }
        const par = el.parentElement
        const top = el.getBoundingClientRect().top
        const row = par ? Array.from(par.children).filter((c) => Math.abs(c.getBoundingClientRect().top - top) < 6) : [el]
        const pos = row.indexOf(el)
        if (row.length < 2) return { side: el.matches('.pr-row') ? (els.indexOf(el) % 2 ? 'right' : 'left') : 'up', pos: 0 }
        return { side: pos === 0 ? 'left' : pos === row.length - 1 ? 'right' : 'up', pos }
      })
      const heal: Array<() => void> = []
      const onEnd = () => heal.forEach((f) => f())
      let rt = 0
      const onResize = () => { window.clearTimeout(rt); rt = window.setTimeout(onEnd, 450) }
      ScrollTrigger.addEventListener('scrollEnd', onEnd)
      window.addEventListener('resize', onResize)
      off.push(() => { ScrollTrigger.removeEventListener('scrollEnd', onEnd); window.removeEventListener('resize', onResize); window.clearTimeout(rt) })
      els.forEach((el, k) => {
        const { side, pos } = dirs[k]
        const fx = side === 'left' ? -90 : side === 'right' ? 90 : 0
        const fy = side === 'up' ? 70 : 50
        const r = el.getBoundingClientRect()
        let primed = rerun && r.top < window.innerHeight * 0.92 && r.bottom > window.innerHeight * 0.08
        gsap.set(el, primed ? { x: 0, y: 0, scale: 1, opacity: 1 } : { x: fx, y: fy, scale: 0.96, opacity: 0, willChange: 'transform, opacity' })
        const nums = Array.from(el.querySelectorAll<HTMLElement>('[data-count]'))
        if (el.hasAttribute('data-count')) nums.push(el)
        let running: gsap.core.Tween[] = []
        let shown = primed
        const show = () => {
          shown = true
          if (primed) { primed = false; return }
          gsap.to(el, { x: 0, y: 0, scale: 1, opacity: 1, duration: 1.1, delay: pos * 0.09, ease: 'power3.out', overwrite: 'auto' })
          running.forEach((t) => t.kill())
          running = nums.map((n) => countUp(n)).filter(Boolean) as gsap.core.Tween[]
        }
        const hide = () => {
          shown = false
          primed = false
          gsap.to(el, { x: fx, y: fy, scale: 0.96, opacity: 0, duration: 0.7, ease: 'power2.inOut', overwrite: 'auto' })
        }
        ScrollTrigger.create({
          trigger: el, start: 'clamp(top 92%)', end: 'bottom 8%',
          onEnter: show, onEnterBack: show,
          onLeave: hide, onLeaveBack: hide,
          // after a resize / layout change the trigger positions move: make the card match where it really is
          onRefresh: (self) => { if (self.isActive && !shown) show(); else if (!self.isActive && shown && !primed) hide() },
        })
        heal.push(() => {
          if (gsap.isTweening(el)) return
          const y = Number(gsap.getProperty(el, 'y')) || 0
          const r = el.getBoundingClientRect()
          const top = r.top - y
          const bottom = r.bottom - y
          const vh = window.innerHeight
          const inView = bottom > vh * 0.08 && top < vh * 0.92
          if (inView && !shown) show()
          else if (!inView && shown && (bottom < 0 || top > vh)) hide()
        })
      })
    }, ref)
    const t = setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => {
      clearTimeout(t)
      off.forEach((f) => f())
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
