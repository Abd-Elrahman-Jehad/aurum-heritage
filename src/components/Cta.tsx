import { useRef, useState } from 'react'
import { useApp } from '../lib/state'
import { useReveal } from '../lib/useReveal'
import { CONTACT_EMAIL } from '../lib/config'
import Rich from './Rich'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function Cta() {
  const { d, lang } = useApp()
  const ref = useRef<HTMLElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const opened = useRef(Date.now())
  const [f, setF] = useState({ name: '', email: '', message: '' })
  useReveal(ref, [lang])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    if ((form.elements.namedItem('_honey') as HTMLInputElement | null)?.value) return // spam trap
    // bots submit instantly and repeatedly: a human needs a moment, and one message every 30 s is plenty
    if (Date.now() - opened.current < 2500) return
    let last = 0
    try { last = Number(sessionStorage.getItem('aurum-sent') || 0) } catch { /* private mode */ }
    if (Date.now() - last < 30000) { setStatus('error'); return }
    const email = f.email.trim().slice(0, 120)
    if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(email)) { setStatus('error'); return }
    setStatus('sending')
    try {
      // FormSubmit forwards the message to CONTACT_EMAIL (the first message asks the owner to confirm the address once).
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: f.name.trim().slice(0, 80) || '—',
          email,
          message: f.message.trim().slice(0, 2000) || 'Private viewing request (no message).',
          page: location.href,
          language: lang,
          _replyto: email,
          _subject: `AURUM — viewing request from ${f.name || f.email}`,
          _template: 'table',
          _captcha: 'false',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data.success === 'false' || data.success === false) throw new Error('send failed')
      setStatus('sent')
      try { sessionStorage.setItem('aurum-sent', String(Date.now())) } catch { /* ignore */ }
    } catch {
      setStatus('error')
    }
  }

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('AURUM — viewing request')}&body=${encodeURIComponent(`${f.message}\n\n${f.name}\n${f.email}`)}`

  return (
    <section ref={ref} className="sec cta" id="visit" data-own-reveal>
      <div className="cta-in">
        <p className="eyebrow" data-r>{d.cta.eyebrow}</p>
        <h2 className="display sm" data-r><Rich text={d.cta.title} /></h2>
        {status === 'sent' ? (
          <p className="cta-ok" role="status">{d.cta.thanks}</p>
        ) : (
          <form className="cta-form" onSubmit={submit} data-r>
            <div className="cta-row">
              <input name="name" type="text" maxLength={80} autoComplete="name" placeholder={d.cta.name} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-label={d.cta.name} />
              <input name="email" type="email" required maxLength={120} autoComplete="email" placeholder={d.cta.placeholder} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} aria-label="Email address" />
            </div>
            <textarea name="message" rows={3} maxLength={2000} placeholder={d.cta.message} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} aria-label={d.cta.message} />
            <input name="_honey" type="text" tabIndex={-1} autoComplete="off" className="cta-honey" aria-hidden />
            <button className="btn" type="submit" disabled={status === 'sending'}>{status === 'sending' ? d.cta.sending : d.cta.button}</button>
            {status === 'error' && (
              <p className="cta-err" role="alert">{d.cta.error} <a href={mailto}>{CONTACT_EMAIL}</a></p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
