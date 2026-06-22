/**
 * Color themes for the Time Timer disk.
 *
 * Each theme is just a set of CSS custom-property overrides applied to :root.
 * The hand-drawn SVG disk reads these --tt-* tokens (see index.css / App.css),
 * so swapping a theme is purely a matter of re-pointing the variables — no
 * component logic changes. This module is the single source of truth: the menu
 * swatches and the applied styles both come from `tokens`.
 *
 * Light-named themes (Cotton Ball White, Pale Shale) also tune the face/ink so
 * the remaining-time slice keeps enough contrast to read at a glance.
 */

export interface ThemeTokens {
  /** The remaining-time slice — the defining color of each theme. */
  '--tt-wedge': string
  /** The disk face fill. */
  '--tt-face': string
  /** Ticks, labels, hub and SVG `currentColor`. */
  '--tt-face-ink': string
  /** The thin ring around the face. */
  '--tt-face-edge': string
  /** Accent for the finished readout / "Time's up!" text. */
  '--tt-accent': string
}

export interface Theme {
  id: string
  label: string
  tokens: ThemeTokens
}

export const THEMES: Theme[] = [
  {
    id: 'classic-red',
    label: 'Classic Red',
    tokens: {
      '--tt-wedge': '#e8413a',
      '--tt-face': '#f4f5f8',
      '--tt-face-ink': '#2a2c34',
      '--tt-face-edge': '#d7d9e0',
      // Track the MD3 primary so the finished text stays scheme-correct.
      '--tt-accent': 'var(--md-sys-color-primary)',
    },
  },
  {
    id: 'dreamsicle-orange',
    label: 'Dreamsicle Orange',
    tokens: {
      '--tt-wedge': '#f47a30',
      '--tt-face': '#fff6ee',
      '--tt-face-ink': '#4a3324',
      '--tt-face-edge': '#f3e3d4',
      '--tt-accent': '#e1611f',
    },
  },
  {
    id: 'cotton-ball-white',
    label: 'Cotton Ball White',
    // A cotton-white slice on a deep slate face so "white" stays legible.
    tokens: {
      '--tt-wedge': '#f4f2ec',
      '--tt-face': '#3a3d44',
      '--tt-face-ink': '#edebe4',
      '--tt-face-edge': '#2e3036',
      '--tt-accent': '#9aa0aa',
    },
  },
  {
    id: 'lake-day-blue',
    label: 'Lake Day Blue',
    tokens: {
      '--tt-wedge': '#3e92c8',
      '--tt-face': '#f2f8fc',
      '--tt-face-ink': '#16384a',
      '--tt-face-edge': '#d9eaf4',
      '--tt-accent': '#2c7db0',
    },
  },
  {
    id: 'pale-shale',
    label: 'Pale Shale',
    // A deeper shale slice on a pale greige face keeps the wedge visible.
    tokens: {
      '--tt-wedge': '#7e7a66',
      '--tt-face': '#f3f2ec',
      '--tt-face-ink': '#3a382e',
      '--tt-face-edge': '#e4e2d8',
      '--tt-accent': '#6f6b57',
    },
  },
  {
    id: 'peony-pink',
    label: 'Peony Pink',
    tokens: {
      '--tt-wedge': '#e86aa0',
      '--tt-face': '#fff4f8',
      '--tt-face-ink': '#4a2236',
      '--tt-face-edge': '#f6dee9',
      '--tt-accent': '#d24e89',
    },
  },
  {
    id: 'fern-green',
    label: 'Fern Green',
    tokens: {
      '--tt-wedge': '#5e9e5a',
      '--tt-face': '#f2f8f1',
      '--tt-face-ink': '#1f3a1d',
      '--tt-face-edge': '#ddebda',
      '--tt-accent': '#4c8a49',
    },
  },
]

export const DEFAULT_THEME_ID = 'classic-red'

/** Look up a theme by id, falling back to the default if it's unknown. */
export function getTheme(id: string | null | undefined): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}
