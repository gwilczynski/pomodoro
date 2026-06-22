import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Controls } from './Controls'

// The controls render @material/web custom elements (md-filled-button,
// md-text-button, md-suggestion-chip). These upgrade under jsdom and respond
// to clicks, but their ARIA roles live inside shadow DOM, so Testing Library's
// getByRole('button') can't see them — we query by visible text instead.

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
    await userEvent.click(screen.getByText('Start'))
    expect(props.onStart).toHaveBeenCalledTimes(1)
  })

  it('shows Pause while running and fires onPause', async () => {
    const props = setup({ status: 'running', remainingSec: 1490 })
    await userEvent.click(screen.getByText('Pause'))
    expect(props.onPause).toHaveBeenCalledTimes(1)
  })

  it('labels the start button Resume when paused', () => {
    setup({ status: 'paused', remainingSec: 1000 })
    expect(screen.getByText('Resume')).toBeInTheDocument()
  })

  it('does not fire onStart when the button is disabled', async () => {
    const props = setup({ status: 'idle', durationSec: 0, remainingSec: 0 })
    await userEvent.click(screen.getByText('Start'))
    expect(props.onStart).not.toHaveBeenCalled()
  })

  it('presets call onSetDuration with the right seconds', async () => {
    const props = setup()
    await userEvent.click(screen.getByText('25m'))
    expect(props.onSetDuration).toHaveBeenCalledWith(1500)
  })

  it('presets stay active while running so the clock can be re-set', async () => {
    const props = setup({ status: 'running', remainingSec: 1490 })
    const preset = screen.getByText('25m')
    expect(preset).not.toHaveAttribute('disabled')
    await userEvent.click(preset)
    expect(props.onSetDuration).toHaveBeenCalledWith(1500)
  })

  it('announces when time is up', () => {
    setup({ status: 'finished', remainingSec: 0 })
    expect(screen.getByText(/time.s up/i)).toBeInTheDocument()
  })
})
