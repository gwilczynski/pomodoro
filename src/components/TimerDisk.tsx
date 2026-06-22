import { useCallback, useRef } from 'react'
import { describeWedge, polarToCartesian, pointToAngle } from '../lib/arc'
import type { TimerStatus } from '../hooks/useTimer'

const SIZE = 240
const CENTER = SIZE / 2
const FACE_RADIUS = 108
const DISK_RADIUS = 96

interface TimerDiskProps {
  remainingSec: number
  durationSec: number
  /** Full-scale of the dial in minutes (a full circle == maxMinutes). */
  maxMinutes: number
  status: TimerStatus
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
  status,
  onSetDuration,
}: TimerDiskProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const draggable = status === 'idle' || status === 'paused'

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
      const minutes = Math.round((angle / 360) * maxMinutes)
      return minutes * 60
    },
    [durationSec, maxMinutes],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!draggable) return
      e.currentTarget.setPointerCapture(e.pointerId)
      onSetDuration(durationFromEvent(e.clientX, e.clientY))
    },
    [draggable, durationFromEvent, onSetDuration],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!draggable) return
      // Only react while a button/touch is held (capture is active).
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
      onSetDuration(durationFromEvent(e.clientX, e.clientY))
    },
    [draggable, durationFromEvent, onSetDuration],
  )

  // Remaining time as a fraction of the dial's full scale.
  const fraction =
    maxMinutes > 0 ? remainingSec / (maxMinutes * 60) : 0
  const sweepDeg = Math.max(0, Math.min(fraction, 1)) * 360
  const isFull = sweepDeg >= 359.999

  return (
    <svg
      ref={svgRef}
      className={`timer-disk${draggable ? ' timer-disk--draggable' : ''}`}
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
