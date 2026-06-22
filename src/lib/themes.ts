/**
 * Color themes for the whole app.
 *
 * A theme is a small palette mapped onto CSS custom properties applied to
 * :root: the MD3 --md-sys-color-* roles (page background, text, surfaces,
 * accent — read by the title, hint, chips and menu) and the brand --tt-* roles
 * (the hand-drawn SVG disk). Swapping a theme is purely re-pointing variables;
 * no component logic changes. This module is the single source of truth — the
 * menu swatches and the applied styles both come from here.
 *
 * Inline styles set by `applyTheme` win over the stylesheet (and its
 * prefers-color-scheme block), so an applied theme fully governs the look
 * regardless of the OS setting.
 */

interface Palette {
  /** Page background. */
  bg: string
  /** Elevated surface (the menu panel). */
  surface: string
  /** Hover/state-layer surface. */
  surfaceHi: string
  /** Primary text (title, readout, menu items). */
  text: string
  /** Secondary text (hint, gear, chip labels). */
  textMuted: string
  /** Borders / dividers (chip outlines). */
  outline: string
  /** Accent: focus rings, checkmark, finished readout. */
  accent: string
  /** Text drawn on the accent color. */
  onAccent: string
  /** The remaining-time slice — the defining color of the theme. */
  wedge: string
  /** Disk face fill. */
  face: string
  /** Ticks, labels, hub, SVG currentColor. */
  faceInk: string
  /** Thin ring around the face. */
  faceEdge: string
}

/** Expand a compact palette into the full set of :root custom properties. */
function tokens(p: Palette): Record<string, string> {
  return {
    // ---- MD3 system colors (page chrome: bg, text, surfaces, accent) ----
    '--md-sys-color-background': p.bg,
    '--md-sys-color-on-background': p.text,
    '--md-sys-color-surface': p.bg,
    '--md-sys-color-on-surface': p.text,
    '--md-sys-color-surface-dim': p.bg,
    '--md-sys-color-surface-bright': p.surface,
    '--md-sys-color-surface-container-lowest': p.bg,
    '--md-sys-color-surface-container-low': p.surface,
    '--md-sys-color-surface-container': p.surface,
    '--md-sys-color-surface-container-high': p.surface,
    '--md-sys-color-surface-container-highest': p.surfaceHi,
    '--md-sys-color-surface-variant': p.surfaceHi,
    '--md-sys-color-on-surface-variant': p.textMuted,
    '--md-sys-color-outline': p.outline,
    '--md-sys-color-outline-variant': p.outline,
    '--md-sys-color-primary': p.accent,
    '--md-sys-color-on-primary': p.onAccent,
    '--md-sys-color-surface-tint': p.accent,
    // ---- Brand tokens for the SVG disk ----
    '--tt-wedge': p.wedge,
    '--tt-face': p.face,
    '--tt-face-ink': p.faceInk,
    '--tt-face-edge': p.faceEdge,
    '--tt-accent': p.accent,
  }
}

export interface Theme {
  id: string
  label: string
  /** Whether to render form controls / scrollbars dark. */
  dark: boolean
  /** Color shown in the menu swatch (the wedge color). */
  swatch: string
  /** Custom properties applied to :root for this theme. */
  tokens: Record<string, string>
}

function theme(
  id: string,
  label: string,
  dark: boolean,
  p: Palette,
): Theme {
  return { id, label, dark, swatch: p.wedge, tokens: tokens(p) }
}

// Every theme is dark: a deep, color-tinted background and surfaces with light
// text, while the identity color stays vivid as the wedge/accent. The disk face
// is a dark surface too, so its ink/ticks flip to light to keep contrast.
export const THEMES: Theme[] = [
  // Default — the app's original red-on-dark look.
  theme('classic-red', 'Classic Red', true, {
    bg: '#1a1110',
    surface: '#271d1b',
    surfaceHi: '#3d3230',
    text: '#f1dedb',
    textMuted: '#d8c2be',
    outline: '#a08c89',
    accent: '#ffb4ab',
    onAccent: '#690005',
    wedge: '#e8413a',
    face: '#2a211f',
    faceInk: '#f1dedb',
    faceEdge: '#3d3230',
  }),
  theme('dreamsicle-orange', 'Dreamsicle Orange', true, {
    bg: '#1c130c',
    surface: '#2a1e14',
    surfaceHi: '#3b2c1d',
    text: '#f6e4d5',
    textMuted: '#d2b39a',
    outline: '#7d6249',
    accent: '#ff9a5a',
    onAccent: '#3a1e08',
    wedge: '#f47a30',
    face: '#2a1e14',
    faceInk: '#f6e4d5',
    faceEdge: '#3b2c1d',
  }),
  theme('cotton-ball-white', 'Cotton Ball White', true, {
    bg: '#16181c',
    surface: '#212429',
    surfaceHi: '#2e323a',
    text: '#edeef2',
    textMuted: '#b8bcc4',
    outline: '#5b606a',
    accent: '#dfe3ea',
    onAccent: '#1b1d22',
    wedge: '#f4f2ec',
    face: '#262a31',
    faceInk: '#edeef2',
    faceEdge: '#363b44',
  }),
  theme('lake-day-blue', 'Lake Day Blue', true, {
    bg: '#0d161c',
    surface: '#15232c',
    surfaceHi: '#1f3340',
    text: '#dbeaf4',
    textMuted: '#a3c2d3',
    outline: '#4f6e7f',
    accent: '#5bb0e6',
    onAccent: '#04222f',
    wedge: '#3e92c8',
    face: '#15232c',
    faceInk: '#dbeaf4',
    faceEdge: '#1f3340',
  }),
  theme('pale-shale', 'Pale Shale', true, {
    bg: '#16150f',
    surface: '#221f17',
    surfaceHi: '#322f24',
    text: '#e9e6d8',
    textMuted: '#c0bca8',
    outline: '#6f6b57',
    accent: '#bdb798',
    onAccent: '#26241a',
    wedge: '#a8a181',
    face: '#221f17',
    faceInk: '#e9e6d8',
    faceEdge: '#322f24',
  }),
  theme('peony-pink', 'Peony Pink', true, {
    bg: '#1c0f15',
    surface: '#2a1a21',
    surfaceHi: '#3b2630',
    text: '#f6dde8',
    textMuted: '#d6acbd',
    outline: '#7d5867',
    accent: '#f278ab',
    onAccent: '#3c0f22',
    wedge: '#e86aa0',
    face: '#2a1a21',
    faceInk: '#f6dde8',
    faceEdge: '#3b2630',
  }),
  theme('fern-green', 'Fern Green', true, {
    bg: '#0f160d',
    surface: '#172414',
    surfaceHi: '#21331d',
    text: '#dcecd7',
    textMuted: '#a8c4a2',
    outline: '#4f6e4b',
    accent: '#79c074',
    onAccent: '#0a2208',
    wedge: '#5e9e5a',
    face: '#172414',
    faceInk: '#dcecd7',
    faceEdge: '#21331d',
  }),
]

export const DEFAULT_THEME_ID = 'classic-red'

const STORAGE_KEY = 'tt-theme'

/** Look up a theme by id, falling back to the default if it's unknown. */
export function getTheme(id: string | null | undefined): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}

/** Read the saved theme id, tolerating unavailable storage (private mode). */
export function readStoredThemeId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME_ID
  } catch {
    return DEFAULT_THEME_ID
  }
}

/** Persist the chosen theme id (best-effort). */
export function persistThemeId(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // Persisting is best-effort; the theme still applies for this session.
  }
}

/** Apply a theme's custom properties (and color-scheme) to the document root. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement
  for (const [token, value] of Object.entries(theme.tokens)) {
    root.style.setProperty(token, value)
  }
  root.style.setProperty('color-scheme', theme.dark ? 'dark' : 'light')
  // Keep the mobile browser chrome in step with the page background.
  const meta = document.querySelector('meta[name="theme-color"]')
  meta?.setAttribute('content', theme.tokens['--md-sys-color-background'])
}
