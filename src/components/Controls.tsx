import '@material/web/button/filled-button.js'
import '@material/web/button/text-button.js'
import '@material/web/chips/chip-set.js'
import '@material/web/chips/suggestion-chip.js'
import { formatTime } from '../lib/time'
import type { TimerStatus } from '../hooks/useTimer'

const PRESETS_MIN = [5, 10, 25, 55]

interface ControlsProps {
  status: TimerStatus
  remainingSec: number
  durationSec: number
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSetDuration: (seconds: number) => void
}

export function Controls({
  status,
  remainingSec,
  durationSec,
  onStart,
  onPause,
  onReset,
  onSetDuration,
}: ControlsProps) {
  const isRunning = status === 'running'
  const isFinished = status === 'finished'
  // Show the live clock when there is a session in flight, otherwise the set duration.
  const display = status === 'idle' ? durationSec : remainingSec
  const canStart = !isRunning && (isFinished ? durationSec > 0 : remainingSec > 0)

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

      <div className="controls__main">
        {isRunning ? (
          <md-filled-button
            className="controls__btn"
            onClick={onPause}
          >
            Pause
          </md-filled-button>
        ) : (
          <md-filled-button
            className="controls__btn"
            onClick={onStart}
            // React serializes `disabled={false}` as the literal attribute
            // disabled="false" on a custom element, which Lit reads as true.
            // Emit the attribute only when actually disabled.
            disabled={!canStart || undefined}
          >
            {status === 'paused' ? 'Resume' : 'Start'}
          </md-filled-button>
        )}
        <md-text-button
          className="controls__btn"
          onClick={onReset}
          disabled={status === 'idle' || undefined}
        >
          Reset
        </md-text-button>
      </div>
    </div>
  )
}
