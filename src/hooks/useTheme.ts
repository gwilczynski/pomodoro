import { useCallback, useEffect, useState } from 'react'
import {
  applyTheme,
  getTheme,
  persistThemeId,
  readStoredThemeId,
} from '../lib/themes'

/**
 * Owns the selected color theme: persists the choice to localStorage and
 * applies its custom properties (page background, text, surfaces, accent and
 * the disk's brand tokens) to :root whenever it changes. Returns the active
 * theme id and a setter.
 */
export function useTheme() {
  const [themeId, setThemeId] = useState<string>(readStoredThemeId)

  useEffect(() => {
    const theme = getTheme(themeId)
    applyTheme(theme)
    persistThemeId(theme.id)
  }, [themeId])

  const setTheme = useCallback((id: string) => setThemeId(getTheme(id).id), [])

  return { themeId, setTheme }
}
