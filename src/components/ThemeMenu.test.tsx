import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeMenu } from './ThemeMenu'

function setup(overrides: Partial<React.ComponentProps<typeof ThemeMenu>> = {}) {
  const props = {
    themeId: 'classic-red',
    onSelect: vi.fn(),
    ...overrides,
  }
  render(<ThemeMenu {...props} />)
  return props
}

describe('ThemeMenu', () => {
  beforeEach(() => vi.clearAllMocks())

  it('keeps the theme list hidden until the gear is opened', () => {
    setup()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens a menu of every theme when the gear is clicked', async () => {
    setup()
    await userEvent.click(screen.getByRole('button', { name: /settings/i }))
    expect(screen.getByRole('menu', { name: /color theme/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitemradio', { name: /lake day blue/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitemradio', { name: /fern green/i })).toBeInTheDocument()
  })

  it('marks the active theme as checked', async () => {
    setup({ themeId: 'peony-pink' })
    await userEvent.click(screen.getByRole('button', { name: /settings/i }))
    expect(
      screen.getByRole('menuitemradio', { name: /peony pink/i }),
    ).toHaveAttribute('aria-checked', 'true')
  })

  it('selects a theme and closes the menu', async () => {
    const props = setup()
    await userEvent.click(screen.getByRole('button', { name: /settings/i }))
    await userEvent.click(
      screen.getByRole('menuitemradio', { name: /dreamsicle orange/i }),
    )
    expect(props.onSelect).toHaveBeenCalledWith('dreamsicle-orange')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes on Escape without selecting', async () => {
    const props = setup()
    await userEvent.click(screen.getByRole('button', { name: /settings/i }))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(props.onSelect).not.toHaveBeenCalled()
  })
})
