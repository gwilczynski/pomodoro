import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTheme } from './useTheme'
import { getTheme } from '../lib/themes'

const read = (token: string) =>
  document.documentElement.style.getPropertyValue(token)

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('style')
  })

  it('applies the default theme tokens to :root', () => {
    renderHook(() => useTheme())
    expect(read('--tt-wedge')).toBe(getTheme('classic-red').tokens['--tt-wedge'])
  })

  it('applies and persists a newly selected theme', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setTheme('lake-day-blue'))
    expect(result.current.themeId).toBe('lake-day-blue')
    expect(read('--tt-wedge')).toBe(getTheme('lake-day-blue').tokens['--tt-wedge'])
    expect(localStorage.getItem('tt-theme')).toBe('lake-day-blue')
  })

  it('restores the saved theme on mount', () => {
    localStorage.setItem('tt-theme', 'fern-green')
    const { result } = renderHook(() => useTheme())
    expect(result.current.themeId).toBe('fern-green')
    expect(read('--tt-wedge')).toBe(getTheme('fern-green').tokens['--tt-wedge'])
  })

  it('falls back to the default for an unknown saved id', () => {
    localStorage.setItem('tt-theme', 'bogus')
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setTheme('also-bogus'))
    expect(result.current.themeId).toBe('classic-red')
  })
})
