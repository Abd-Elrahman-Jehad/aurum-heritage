import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useApp } from '../lib/state'
import { useLenis } from '../lib/smooth'

const C = 2 * Math.PI * 29

/**
 * Watch-dial back-to-top button.
 * Idle: hour hand and seconds hand both rest at 12. A thin ring shows scroll progress.
 * Click: the seconds hand sweeps fast → very fast while the whole dial flies up, in sync with the scroll.
 */
export default function BackToTop() {
  const { d, entered } = useApp()
  const lenis = useLenis()
  const btn = useRef<HTMLButtonElement>(null)
  const ring = useRef<SVGCircleElement>(null)
  const sec = useRef<SVGGElement>(null)
  const visible = useRef(false)
  const flying = useRef(false)

  // show / hide with scroll position, ring follows scroll progress
  useEffect(() => {
    if (!btn.current) return
    gsap.set(btn.current, { autoAlpha: 0, scale: 0.4, y: 30 })
    gsap.set(sec.current, { svgOrigin: '32 32', rotation: 0 })

    const show = () => {
      gsap.killTweensOf(btn.current)
      gsap.fromTo(btn.current, { autoAlpha: 0, scale: 0.4, y: 30, rotation: -140 }, { autoAlpha: 1, scale: 1, y: 0, rotation: 0, duration: 1.1, ease: 'expo.out' })
      gsap.fromTo('.btt-tick', { opacity: 0, scale: 0.4, transformOrigin: '32px 32px' }, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.03, ease: 'back.out(2)' })
    }
    const hide = () => {
      gsap.killTweensOf(btn.current)
      gsap.to(btn.current, { autoAlpha: 0, scale: 0.5, y: 20, rotation: 90, duration: 0.55, ease: 'power2.in' })
    }
    const onScroll = () => {
      const y = window.scrollY
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      if (ring.current) ring.current.style.strokeDashoffset = String(C * (1 - Math.min(1, y / max)))
      if (flying.current) return
      const should = y > window.innerHeight * 0.9
      if (should !== visible.current) {
        visible.current = should
        should ? show() : hide()
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const fly = () => {
    if (flying.current || !btn.current) return
    flying.current = true
    const dist = window.scrollY
    const dur = gsap.utils.clamp(1.5, 2.8, 1.2 + dist / (window.innerHeight * 6))
    const rise = -(window.innerHeight + 200)

    gsap.killTweensOf(btn.current)
    const tl = gsap.timeline({
      onComplete: () => {
        flying.current = false
        visible.current = false
        gsap.set(btn.current, { autoAlpha: 0, scale: 0.4, y: 30, rotation: 0 })
        gsap.set(sec.current, { svgOrigin: '32 32', rotation: 0 })
      },
    })
    // small crouch before take-off
    tl.to(btn.current, { y: 10, scale: 0.9, duration: 0.18, ease: 'power2.out' })
      .add(() => {
        if (lenis) lenis.scrollTo(0, { duration: dur, easing: (t: number) => t * t * (3 - 2 * t), force: true })
        else window.scrollTo({ top: 0, behavior: 'smooth' })
      })
      // seconds hand: already fast, then ramps to a blur
      .to(sec.current, { rotation: '+=720', svgOrigin: '32 32', duration: 0.55, ease: 'none' }, '<')
      .to(sec.current, { rotation: '+=9000', svgOrigin: '32 32', duration: dur - 0.55, ease: 'power2.in' }, '>')
      // the dial lifts off in the same breath
      .to(btn.current, { y: rise, scale: 1, rotation: -6, duration: dur, ease: 'power3.in' }, '<-0.55')
  }

  const ticks = Array.from({ length: 12 }, (_, i) => i)
  return (
    <button ref={btn} type="button" className="btt" onClick={fly} aria-label={d.ui.top} title={d.ui.top} disabled={!entered}>
      <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden>
        <defs>
          <radialGradient id="btt-face" cx="50%" cy="38%" r="70%">
            <stop offset="0" stopColor="#3a2410" />
            <stop offset="1" stopColor="#120a04" />
          </radialGradient>
          <linearGradient id="btt-gold" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f3d99a" /><stop offset="1" stopColor="#b9873a" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="31" fill="rgba(14,8,3,.55)" />
        <circle cx="32" cy="32" r="29" fill="none" stroke="rgba(244,234,216,.14)" strokeWidth="1.4" />
        <circle
          ref={ring} cx="32" cy="32" r="29" fill="none" stroke="url(#btt-gold)" strokeWidth="1.8" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C} transform="rotate(-90 32 32)"
        />
        <circle cx="32" cy="32" r="25.6" fill="url(#btt-face)" />
        {ticks.map((i) => {
          const a = (i / 12) * Math.PI * 2
          const major = i % 3 === 0
          const r1 = major ? 19.5 : 21.5
          return (
            <line key={i} className="btt-tick" x1={32 + Math.sin(a) * r1} y1={32 - Math.cos(a) * r1} x2={32 + Math.sin(a) * 24} y2={32 - Math.cos(a) * 24}
              stroke={major ? '#f3d99a' : 'rgba(244,234,216,.5)'} strokeWidth={major ? 1.6 : 1} strokeLinecap="round" />
          )
        })}
        {/* hour hand — fixed at 12 */}
        <path d="M32 32V17.5" stroke="#f4ead8" strokeWidth="2.6" strokeLinecap="round" />
        {/* seconds hand — rests at 12, spins on click */}
        <g ref={sec}>
          <line x1="32" y1="37.5" x2="32" y2="10.5" stroke="#d6a857" strokeWidth="1" strokeLinecap="round" />
          <circle cx="32" cy="14" r="1.5" fill="#d6a857" />
        </g>
        <circle cx="32" cy="32" r="2.6" fill="#120a04" stroke="#d6a857" strokeWidth="1.2" />
      </svg>
    </button>
  )
}
