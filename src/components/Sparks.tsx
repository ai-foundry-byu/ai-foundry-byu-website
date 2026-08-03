import type { CSSProperties } from "react"

/**
 * Embers rising off the hero, carried over from the original site.
 *
 * Fixed configs, not Math.random, so server and client render identically.
 * Pure CSS animation (spark-rise in globals.css), so this stays a server
 * component and ships no JavaScript. The parent section must be
 * position-relative with overflow hidden; the sparks fill it edge to edge
 * and rise 420px from its bottom. Hidden entirely under
 * prefers-reduced-motion, because a stationary dot is not an ember.
 */
const SPARKS: Array<{
  left: string
  size: number
  dur: number
  delay: number
  drift: number
  peak: number
}> = [
  { left: "6%", size: 4, dur: 11, delay: 0, drift: -28, peak: 0.8 },
  { left: "14%", size: 3, dur: 9, delay: 2.4, drift: 18, peak: 0.64 },
  { left: "23%", size: 4, dur: 13, delay: 5.1, drift: -40, peak: 0.88 },
  { left: "31%", size: 3, dur: 10, delay: 1.2, drift: 26, peak: 0.56 },
  { left: "42%", size: 5, dur: 14, delay: 6.8, drift: -22, peak: 0.8 },
  { left: "53%", size: 3, dur: 9.5, delay: 3.6, drift: 34, peak: 0.64 },
  { left: "64%", size: 4, dur: 12, delay: 0.8, drift: -30, peak: 0.88 },
  { left: "73%", size: 3, dur: 10.5, delay: 4.9, drift: 20, peak: 0.56 },
  { left: "84%", size: 4, dur: 13.5, delay: 2.0, drift: -36, peak: 0.8 },
  { left: "92%", size: 3, dur: 9, delay: 6.2, drift: 24, peak: 0.64 },
]

export function Sparks() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="spark"
          style={
            {
              left: s.left,
              width: s.size,
              height: s.size,
              "--spark-dur": `${s.dur}s`,
              "--spark-delay": `${s.delay}s`,
              "--spark-drift": `${s.drift}px`,
              "--spark-peak": s.peak,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
