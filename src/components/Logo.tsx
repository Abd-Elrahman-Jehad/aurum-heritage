/** AURUM mark: a watch bezel with an "A" made of two hands meeting at the pivot. Pure SVG, scales anywhere. */
export default function Logo({ size = 30, className = '' }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="lg-gold" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f3d99a" />
          <stop offset=".55" stopColor="#d6a857" />
          <stop offset="1" stopColor="#a8742f" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="21.2" stroke="url(#lg-gold)" strokeWidth="1.6" />
      <circle cx="24" cy="24" r="17.6" stroke="url(#lg-gold)" strokeWidth=".6" opacity=".55" />
      {/* hour marks */}
      <path d="M24 2.4v3.4M24 42.2v3.4M2.4 24h3.4M42.2 24h3.4" stroke="url(#lg-gold)" strokeWidth="1.6" strokeLinecap="round" />
      {/* the A */}
      <path d="M24 11.5 14.6 35.2M24 11.5l9.4 23.7" stroke="url(#lg-gold)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M18.4 28h11.2" stroke="url(#lg-gold)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="24" cy="11.5" r="2" fill="url(#lg-gold)" />
    </svg>
  )
}
