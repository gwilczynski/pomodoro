import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTimer } from './useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts idle at the configured duration', () => {
    const { result } = renderHook(() => useTimer({ initialSeconds: 60 }))
    expect(result.current.status).toBe('idle')
    expect(result.current.durationSec).toBe(60)
    expect(result.current.remainingSec).toBe(60)
  })

  it('counts down while running', () => {
    const { result } = renderHook(() =>
      useTimer({ initialSeconds: 60, tickMs: 200 }),
    )
    act(() => result.current.start())
    expect(result.current.status).toBe('running')

    act(() => {
      vi.advanceTimersByTime(10_000)
    })
    expect(result.current.remainingSec).toBeCloseTo(50, 0)
  })

  it('freezes remaining time on pause and continues on resume', () => {
    const { result } = renderHook(() =>
      useTimer({ initialSeconds: 60, tickMs: 200 }),
    )
    act(() => result.current.start())
    act(() => {
      vi.advanceTimersByTime(20_000)
    })
    act(() => result.current.pause())
    expect(result.current.status).toBe('paused')
    const frozen = result.current.remainingSec
    expect(frozen).toBeCloseTo(40, 0)

    // Time passing while paused must not change the clock.
    act(() => {
      vi.advanceTimersByTime(5_000)
    })
    expect(result.current.remainingSec).toBe(frozen)

    act(() => result.current.start())
    expect(result.current.status).toBe('running')
    act(() => {
      vi.advanceTimersByTime(10_000)
    })
    expect(result.current.remainingSec).toBeCloseTo(30, 0)
  })

  it('transitions to finished and fires onFinish at zero', () => {
    const onFinish = vi.fn()
    const { result } = renderHook(() =>
      useTimer({ initialSeconds: 5, tickMs: 200, onFinish }),
    )
    act(() => result.current.start())
    act(() => {
      vi.advanceTimersByTime(6_000)
    })
    expect(result.current.status).toBe('finished')
    expect(result.current.remainingSec).toBe(0)
    expect(onFinish).toHaveBeenCalledTimes(1)
  })

  it('reset restores the full duration and returns to idle', () => {
    const { result } = renderHook(() =>
      useTimer({ initialSeconds: 60, tickMs: 200 }),
    )
    act(() => result.current.start())
    act(() => {
      vi.advanceTimersByTime(15_000)
    })
    act(() => result.current.reset())
    expect(result.current.status).toBe('idle')
    expect(result.current.remainingSec).toBe(60)
  })

  it('setDuration updates duration and clock while idle', () => {
    const { result } = renderHook(() => useTimer({ initialSeconds: 60 }))
    act(() => result.current.setDuration(120))
    expect(result.current.durationSec).toBe(120)
    expect(result.current.remainingSec).toBe(120)
  })

  it('ignores setDuration while running', () => {
    const { result } = renderHook(() =>
      useTimer({ initialSeconds: 60, tickMs: 200 }),
    )
    act(() => result.current.start())
    act(() => result.current.setDuration(120))
    expect(result.current.durationSec).toBe(60)
    expect(result.current.status).toBe('running')
  })
})
