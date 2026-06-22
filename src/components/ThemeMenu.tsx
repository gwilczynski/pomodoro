import { useEffect, useId, useRef, useState } from 'react'
import { THEMES } from '../lib/themes'

interface ThemeMenuProps {
  /** Currently active theme id. */
  themeId: string
  /** Called with the chosen theme id. */
  onSelect: (id: string) => void
}

/** A cog drawn inline so we don't pull in an icon font (and avoid its flash). */
function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="24" height="24">
      <path
        fill="currentColor"
        d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm7.4-2a7.6 7.6 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2-1.2L14.5 2h-4l-.4 2.6a7.5 7.5 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.7 7.7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1c.6.5 1.3.9 2 1.2l.4 2.6h4l.4-2.6c.7-.3 1.4-.7 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z"
      />
    </svg>
  )
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
        <GearIcon />
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
                  style={{ background: theme.tokens['--tt-wedge'] }}
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
