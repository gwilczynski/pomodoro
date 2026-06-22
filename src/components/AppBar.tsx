import lunaremLogo from '../assets/lunarem_radio_light.svg'
import { ThemeMenu } from './ThemeMenu'

interface AppBarProps {
  /** Currently active theme id. */
  themeId: string
  /** Called with the chosen theme id. */
  onThemeChange: (id: string) => void
}

/** Top header: brand wordmark on the left, settings gear (theme menu) on the right. */
export default function AppBar({ themeId, onThemeChange }: AppBarProps) {
  return (
    <header className="app-bar">
      <img src={lunaremLogo} alt="" className="app-bar__logo" aria-hidden="true" />
      <span className="app-bar__title">Lunarem Pomodoro</span>
      <ThemeMenu themeId={themeId} onSelect={onThemeChange} />
    </header>
  )
}
