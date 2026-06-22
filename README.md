# Time Timer

A visual countdown timer — a web implementation of the classic [Time Timer](doc/concept.md).
A brightly colored disk shrinks counter-clockwise as time runs out, turning the
abstract passage of time into something you can see at a glance. Useful for the
Pomodoro technique, time-blocking, focus sessions, and anyone who benefits from
a non-numeric view of "how much time is left."

Built with React + TypeScript + Vite. The disk is drawn with plain SVG (no d3).

## Features

- Drag the dial (or use +/−1 and presets) to set up to 60 minutes.
- Start / Pause / Resume / Reset.
- Drift-free countdown (derived from a wall-clock end time, not a decrementing counter).
- A short chime when time is up.

## Getting started

```bash
npm install
npm run dev      # start the dev server (Vite prints the local URL)
```

## Scripts

| Command            | What it does                              |
| ------------------ | ----------------------------------------- |
| `npm run dev`      | Start the Vite dev server with HMR        |
| `npm run build`    | Type-check (`tsc -b`) and build to `dist` |
| `npm run preview`  | Preview the production build locally       |
| `npm test`         | Run the test suite once (Vitest)          |
| `npm run test:watch` | Run tests in watch mode                 |

## Project layout

```
src/
  App.tsx                 # layout; owns timer state via useTimer
  lib/arc.ts              # SVG arc geometry (polarToCartesian, describeWedge)
  lib/time.ts             # formatTime / clamp helpers
  lib/beep.ts             # Web Audio "time's up" chime
  hooks/useTimer.ts       # drift-free countdown state machine
  components/TimerDisk.tsx  # SVG disk, ticks, shrinking wedge, drag-to-set
  components/Controls.tsx   # start/pause/reset, presets, MM:SS readout
```
