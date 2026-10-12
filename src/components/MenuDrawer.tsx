import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { useApp } from '../lib/state'
import { useLenis } from '../lib/smooth'
import { TLink } from '../lib/nav'

interface L { to: string; label: string }

/**
 * Half-circle menu that opens from the screen edge (right in LTR, left in RTL).
 * Open/close is pure CSS (so it can never get stuck); GSAP only drives the watch hands:
 * they point at the link you hover, and spin + change colour when you hover them.
 */
export default function MenuDrawer({ open, links, active, onClose }: { open: boolean; links: L[]; active: string; onClose: () => void }) {
  const { S, d } = useApp()
  const lenis = useLenis()
  const circle = useRef<HTMLElement>(null)
  const svg = useRef<SVGSVGElement>(null)

  const mir = (a: number) => (S === 1 ? a : -a)
  const REST_M = mir(292)
  const REST_H = mir(248)

  const hands = () => ({
    m: svg.current?.querySelector('.hand-m') as SVGGElement | null,
    h: svg.current?.querySelector('.hand-h') as SVGGElement | null,
  })

  // initial hand angles (also when the language flips and the circle mirrors)
  useEffect(() => {
    const { m, h } = hands()
    if (m) gsap.set(m, { rotation: REST_M, svgOrigin: '0 0' })
    if (h) gsap.set(h, { rotation: REST_H, svgOrigin: '0 0' })
    gsap.set(svg.current, { '--hand': '#d6a857' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [S])

  // lock page scroll + Escape to close
  useEffect(() => {
    if (!open) return
    lenis?.stop()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    // a little sweep of the hands every time the menu opens
    const { m, h } = hands()
    if (m && h) {
      gsap.fromTo(m, { rotation: mir(190) }, { rotation: REST_M, duration: 1.3, ease: 'expo.out', svgOrigin: '0 0', delay: 0.1 })
      gsap.fromTo(h, { rotation: mir(330) }, { rotation: REST_H, duration: 1.3, ease: 'expo.out', svgOrigin: '0 0', delay: 0.1 })
    }
    return () => {
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lenis])

  const aim = (el: HTMLElement | null) => {
    const c = circle.current
    const { m, h } = hands()
    if (!c || !m || !h) return
    let ang = REST_M
    let hour = REST_H
    if (el) {
      const r = c.getBoundingClientRect()
      const t = el.getBoundingClientRect()
      const dx = t.left + t.width / 2 - (r.left + r.width / 2)
      const dy = t.top + t.height / 2 - (r.top + r.height / 2)
      ang = (Math.atan2(dx, -dy) * 180) / Math.PI
      hour = ang + 36 * -S
    }
    const near = (cur: number, to: number) => cur + ((((to - cur) % 360) + 540) % 360) - 180
    gsap.to(m, { rotation: near(Number(gsap.getProperty(m, 'rotation')), ang), duration: 0.8, ease: 'expo.out', svgOrigin: '0 0', overwrite: 'auto' })
    gsap.to(h, { rotation: near(Number(gsap.getProperty(h, 'rotation')), hour), duration: 1, ease: 'expo.out', svgOrigin: '0 0', overwrite: 'auto' })
    gsap.to(svg.current, { '--hand': el ? '#fff0c4' : '#d6a857', duration: 0.4, overwrite: 'auto' })
  }

  const spin = () => {
    const { m, h } = hands()
    if (!m || !h) return
    gsap.to(m, { rotation: `+=${360 * S}`, duration: 1.2, ease: 'power3.inOut', svgOrigin: '0 0', overwrite: 'auto' })
    gsap.to(h, { rotation: `-=${360 * S}`, duration: 1.5, ease: 'power3.inOut', svgOrigin: '0 0', overwrite: 'auto' })
    gsap.fromTo(svg.current, { '--hand': '#ff8a50' }, { '--hand': '#d6a857', duration: 1.4, ease: 'power2.out', overwrite: 'auto' })
  }

  const ticks = Array.from({ length: 60 }, (_, i) => i)
  return createPortal(
    <div className={`mdr ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="mdr-bg" onClick={onClose} />
      <aside ref={circle} className="mdr-circle">
        <svg ref={svg} className="mdr-dial" viewBox="-100 -100 200 200" aria-hidden>
          <circle r="99" fill="none" stroke="rgba(214,168,87,.35)" strokeWidth=".4" />
          <circle r="82" fill="none" stroke="rgba(214,168,87,.14)" strokeWidth=".3" />
          <g className="mdr-ticks">
            {ticks.map((i) => (
              <line key={i} x1="0" y1={i % 5 ? -95 : -92} x2="0" y2="-98" transform={`rotate(${i * 6})`} stroke="rgba(214,168,87,.6)" strokeWidth={i % 5 ? 0.35 : 0.9} />
            ))}
          </g>
          <g className="hand hand-h" onPointerEnter={spin}>
            <path d="M0 6 L-2.6 0 L0 -24 L2.6 0 Z" className="hand-fill" />
            <line x1="0" y1="6" x2="0" y2="-26" stroke="transparent" strokeWidth="9" />
          </g>
          <g className="hand hand-m" onPointerEnter={spin}>
            <path d="M0 8 L-1.9 0 L0 -33 L1.9 0 Z" className="hand-fill" />
            <line x1="0" y1="8" x2="0" y2="-35" stroke="transparent" strokeWidth="9" />
          </g>
          <line x1="0" y1="10" x2="0" y2="-40" stroke="#ff7a45" strokeWidth=".6">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="60s" repeatCount="indefinite" />
          </line>
          <circle r="3.4" fill="#d6a857" />
          <circle r="1.3" fill="#120a04" />
        </svg>
        <nav className="mdr-links" aria-label="Menu" onPointerLeave={() => aim(null)}>
          {links.map((l, i) => (
            <TLink curtain key={l.to} to={l.to} style={{ ['--i' as string]: i }} className={active === l.to ? 'is-active' : ''} onPointerEnter={(e) => aim(e.currentTarget)} onFocus={(e) => aim(e.currentTarget)}>
              <em>0{i + 1}</em>
              {l.label}
            </TLink>
          ))}
          <TLink curtain to="/#visit" style={{ ['--i' as string]: links.length }} className="mdr-book" onPointerEnter={(e) => aim(e.currentTarget)}>{d.nav.book}</TLink>
        </nav>
      </aside>
    </div>,
    document.body,
  )
}
