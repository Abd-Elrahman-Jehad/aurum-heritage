/** Tiny synthesized tick/tock (no audio files). Always on (after the first user gesture). */
let ctx: AudioContext | null = null
let flip = false
let noise: AudioBuffer | null = null

/** Sound is always available: browsers only allow audio after a user gesture, so the first tap/click/key unlocks it. */
function ensure() {
  if (ctx) return true
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!AC) return false
  ctx = new AC()
  noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.04), ctx.sampleRate)
  const d = noise.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3)
  return true
}
export function unlockAudio() {
  if (ensure()) void ctx!.resume()
}
if (typeof window !== 'undefined') {
  const once = () => {
    unlockAudio()
    ;['pointerdown', 'keydown', 'touchend'].forEach((e) => window.removeEventListener(e, once))
  }
  ;['pointerdown', 'keydown', 'touchend'].forEach((e) => window.addEventListener(e, once, { passive: true }))
}

/** A single mechanical click. `speed` > 1 makes it higher and shorter. */
export function tick(speed = 1, volume = 0.16) {
  if (!ctx || !noise || ctx.state !== 'running') return
  const t = ctx.currentTime
  flip = !flip
  const src = ctx.createBufferSource()
  src.buffer = noise
  src.playbackRate.value = flip ? 1.1 * speed : 0.85 * speed
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = (flip ? 3400 : 2300) * Math.min(speed, 1.6)
  bp.Q.value = 1.4
  const g = ctx.createGain()
  g.gain.setValueAtTime(volume, t)
  g.gain.exponentialRampToValueAtTime(0.0008, t + 0.05)
  src.connect(bp).connect(g).connect(ctx.destination)
  src.start(t)
}
