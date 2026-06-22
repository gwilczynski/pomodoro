import { useCallback, useEffect, useRef, useState } from 'react'
import { clamp } from '../lib/time'

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished'

export interface Timer {
  status: TimerStatus
  /** The configured duration in seconds. */
  durationSec: number
  /** Seconds left on the clock (never negative). */
  remainingSec: number
  /** Set a new duration; ignored while running. Resets the clock to idle. */
  setDuration: (seconds: number) => void
  /** Start from idle/finished, or resume from paused. */
  start: () => void
  /** Freeze the clock without losing remaining time. */
  pause: () => void
  /** Stop and restore the full configured duration. */
  reset: () => void
}

export interface UseTimerOptions {
  /** Initial duration in seconds. */
  initialSeconds?: number
  /** How often the clock recomputes remaining time, in ms. */
  tickMs?: number
  /** Play a short beep when the timer reaches zero. */
  onFinish?: () => void
}

/**
 * Drift-free countdown engine.
 *
 * Rather than decrementing a counter on every tick (which accumulates error),
 * we record the wall-clock timestamp at which the timer should end and derive
 * the remaining time from `endTime - Date.now()` on each tick. Pausing simply
 * snapshots the remaining time; resuming recomputes a fresh end timestamp.
 */
export function useTimer(options: UseTimerOptions = {}): Timer {
  const { initialSeconds = 25 * 60, tickMs = 200, onFinish } = options

  const [status, setStatus] = useState<TimerStatus>('idle')
  const [durationSec, setDurationSec] = useState(initialSeconds)
  const [remainingSec, setRemainingSec] = useState(initialSeconds)

  const endTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // Keep the latest onFinish without re-subscribing the interval to it.
  const onFinishRef = useRef(onFinish)
  useEffect(() => {
    onFinishRef.current = onFinish
  }, [onFinish])

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTick = useCallback(() => {
    clearTick()
    intervalRef.current = setInterval(() => {
      const endTime = endTimeRef.current
      if (endTime === null) return
      const left = (endTime - Date.now()) / 1000
      if (left <= 0) {
        clearTick()
        endTimeRef.current = null
        setRemainingSec(0)
        setStatus('finished')
        onFinishRef.current?.()
      } else {
        setRemainingSec(left)
      }
    }, tickMs)
  }, [clearTick, tickMs])

  const start = useCallback(() => {
    setStatus((prev) => {
      if (prev === 'running') return prev
      // Resume from the frozen remaining time, or start a fresh full duration.
      const fromSeconds =
        prev === 'paused' ? remainingSec : durationSec
      const seconds = fromSeconds > 0 ? fromSeconds : durationSec
      if (seconds <= 0) return prev
      setRemainingSec(seconds)
      endTimeRef.current = Date.now() + seconds * 1000
      startTick()
      return 'running'
    })
  }, [durationSec, remainingSec, startTick])

  const pause = useCallback(() => {
    setStatus((prev) => {
      if (prev !== 'running') return prev
      clearTick()
      const endTime = endTimeRef.current
      if (endTime !== null) {
        setRemainingSec(Math.max(0, (endTime - Date.now()) / 1000))
      }
      endTimeRef.current = null
      return 'paused'
    })
  }, [clearTick])

  const reset = useCallback(() => {
    clearTick()
    endTimeRef.current = null
    setRemainingSec(durationSec)
    setStatus('idle')
  }, [clearTick, durationSec])

  const setDuration = useCallback(
    (seconds: number) => {
      const next = clamp(Math.round(seconds), 0, 100 * 60)
      setStatus((prev) => {
        setDurationSec(next)
        setRemainingSec(next)
        // While running, keep counting down: restart from the new duration
        // rather than stopping. A drag to zero falls through to idle.
        if (prev === 'running' && next > 0) {
          endTimeRef.current = Date.now() + next * 1000
          startTick()
          return 'running'
        }
        clearTick()
        endTimeRef.current = null
        return 'idle'
      })
    },
    [clearTick, startTick],
  )

  // Tidy up the interval if the component unmounts mid-countdown.
  useEffect(() => clearTick, [clearTick])

  return {
    status,
    durationSec,
    remainingSec,
    setDuration,
    start,
    pause,
    reset,
  }
}
