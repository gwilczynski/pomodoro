import { describe, it, expect } from 'vitest'
import { clamp, formatTime } from './time'

describe('clamp', () => {
  it('returns the value when inside the range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })

  it('clamps below the minimum', () => {
    expect(clamp(-3, 0, 10)).toBe(0)
  })

  it('clamps above the maximum', () => {
    expect(clamp(42, 0, 10)).toBe(10)
  })
})

describe('formatTime', () => {
  it('zero-pads minutes and seconds', () => {
    expect(formatTime(0)).toBe('00:00')
    expect(formatTime(5)).toBe('00:05')
    expect(formatTime(65)).toBe('01:05')
  })

  it('rounds fractional seconds up', () => {
    expect(formatTime(0.1)).toBe('00:01')
    expect(formatTime(59.9)).toBe('01:00')
  })

  it('clamps negative input to 00:00', () => {
    expect(formatTime(-10)).toBe('00:00')
  })

  it('switches to H:MM:SS past an hour', () => {
    expect(formatTime(3600)).toBe('1:00:00')
    expect(formatTime(3661)).toBe('1:01:01')
  })
})
