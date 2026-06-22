import { describe, it, expect } from 'vitest'
import { polarToCartesian, describeWedge, pointToAngle } from './arc'

const CX = 100
const CY = 100
const R = 90

// Coordinates come back as floats; compare with a small tolerance.
const near = (actual: number, expected: number) =>
  expect(actual).toBeCloseTo(expected, 5)

describe('polarToCartesian', () => {
  it('places 0° at the top', () => {
    const p = polarToCartesian(CX, CY, R, 0)
    near(p.x, CX)
    near(p.y, CY - R)
  })

  it('places 90° at 3 o’clock', () => {
    const p = polarToCartesian(CX, CY, R, 90)
    near(p.x, CX + R)
    near(p.y, CY)
  })

  it('places 180° at the bottom', () => {
    const p = polarToCartesian(CX, CY, R, 180)
    near(p.x, CX)
    near(p.y, CY + R)
  })

  it('places 270° at 9 o’clock', () => {
    const p = polarToCartesian(CX, CY, R, 270)
    near(p.x, CX - R)
    near(p.y, CY)
  })
})

describe('describeWedge', () => {
  it('starts with a move to center then a line to the top', () => {
    const d = describeWedge(CX, CY, R, 90)
    expect(d.startsWith(`M ${CX} ${CY} L ${CX} ${CY - R}`)).toBe(true)
  })

  it('uses largeArc=0 for sweeps up to 180°', () => {
    const d = describeWedge(CX, CY, R, 90)
    // path: M cx cy L x y A r r 0 <largeArc> 1 ex ey Z
    expect(d).toMatch(/A 90 90 0 0 1 /)
  })

  it('uses largeArc=1 for sweeps beyond 180°', () => {
    const d = describeWedge(CX, CY, R, 270)
    expect(d).toMatch(/A 90 90 0 1 1 /)
  })

  it('clamps a full circle to just under 360° so the arc still renders', () => {
    const d = describeWedge(CX, CY, R, 360)
    expect(d).toMatch(/A 90 90 0 1 1 /)
    // Endpoint should be very close to (but not exactly) the top point.
    expect(d).not.toContain(`1 ${CX} ${CY - R} Z`)
  })

  it('clamps negative sweeps to zero', () => {
    const d = describeWedge(CX, CY, R, -50)
    // End point coincides with the start (top), producing a degenerate wedge.
    expect(d).toContain(`A 90 90 0 0 1 ${CX} ${CY - R}`)
  })
})

describe('pointToAngle', () => {
  it('reports 0° directly above the center', () => {
    near(pointToAngle(CX, CY, CX, CY - R), 0)
  })

  it('reports 90° to the right of the center', () => {
    near(pointToAngle(CX, CY, CX + R, CY), 90)
  })

  it('reports 180° below the center', () => {
    near(pointToAngle(CX, CY, CX, CY + R), 180)
  })

  it('reports 270° to the left of the center', () => {
    near(pointToAngle(CX, CY, CX - R, CY), 270)
  })
})
