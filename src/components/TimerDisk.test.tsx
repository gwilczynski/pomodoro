import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { TimerDisk } from './TimerDisk'

describe('TimerDisk', () => {
  const baseProps = {
    maxMinutes: 60,
    onSetDuration: vi.fn(),
  }

  it('renders a full disk when remaining equals the dial maximum', () => {
    render(
      <TimerDisk
        {...baseProps}
        durationSec={60 * 60}
        remainingSec={60 * 60}
      />,
    )
    expect(screen.getByTestId('timer-wedge-full')).toBeInTheDocument()
  })

  it('renders a wedge path partway through', () => {
    render(
      <TimerDisk
        {...baseProps}
        durationSec={60 * 60}
        remainingSec={30 * 60}
      />,
    )
    const wedge = screen.getByTestId('timer-wedge')
    expect(wedge).toBeInTheDocument()
    // Half of a 60-minute dial == 180° sweep, which is the largeArc threshold.
    expect(wedge.getAttribute('d')).toMatch(/^M /)
  })

  it('draws nothing colored when no time remains', () => {
    render(
      <TimerDisk {...baseProps} durationSec={60 * 60} remainingSec={0} />,
    )
    expect(screen.queryByTestId('timer-wedge')).not.toBeInTheDocument()
    expect(screen.queryByTestId('timer-wedge-full')).not.toBeInTheDocument()
  })

  it('exposes remaining time to assistive tech', () => {
    render(
      <TimerDisk {...baseProps} durationSec={600} remainingSec={300} />,
    )
    expect(
      screen.getByRole('img', { name: /300 seconds remaining/i }),
    ).toBeInTheDocument()
  })

  it('stays draggable after the timer finishes (zero remaining)', () => {
    const onSetDuration = vi.fn()
    render(
      <TimerDisk
        {...baseProps}
        onSetDuration={onSetDuration}
        durationSec={25 * 60}
        remainingSec={0}
      />,
    )
    const dial = screen.getByRole('img')
    // jsdom doesn't implement pointer capture — stub it so the handler runs.
    dial.setPointerCapture = vi.fn()
    fireEvent.pointerDown(dial, { pointerId: 1, clientX: 120, clientY: 20 })
    // The dial accepted the drag and pushed a new duration up — without the
    // fix, a 'finished' timer ignored pointer input entirely.
    expect(onSetDuration).toHaveBeenCalled()
  })
})
