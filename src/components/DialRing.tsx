/** Engraved dial ring behind the watch: minute track, legend ring and a dashed inner ring (pure SVG, decorative). */
const LEGEND = 'AURUM · HERITAGE 42 · AUTOMATIC · 42 MM · SAPPHIRE CRYSTAL · 18K GOLD · '

export default function DialRing() {
  const ticks = Array.from({ length: 120 }, (_, i) => {
    const major = i % 10 === 0
    const mid = i % 5 === 0
    const len = major ? 26 : mid ? 15 : 8
    return <line key={i} x1="0" y1="-292" x2="0" y2={-(292 - len)} transform={`rotate(${i * 3})`} className={major ? 'is-major' : mid ? 'is-mid' : ''} />
  })
  return (
    <div className="sc-ringwrap" aria-hidden><div className="sc-dialring">
      <svg viewBox="-300 -300 600 600" focusable="false">
        <g className="dr-ticks">{ticks}</g>
        <g className="dr-inner"><circle r="254" className="dr-line" />
        <g className="dr-legend">
          <defs><path id="dr-path" d="M0,-232 a232,232 0 1,1 -0.01,0" /></defs>
          <text><textPath href="#dr-path" textLength="1452" lengthAdjust="spacing">{LEGEND.repeat(2)}</textPath></text>
        </g>
        <circle r="210" className="dr-line dr-dash" /></g>
        <circle r="3" className="dr-pin" />
      </svg>
    </div></div>
  )
}
