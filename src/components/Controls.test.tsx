import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Controls } from './Controls'

function setup(overrides: Partial<React.ComponentProps<typeof Controls>> = {}) {
  const props = {
    status: 'idle' as const,
    remainingSec: 1500,
    durationSec: 1500,
    onStart: vi.fn(),
    onPause: vi.fn(),
    onReset: vi.fn(),
    onSetDuration: vi.fn(),
    ...overrides,
  }
  render(<Controls {...props} />)
  return props
}

describe('Controls', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows the duration as MM:SS while idle', () => {
    setup({ durationSec: 1500 })
    expect(screen.getByText('25:00')).toBeInTheDocument()
  })

  it('fires onStart when Start is clicked', async () => {
    const props = setup()
    await userEvent.click(screen.getByRole('button', { name: 'Start' }))
    expect(props.onStart).toHaveBeenCalledTimes(1)
  })

  it('shows Pause while running and fires onPause', async () => {
    const props = setup({ status: 'running', remainingSec: 1490 })
    await userEvent.click(screen.getByRole('button', { name: 'Pause' }))
    expect(props.onPause).toHaveBeenCalledTimes(1)
  })

  it('labels the start button Resume when paused', () => {
    setup({ status: 'paused', remainingSec: 1000 })
    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument()
  })

  it('presets call onSetDuration with the right seconds', async () => {
    const props = setup()
    await userEvent.click(screen.getByRole('button', { name: '25m' }))
    expect(props.onSetDuration).toHaveBeenCalledWith(1500)
  })

  it('steppers nudge the duration by a minute', async () => {
    const props = setup({ durationSec: 600 })
    await userEvent.click(
      screen.getByRole('button', { name: 'Increase by one minute' }),
    )
    expect(props.onSetDuration).toHaveBeenCalledWith(660)
  })

  it('disables preset and stepper buttons while running', () => {
    setup({ status: 'running' })
    expect(screen.getByRole('button', { name: '25m' })).toBeDisabled()
    expect(
      screen.getByRole('button', { name: 'Increase by one minute' }),
    ).toBeDisabled()
  })

  it('announces when time is up', () => {
    setup({ status: 'finished', remainingSec: 0 })
    expect(screen.getByText(/time.s up/i)).toBeInTheDocument()
  })
})
