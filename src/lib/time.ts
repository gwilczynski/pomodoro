/** Clamp a number into the inclusive range [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}

/**
 * Format a number of seconds as "MM:SS" (or "HH:MM:SS" once it reaches an
 * hour). Negative inputs are clamped to zero, and fractional seconds are
 * rounded up so a readout never shows 00:00 while time still remains.
 */
export function formatTime(totalSeconds: number): string {
  const secs = Math.max(0, Math.ceil(totalSeconds))
  const hours = Math.floor(secs / 3600)
  const minutes = Math.floor((secs % 3600) / 60)
  const seconds = secs % 60

  const pad = (n: number) => String(n).padStart(2, '0')

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`
  }
  return `${pad(minutes)}:${pad(seconds)}`
}
