import { useRef } from 'react'
import { useApp } from '../lib/state'
import { useReveal } from '../lib/useReveal'
import { TLink } from '../lib/nav'
import { CONTACT_EMAIL, SOCIALS } from '../lib/config'
import Logo from './Logo'

export default function Footer() {
  const { d, lang } = useApp()
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, [lang])
  return (
    <footer className="ftr" ref={ref} data-own-reveal>
      <div className="ftr-mark" aria-hidden="true">AURUM</div>
      <div className="ftr-top">
        <div className="ftr-brand" data-r>
          <TLink to="/" curtain className="ftr-logo" aria-label="AURUM">
            <Logo size={28} />
            <span className="brand-word">AURUM</span>
          </TLink>
          <p>{d.footer.tagline}</p>
        </div>
        <nav className="ftr-col" data-r aria-label={d.footer.explore}>
          <h4>{d.footer.explore}</h4>
          <TLink to="/" curtain>{d.nav.home}</TLink>
          <TLink to="/anatomy" curtain>{d.nav.anatomy}</TLink>
          <TLink to="/collection" curtain>{d.nav.details}</TLink>
          <TLink to="/pricing" curtain>{d.nav.pricing}</TLink>
        </nav>
        <div className="ftr-col" data-r>
          <h4>{d.footer.contact}</h4>
          <a href={`mailto:${CONTACT_EMAIL}`} className="ftr-mail">{CONTACT_EMAIL}</a>
          <TLink to="/#visit">{d.nav.book}</TLink>
        </div>
        <div className="ftr-col" data-r>
          <h4>{d.footer.follow}</h4>
          {SOCIALS.map((s) => <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a>)}
        </div>
      </div>
      <div className="ftr-bot" data-r>
        <span>© {new Date().getFullYear()} AURUM. {d.footer.rights} · <TLink to="/about">{lang === 'ar' ? 'تصميم وتطوير عبد الرحمن جهاد الدشت' : 'Design & code by Abdelrahman Jehad Aldasht'}</TLink></span>
        <span className="ftr-legal"><TLink to="/legal#privacy">{d.footer.privacy}</TLink> · <TLink to="/legal#terms">{d.footer.terms}</TLink></span>
      </div>
    </footer>
  )
}
