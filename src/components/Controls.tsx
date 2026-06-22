import '@material/web/chips/chip-set.js'
import '@material/web/chips/suggestion-chip.js'
import { formatTime } from '../lib/time'
import type { TimerStatus } from '../hooks/useTimer'

const PRESETS_MIN = [5, 10, 25, 55]

interface ControlsProps {
  status: TimerStatus
  remainingSec: number
  durationSec: number
  onSetDuration: (seconds: number) => void
}

export function Controls({
  status,
  remainingSec,
  durationSec,
  onSetDuration,
}: ControlsProps) {
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
    </div>
  )
}
