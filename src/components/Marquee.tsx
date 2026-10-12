import { useApp } from '../lib/state'

export default function Marquee() {
  const { d } = useApp()
  const row = [...d.marquee, ...d.marquee]
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <div className="marquee-row" key={k}>
            {row.map((t, i) => (
              <span key={`${k}-${i}`}>{t}<i /></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
