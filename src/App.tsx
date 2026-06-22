import { useCallback } from 'react'
import { TimerDisk } from './components/TimerDisk'
import { Controls } from './components/Controls'
import { ThemeMenu } from './components/ThemeMenu'
import { useTimer } from './hooks/useTimer'
import { useTheme } from './hooks/useTheme'
import { playBeep } from './lib/beep'
import './App.css'

const MAX_MINUTES = 60

export default function App() {
  const onFinish = useCallback(() => playBeep(), [])
  const timer = useTimer({ initialSeconds: 25 * 60, tickMs: 100, onFinish })
  const { themeId, setTheme } = useTheme()

  return (
    <main className="app">
      <ThemeMenu themeId={themeId} onSelect={setTheme} />

      <h1 className="app__title md-typescale-headline-medium">Time Timer</h1>
      <p className="app__hint md-typescale-body-medium">
        Pick a preset or drag the dial — the countdown starts right away. The
        colored slice shrinks as time runs out.
      </p>

      <TimerDisk
        remainingSec={timer.remainingSec}
        durationSec={timer.durationSec}
        maxMinutes={MAX_MINUTES}
        status={timer.status}
        onSetDuration={timer.setDuration}
      />

      <Controls
        status={timer.status}
        remainingSec={timer.remainingSec}
        durationSec={timer.durationSec}
        onSetDuration={timer.setDuration}
      />
    </main>
  )
}
