import '@material/web/button/filled-button.js'
import '@material/web/chips/chip-set.js'
import '@material/web/chips/suggestion-chip.js'
import { formatTime } from '../lib/time'
import type { TimerStatus } from '../hooks/useTimer'

const PRESETS_MIN = [5, 10, 25, 55]

interface ControlsProps {
  status: TimerStatus
  remainingSec: number
  durationSec: number
  onPause: () => void
  onResume: () => void
  onSetDuration: (seconds: number) => void
}

export function Controls({
  status,
  remainingSec,
  durationSec,
  onPause,
  onResume,
  onSetDuration,
}: ControlsProps) {
  const isRunning = status === 'running'
  const isPaused = status === 'paused'
  const isFinished = status === 'finished'
  // Show the live clock when there is a session in flight, otherwise the set duration.
  const display = status === 'idle' ? durationSec : remainingSec

  return (
    <div className="controls">
      <div
        className="controls__readout md-typescale-display-large"
        aria-live="polite"
        data-status={status}
      >
        {formatTime(display)}
      </div>

      {isFinished && (
        <p className="controls__done md-typescale-title-medium">Time’s up!</p>
      )}

      <md-chip-set className="controls__presets" aria-label="Duration presets">
        {PRESETS_MIN.map((min) => (
          <md-suggestion-chip
            key={min}
            onClick={() => onSetDuration(min * 60)}
          >
            {min}m
          </md-suggestion-chip>
        ))}
      </md-chip-set>

      {/* The countdown starts as soon as a duration is picked, so the only
          button left is the pause/resume toggle for a live session. */}
      {(isRunning || isPaused) && (
        <div className="controls__main">
          <md-filled-button
            className="controls__btn"
            onClick={isRunning ? onPause : onResume}
          >
            {isRunning ? 'Pause' : 'Resume'}
          </md-filled-button>
        </div>
      )}
    </div>
  )
}
