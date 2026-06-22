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
  const display =
    status === 'idle' ? durationSec : remainingSec
  const canStart = !isRunning && (isFinished ? durationSec > 0 : remainingSec > 0)

  return (
    <div className="controls">
      <div
        className="controls__readout"
        aria-live="polite"
        data-status={status}
      >
        {formatTime(display)}
      </div>

      {isFinished && <p className="controls__done">Time’s up!</p>}

      <div className="controls__presets">
        {PRESETS_MIN.map((min) => (
          <button
            type="button"
            key={min}
            className="controls__preset"
            onClick={() => onSetDuration(min * 60)}
          >
            {min}m
          </button>
        ))}
      </div>

      <div className="controls__main">
        {isRunning ? (
          <button
            type="button"
            className="controls__btn controls__btn--pause"
            onClick={onPause}
          >
            Pause
          </button>
        ) : (
          <button
            type="button"
            className="controls__btn controls__btn--start"
            onClick={onStart}
            disabled={!canStart}
          >
            {status === 'paused' ? 'Resume' : 'Start'}
          </button>
        )}
        <button
          type="button"
          className="controls__btn controls__btn--reset"
          onClick={onReset}
          disabled={status === 'idle'}
        >
          Reset
        </button>
      </div>
    </div>
  )
}
