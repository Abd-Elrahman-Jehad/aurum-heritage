import { useLayoutEffect, createContext, useCallback, useContext, useEffect, useRef, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from './smooth'
import { useApp } from './state'
import Logo from '../components/Logo'

gsap.registerPlugin(ScrollTrigger)

interface NavApi {
  go: (to: string, curtain?: boolean) => void
}
const Ctx = createContext<NavApi>({ go: () => {} })
export const useNav = () => useContext(Ctx)

const KEY = 'aurum:scroll'
const readSaved = (): { path: string; y: number } | null => {
  try {
    const v = JSON.parse(sessionStorage.getItem(KEY) || 'null')
    return v && typeof v.y === 'number' ? v : null
  } catch { return null }
}

/**
 * Navigation: links in the navbar / menu close two curtains with the logo (the loading page) while the route
 * changes; every other link inside the pages swaps instantly with a short fade. A reload restores the scroll position.
 */
export function NavProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const loc = useLocation()
  const lenis = useLenis()
  const { entered } = useApp()
  const pendingHash = useRef('')
  const busy = useRef(false)
  const topRef = useRef<HTMLDivElement>(null)
  const botRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)

  const scrollToHash = useCallback(
    (hash: string, immediate = false) => {
      const el = hash ? document.getElementById(hash) : null
      if (lenis) {
        if (el) lenis.scrollTo(el, { duration: immediate ? 0 : 1.6, immediate })
        else lenis.scrollTo(0, { duration: immediate ? 0 : 1.3, immediate })
      } else if (el) el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
      else window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
    },
    [lenis],
  )

  const go = useCallback(
    (to: string, curtain = false) => {
      if (busy.current) return
      const [rawPath, hash = ''] = to.split('#')
      const path = rawPath || loc.pathname
      if (path === loc.pathname) {
        scrollToHash(hash)
        return
      }
      pendingHash.current = hash
      if (!curtain) {
        navigate(path)
        return
      }
      busy.current = true
      gsap.timeline({ onComplete: () => { void navigate(path) } })
        .set([topRef.current, botRef.current], { visibility: 'visible' })
        .set(markRef.current, { opacity: 1 })
        .fromTo([topRef.current, botRef.current], { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: 'expo.inOut' })
        // the line is one piece with the mark: it draws in from both edges and meets the logo, which spins into place
        .fromTo('.cm-l', { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.out' }, 0.3)
        .fromTo('.cm-r', { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.out' }, 0.3)
        .fromTo('.cm-logo', { scale: 0.3, rotate: -220, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 1, ease: 'expo.out' }, 0.25)
    },
    [loc.pathname, navigate, scrollToHash],
  )

  /* remember the scroll position (per page) so a refresh restores it */
  useEffect(() => {
    try { history.scrollRestoration = 'manual' } catch { /* ignore */ }
    let t = 0
    const save = () => {
      if (!entered) return
      try { sessionStorage.setItem(KEY, JSON.stringify({ path: location.pathname, y: Math.round(window.scrollY) })) } catch { /* ignore */ }
    }
    const onScroll = () => { window.clearTimeout(t); t = window.setTimeout(save, 120) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pagehide', save)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('pagehide', save); window.clearTimeout(t) }
  }, [entered])

  /* once the loader is done, jump back to the saved position (reload only) */
  const restored = useRef(false)
  useEffect(() => {
    if (!entered || restored.current) return
    restored.current = true
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    const saved = readSaved()
    if (!saved || saved.path !== loc.pathname || saved.y < 40 || nav?.type === 'navigate') return
    const jump = () => { ScrollTrigger.refresh(); window.scrollTo(0, saved.y); lenis?.scrollTo(saved.y, { immediate: true, force: true }) }
    const ids = [60, 450, 1200].map((ms) => window.setTimeout(jump, ms))
    return () => ids.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entered, lenis])

  /* before the new page is painted, drop the old scroll offset so a page never flashes in mid-way */
  const firstPaint = useRef(true)
  useLayoutEffect(() => {
    if (firstPaint.current) { firstPaint.current = false; return }
    window.scrollTo(0, 0)
  }, [loc.pathname])

  /* after a route change: back to top (or the hash), refresh triggers, soft fade-in */
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const hash = pendingHash.current
    pendingHash.current = ''
    // always open a page from its very top. Phones can ignore a scroll reset while the previous page is still coasting
    // (iOS momentum), so the reset is repeated for a moment unless the visitor has already started scrolling again.
    const toTop = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      lenis?.scrollTo(0, { immediate: true, force: true })
    }
    toTop()
    let touched = false
    const mark = () => { touched = true }
    const keep: number[] = []
    if (!hash) {
      ;['wheel', 'touchstart', 'keydown'].forEach((e) => window.addEventListener(e, mark, { passive: true, once: true }))
      ;[40, 120, 260, 500, 900].forEach((ms) => keep.push(window.setTimeout(() => { if (!touched && window.scrollY > 0) toTop() }, ms)))
    }
    const wasBusy = busy.current
    if (!wasBusy) gsap.fromTo('main', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', clearProps: 'opacity,transform' })
    const t = setTimeout(() => {
      ScrollTrigger.refresh()
      if (hash) scrollToHash(hash, true)
      if (!wasBusy) return
      gsap.timeline({
        onComplete: () => {
          busy.current = false
          gsap.set([topRef.current, botRef.current], { visibility: 'hidden' })
        },
      })
        // the mark opens from the middle: the logo turns and swells, the line pulls back to the edges, then the curtains part
        .to('.cm-logo', { rotate: 200, scale: 1.45, opacity: 0, duration: 0.7, ease: 'power3.in' })
        .to(['.cm-l', '.cm-r'], { scaleX: 0, duration: 0.6, ease: 'power3.in' }, 0)
        .to([topRef.current, botRef.current], { scaleY: 0, duration: 0.9, ease: 'expo.inOut' }, 0.4)
        .set(markRef.current, { opacity: 0 })
    }, 140)
    return () => {
      clearTimeout(t)
      keep.forEach(clearTimeout)
      ;['wheel', 'touchstart', 'keydown'].forEach((e) => window.removeEventListener(e, mark))
    }
  }, [loc.pathname, lenis, scrollToHash])

  return (
    <Ctx.Provider value={{ go }}>
      {children}
      <div className="curtain curtain-top" ref={topRef} aria-hidden />
      <div className="curtain curtain-bot" ref={botRef} aria-hidden />
      <div className="curtain-mark" ref={markRef} aria-hidden>
        <i className="cm-line cm-l" />
        <span className="cm-logo"><i className="cm-halo" /><Logo size={76} /></span>
        <i className="cm-line cm-r" />
      </div>
    </Ctx.Provider>
  )
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string; curtain?: boolean }
/** Real <a href> (good for SEO / open-in-new-tab) that navigates without a page reload. */
export function TLink({ to, onClick, curtain, children, ...rest }: LinkProps) {
  const { go } = useNav()
  return (
    <a
      {...rest}
      href={to}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        go(to, curtain)
      }}
    >
      {children}
    </a>
  )
}
