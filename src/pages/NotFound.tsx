import { useApp } from '../lib/state'
import { TLink } from '../lib/nav'

export default function NotFound() {
  const { d } = useApp()
  const p = d.pages.notFound
  return (
    <section className="ph ph-short nf">
      <div className="ph-in">
        <p className="eyebrow">404</p>
        <h1 className="display">{p.title}</h1>
        <p className="lede">{p.body}</p>
        <TLink to="/" className="btn">{p.back}</TLink>
      </div>
    </section>
  )
}
