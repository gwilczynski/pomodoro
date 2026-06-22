import { useEffect, useId, useRef, useState } from 'react'
import { THEMES } from '../lib/themes'
import IconSettings from './icons/IconSettings'

interface ThemeMenuProps {
  /** Currently active theme id. */
  themeId: string
  /** Called with the chosen theme id. */
  onSelect: (id: string) => void
}

/**
 * A settings gear, fixed top-right, that opens a popover for choosing the disk
 * color theme. Closes on outside click or Escape. The panel uses plain buttons
 * (role=menuitemradio) so the choice is reachable to keyboard and assistive
 * tech and queryable by name in tests.
 */
export function ThemeMenu({ themeId, onSelect }: ThemeMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const menuId = useId()

  // Close on a click anywhere outside the menu, and on Escape.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="theme-menu" ref={rootRef}>
      <button
        type="button"
        className="theme-menu__trigger"
        aria-label="Settings"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <IconSettings />
      </button>

      {open && (
        <div
          className="theme-menu__panel"
          id={menuId}
          role="menu"
          aria-label="Color theme"
        >
          <p className="theme-menu__heading md-typescale-title-small">Color theme</p>
          {THEMES.map((theme) => {
            const selected = theme.id === themeId
            return (
              <button
                key={theme.id}
                type="button"
                className="theme-menu__item"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => {
                  onSelect(theme.id)
                  setOpen(false)
                }}
              >
                <span
                  className="theme-menu__swatch"
                  style={{ background: theme.swatch }}
                  aria-hidden="true"
                />
                <span className="theme-menu__label md-typescale-body-medium">
                  {theme.label}
                </span>
                {selected && (
                  <span className="theme-menu__check" aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
