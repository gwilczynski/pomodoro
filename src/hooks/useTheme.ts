import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_THEME_ID, getTheme, type Theme } from '../lib/themes'

const STORAGE_KEY = 'tt-theme'

/** Read the saved theme id, tolerating unavailable storage (private mode, SSR). */
function readStoredId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME_ID
  } catch {
    return DEFAULT_THEME_ID
  }
}

/** Apply a theme's --tt-* tokens to the document root. */
function applyTheme(theme: Theme) {
  const root = document.documentElement
  for (const [token, value] of Object.entries(theme.tokens)) {
    root.style.setProperty(token, value)
  }
}

/**
 * Owns the selected disk color theme: persists the choice to localStorage and
 * applies its tokens to :root whenever it changes. Returns the active theme id
 * and a setter.
 */
export function useTheme() {
  const [themeId, setThemeId] = useState<string>(readStoredId)

  useEffect(() => {
    const theme = getTheme(themeId)
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme.id)
    } catch {
      // Persisting is best-effort; the theme still applies for this session.
    }
  }, [themeId])

  const setTheme = useCallback((id: string) => setThemeId(getTheme(id).id), [])

  return { themeId, setTheme }
}
