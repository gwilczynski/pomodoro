import { useCallback, useRef } from 'react'
import { describeWedge, polarToCartesian, pointToAngle } from '../lib/arc'

const SIZE = 240
const CENTER = SIZE / 2
const FACE_RADIUS = 108
const DISK_RADIUS = 96

interface TimerDiskProps {
  remainingSec: number
  durationSec: number
  /** Full-scale of the dial in minutes (a full circle == maxMinutes). */
  maxMinutes: number
  /** Called with a new duration in seconds when the user drags the dial. */
  onSetDuration: (seconds: number) => void
}

/** Tick marks every 5 minutes around the rim, with labels. */
function Ticks({ maxMinutes }: { maxMinutes: number }) {
  const ticks = []
  for (let m = 0; m < maxMinutes; m += 5) {
    const angle = (m / maxMinutes) * 360
    const isMajor = m % 15 === 0
    const outer = polarToCartesian(CENTER, CENTER, FACE_RADIUS, angle)
    const inner = polarToCartesian(
      CENTER,
      CENTER,
      FACE_RADIUS - (isMajor ? 12 : 7),
      angle,
    )
    ticks.push(
      <line
        key={`t-${m}`}
        x1={outer.x}
        y1={outer.y}
        x2={inner.x}
        y2={inner.y}
        stroke="currentColor"
        strokeWidth={isMajor ? 2 : 1}
        strokeLinecap="round"
        opacity={isMajor ? 0.9 : 0.45}
      />,
    )
    if (isMajor) {
      const label = polarToCartesian(CENTER, CENTER, FACE_RADIUS - 26, angle)
      ticks.push(
        <text
          key={`l-${m}`}
          x={label.x}
          y={label.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={11}
          fill="currentColor"
          opacity={0.7}
        >
          {m}
        </text>,
      )
    }
  }
  return <g className="timer-disk__ticks">{ticks}</g>
}

export function TimerDisk({
  remainingSec,
  durationSec,
  maxMinutes,
  onSetDuration,
}: TimerDiskProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  // Last minutes read during the current drag, used to keep a single drag from
  // jumping across the 12 o'clock seam (where 0 and maxMinutes coincide).
  const lastMinutesRef = useRef<number | null>(null)

  // Map a client (screen) point onto the SVG's internal viewBox coordinates,
  // then to a duration in seconds, snapped to whole minutes.
  const durationFromEvent = useCallback(
    (clientX: number, clientY: number): number => {
      const svg = svgRef.current
      if (!svg) return durationSec
      const rect = svg.getBoundingClientRect()
      const x = ((clientX - rect.left) / rect.width) * SIZE
      const y = ((clientY - rect.top) / rect.height) * SIZE
      const angle = pointToAngle(CENTER, CENTER, x, y)
      let minutes = Math.round((angle / 360) * maxMinutes)

      // The dial's 0 and maxMinutes share the 12 o'clock point, so a hair of
      // movement across the top would otherwise flip the value between the two
      // extremes. Clamp at the seam instead: a single drag can't leap across
      // 12 o'clock — it stays pinned to whichever end it approached from.
      const prev = lastMinutesRef.current
      if (prev != null) {
        if (prev - minutes > maxMinutes / 2) minutes = maxMinutes
        else if (minutes - prev > maxMinutes / 2) minutes = 0
      }
      lastMinutesRef.current = minutes
      return minutes * 60
    },
    [durationSec, maxMinutes],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      // Fresh drag: start with no seam guard so the first tap reads as-is.
      lastMinutesRef.current = null
      onSetDuration(durationFromEvent(e.clientX, e.clientY))
    },
    [durationFromEvent, onSetDuration],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      // Only react while a button/touch is held (capture is active).
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
      onSetDuration(durationFromEvent(e.clientX, e.clientY))
    },
    [durationFromEvent, onSetDuration],
  )

  // Remaining time as a fraction of the dial's full scale.
  const fraction =
    maxMinutes > 0 ? remainingSec / (maxMinutes * 60) : 0
  const sweepDeg = Math.max(0, Math.min(fraction, 1)) * 360
  const isFull = sweepDeg >= 359.999

  return (
    <svg
      ref={svgRef}
      className="timer-disk timer-disk--draggable"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={`Time timer, ${Math.round(remainingSec)} seconds remaining`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      {/* Face */}
      <circle
        cx={CENTER}
        cy={CENTER}
        r={FACE_RADIUS}
        className="timer-disk__face"
      />

      {/* Remaining-time wedge (or a full disk when at max). */}
      {remainingSec > 0 &&
        (isFull ? (
          <circle
            cx={CENTER}
            cy={CENTER}
            r={DISK_RADIUS}
            className="timer-disk__wedge"
            data-testid="timer-wedge-full"
          />
        ) : (
          <path
            d={describeWedge(CENTER, CENTER, DISK_RADIUS, sweepDeg)}
            className="timer-disk__wedge"
            data-testid="timer-wedge"
          />
        ))}

      <Ticks maxMinutes={maxMinutes} />

      {/* Center hub */}
      <circle cx={CENTER} cy={CENTER} r={7} className="timer-disk__hub" />
    </svg>
  )
}
