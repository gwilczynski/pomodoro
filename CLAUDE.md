# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A visual countdown ("Time Timer"): a colored SVG wedge that shrinks counter-clockwise
as time runs out. React + TypeScript + Vite. The disk is hand-drawn SVG — no charting library.

## Commands

| Command              | What it does                                       |
| -------------------- | -------------------------------------------------- |
| `npm run dev`        | Vite dev server with HMR                           |
| `npm run build`      | Type-check (`tsc -b`) then build to `dist`         |
| `npm test`           | Run the Vitest suite once                          |
| `npm run test:watch` | Vitest in watch mode                               |
| `npm run preview`    | Serve the production build locally                 |

Run a single test file: `npx vitest run src/hooks/useTimer.test.ts`
Run tests matching a name: `npx vitest run -t "pause"`

Requires Node >= 24 (see `.nvmrc` / `package.json` engines). CI uses Node 24.

## Architecture

State flows one way: `App.tsx` owns the timer via the `useTimer` hook and passes
state + callbacks down to two presentational components (`TimerDisk`, `Controls`).
Neither component holds timer state — they render props and call back up.

**`hooks/useTimer.ts` — the engine.** A drift-free countdown. It does *not* decrement
a counter each tick (that accumulates error). Instead it stores a wall-clock end
timestamp in `endTimeRef` and derives `remainingSec` from `endTime - Date.now()` on
each interval tick. Pause snapshots the remaining time and clears the end time; resume
computes a fresh end time from the snapshot. Status machine: `idle → running → paused
→ finished`. `setDuration` is intentionally ignored while `running`. When editing tick
behavior, preserve the timestamp-derived model — don't reintroduce a decrementing counter.

**`lib/arc.ts` — SVG geometry.** Shared angle convention used everywhere: **0° at
12 o'clock, increasing clockwise**. `polarToCartesian` shifts by −90° and relies on
SVG's down-pointing y-axis to sweep clockwise. `describeWedge` builds the pie-slice
path but **cannot draw a full 360° circle** (start and end points coincide and nothing
renders) — `TimerDisk` handles the full-disk case by rendering a plain `<circle>`
instead (see the `isFull` branch). Keep that special case if you touch the wedge.

**`components/TimerDisk.tsx`.** Renders face, 5-minute tick marks (labels every 15),
the remaining-time wedge, and a center hub. Dragging the dial sets duration: pointer
events are mapped from screen coords into the SVG viewBox (`SIZE` = 240) via
`getBoundingClientRect`, converted to an angle (`pointToAngle`), then snapped to whole
minutes. Dragging is only enabled while `idle` or `paused`. Geometry constants
(`SIZE`, `CENTER`, `FACE_RADIUS`, `DISK_RADIUS`) live at the top of the file.

**`lib/beep.ts`.** Web Audio two-tone chime on finish — no audio asset. No-ops without
`AudioContext` (e.g. jsdom tests) and swallows autoplay-policy errors. `App` wires it
to `useTimer`'s `onFinish`.

## Testing

Vitest + jsdom + Testing Library, globals enabled (`vite.config.ts` `test` block;
setup in `src/setupTests.ts`). Tests live beside source as `*.test.ts(x)`. The pure
helpers in `lib/` (`arc`, `time`) carry the geometry/formatting tests; `useTimer` and
the components have their own.

## Deployment

Pushes to `main` deploy to GitHub Pages via `.github/workflows/deploy.yml`. The app is
served from a subpath, so `vite.config.ts` sets `base: '/pomodoro/'` — keep that in sync
with the Pages repo/path or asset URLs will 404.