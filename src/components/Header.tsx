import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useApp } from '../lib/state'
import { TLink } from '../lib/nav'
import Logo from './Logo'
import MenuDrawer from './MenuDrawer'

export default function Header() {
  const { d, lang, setLang, entered } = useApp()
  const { pathname } = useLocation()
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const last = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > last.current && y > 240 && !open)
      last.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  // a watch's detail page belongs to the Collection section
  const section = pathname.startsWith('/watch/') ? '/collection' : pathname
  const links = [
    { to: '/', label: d.nav.home },
    { to: '/anatomy', label: d.nav.anatomy },
    { to: '/collection', label: d.nav.details },
    { to: '/pricing', label: d.nav.pricing },
  ]

  return (
    <header className={`hdr ${entered ? 'is-in' : ''} ${hidden ? 'is-hidden' : ''} ${open ? 'is-open' : ''}`}>
      <TLink curtain to="/" className="brand" aria-label="AURUM">
        <Logo size={30} />
        <span className="brand-word">AURUM</span>
      </TLink>

      <nav className="nav" aria-label="Primary">
        {links.map((l) => (
          <TLink curtain key={l.to} to={l.to} className={section === l.to ? 'is-active' : ''}>{l.label}</TLink>
        ))}
      </nav>

      <div className="hdr-actions">
        <button className="lang-btn" type="button" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}>{d.ui.lang}</button>
        <TLink curtain to="/#visit" className="btn btn-sm hide-md">{d.nav.book}</TLink>
        <button className="burger" type="button" aria-label={d.ui.menu} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <i /><i />
        </button>
      </div>

      <MenuDrawer open={open} links={links} active={section} onClose={() => setOpen(false)} />
    </header>
  )
}
