/**
 * Play a short two-tone chime using the Web Audio API — no audio asset needed.
 * Silently does nothing in environments without AudioContext (e.g. tests).
 */
export function playBeep(): void {
  const Ctor =
    typeof window !== 'undefined'
      ? window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      : undefined
  if (!Ctor) return

  try {
    const ctx = new Ctor()
    const now = ctx.currentTime
    const notes = [880, 1108.73] // A5 then ~C#6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const start = now + i * 0.18
      const end = start + 0.16
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.3, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, end)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(end)
    })
    // Release the context shortly after the sound finishes.
    setTimeout(() => ctx.close().catch(() => {}), 800)
  } catch {
    // Autoplay policy or unsupported context — fail quietly.
  }
}
