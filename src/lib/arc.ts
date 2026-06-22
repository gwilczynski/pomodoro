/**
 * SVG arc geometry for the Time Timer disk.
 *
 * Angle convention: 0° points at 12 o'clock (top) and increases CLOCKWISE.
 *   0°   -> top
 *   90°  -> 3 o'clock
 *   180° -> bottom
 *   270° -> 9 o'clock
 */

export interface Point {
  x: number
  y: number
}

/**
 * Convert a polar coordinate (angle in degrees, 0° at top, clockwise) into an
 * SVG-space cartesian point around a center.
 */
export function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): Point {
  // Shift by -90° so 0° lands at the top instead of 3 o'clock. SVG's y-axis
  // points down, which makes increasing angles sweep clockwise as desired.
  const a = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a),
  }
}

/**
 * Build the SVG path for a pie-slice wedge starting at the top (12 o'clock)
 * and sweeping clockwise by `sweepDeg` degrees.
 *
 * Callers must handle the full-circle case (`sweepDeg >= 360`) separately by
 * rendering a plain <circle>, because an SVG arc whose start and end points
 * coincide draws nothing. This helper clamps such input to just under 360° as
 * a safety net, but a real full circle should not be drawn as a wedge.
 */
export function describeWedge(
  cx: number,
  cy: number,
  r: number,
  sweepDeg: number,
): string {
  const clamped = Math.max(0, Math.min(sweepDeg, 359.999))
  const start = polarToCartesian(cx, cy, r, 0)
  const end = polarToCartesian(cx, cy, r, clamped)
  const largeArc = clamped > 180 ? 1 : 0
  // sweep flag 1 = positive-angle (clockwise in SVG's down-y space).
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ')
}

/**
 * Convert a pointer position relative to the disk center into an angle in
 * degrees using the same convention as the rest of this module (0° at top,
 * clockwise, range [0, 360)).
 */
export function pointToAngle(cx: number, cy: number, px: number, py: number): number {
  const dx = px - cx
  const dy = py - cy
  // atan2 measures from the +x axis counter-clockwise in math space; convert to
  // "from top, clockwise" by adding 90° and accounting for SVG's flipped y.
  let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90
  deg = ((deg % 360) + 360) % 360
  return deg
}
