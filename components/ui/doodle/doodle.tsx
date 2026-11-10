"use client"

// Hand-drawn doodles painted onto a square canvas, ported from opencode-in-chrome. Each doodle is a
// filled outline in a 100×100 box (see paths.ts), so they all read at one size and `size` only
// scales the box. Without a `color` they paint in the canvas's CSS `color`, so `text-*` classes
// work and they repaint when the theme changes.
import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"

import {
  bendShift,
  DOODLE_FRAMES,
  type Painter,
} from "@/components/ui/doodle/frames"
import { DOODLE_PATHS } from "@/components/ui/doodle/paths"

type DoodleName = keyof typeof DOODLE_PATHS
const DOODLE_NAMES = Object.keys(DOODLE_PATHS) as DoodleName[]

/** The line weight of the drawings themselves, in box units; added marks match it. */
const LINE = 2.8
const FPS = 4

interface DoodleProps {
  name: DoodleName
  /** Width and height in CSS pixels; the canvas is always square. */
  size?: number
  /** Any canvas colour; defaults to the element's CSS `color`. */
  color?: string
  /**
   * Extra line weight in CSS pixels. The lines are drawn into the outlines, so they can only be
   * thickened: an outline of this width in the same colour is traced around them.
   */
  weight?: number
  className?: string
  /** Read out to screen readers; without it the doodle is decorative. */
  label?: string
}

/** Sizes the canvas for the screen and returns a painter working in the 100×100 box. */
function painter(
  canvas: HTMLCanvasElement,
  { name, size = 24, color, weight = 0 }: DoodleProps
) {
  const g = canvas.getContext("2d")
  if (!g) return undefined
  const ink = color ?? getComputedStyle(canvas).color
  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.round(size * dpr)
  canvas.height = Math.round(size * dpr)
  const extra = (weight * 100) / size
  const scale = (size / 100) * dpr
  const path = new Path2D(DOODLE_PATHS[name])
  const fillOn = (target: CanvasRenderingContext2D, shape = path) => {
    target.fill(shape)
    if (extra > 0) target.stroke(shape)
  }
  // bending paints the doodle once on a spare canvas, then copies it across one device-pixel row
  // at a time, each row shifted, so the bend has no seams
  const spare = document.createElement("canvas")
  spare.width = canvas.width
  spare.height = canvas.height
  const s = spare.getContext("2d")
  const p: Painter = {
    g,
    fill: () => fillOn(g),
    bend: (amount, base, top) => {
      if (!s) return fillOn(g)
      s.setTransform(scale, 0, 0, scale, 0, 0)
      s.clearRect(0, 0, 100, 100)
      s.fillStyle = g.fillStyle
      s.strokeStyle = g.strokeStyle
      s.lineWidth = extra
      s.lineJoin = "round"
      fillOn(s)
      g.save()
      g.setTransform(1, 0, 0, 1, 0, 0)
      for (let row = 0; row < spare.height; row++) {
        const dx = bendShift((row + 0.5) / scale, amount, base, top) * scale
        g.drawImage(spare, 0, row, spare.width, 1, dx, row, spare.width, 1)
      }
      g.restore()
    },
    mark: (d) => {
      g.save()
      g.lineWidth = LINE + extra
      g.stroke(new Path2D(d))
      g.restore()
    },
    warp: (to) => {
      // the outlines use only absolute M, C, L and Z commands, so every number pair is a point
      const moved = DOODLE_PATHS[name].replace(/[MCL][^MCLZ]*/g, (part) => {
        const nums = part.slice(1).trim().split(/\s+/).map(Number)
        const out: number[] = []
        for (let i = 0; i + 1 < nums.length; i += 2)
          out.push(...to(nums[i]!, nums[i + 1]!))
        return part[0] + out.map((v) => Math.round(v * 100) / 100).join(" ")
      })
      fillOn(g, new Path2D(moved))
    },
    dot: (x, y, r) => {
      g.beginPath()
      g.arc(x, y, r + extra / 2, 0, 2 * Math.PI)
      g.fill()
    },
  }
  /** Clears the canvas and paints with `draw`. */
  return (draw: (p: Painter) => void) => {
    g.setTransform(scale, 0, 0, scale, 0, 0)
    g.clearRect(0, 0, 100, 100)
    g.fillStyle = ink
    g.strokeStyle = ink
    g.lineWidth = extra
    g.lineJoin = "round"
    g.lineCap = "round"
    draw(p)
  }
}

// one shared clock for every animated doodle on the page, so they all step together on a single
// timer, and the timer only runs while some doodle is on screen and the tab is in view
const clock = (() => {
  const ticks = new Set<() => void>()
  let timer = 0
  const sync = () => {
    const run = ticks.size > 0 && document.visibilityState === "visible"
    if (run && !timer)
      timer = window.setInterval(() => ticks.forEach((t) => t()), 1000 / FPS)
    if (!run && timer) {
      window.clearInterval(timer)
      timer = 0
    }
  }
  if (typeof document !== "undefined")
    document.addEventListener("visibilitychange", sync)
  return {
    add: (t: () => void) => {
      ticks.add(t)
      sync()
    },
    delete: (t: () => void) => {
      ticks.delete(t)
      sync()
    },
  }
})()

function DoodleCanvas({
  animate,
  ...props
}: DoodleProps & { animate: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const { name, size = 24, color, weight } = props

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    // drawn when the browser is idle, not while the page is still starting up: the strip only fades
    // in once the intro has streamed, so nobody sees the wait, and startup isn't slowed by it
    let stop: (() => void) | void
    const begin = () => {
      stop = start(canvas)
    }
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(begin, { timeout: 1500 })
      : window.setTimeout(begin, 200)
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
      stop?.()
    }

    function start(canvas: HTMLCanvasElement) {
      const paint = painter(canvas, { name, size, color, weight })
      if (!paint) return
      if (!animate) return paint((p) => p.fill())
      const frames = DOODLE_FRAMES[name]
      const g = canvas.getContext("2d")!
      // each of the four frames is drawn once, then kept as a bitmap: the story loops forever, and
      // copying a bitmap is far cheaper than redrawing outlines (and bending them row by row) each tick
      const drawn: (HTMLCanvasElement | undefined)[] = []
      let frame = 0
      const tick = () => {
        const kept = drawn[frame]
        if (kept) {
          g.setTransform(1, 0, 0, 1, 0, 0)
          g.clearRect(0, 0, canvas.width, canvas.height)
          g.drawImage(kept, 0, 0)
        } else {
          paint(frames[frame]!)
          const copy = document.createElement("canvas")
          copy.width = canvas.width
          copy.height = canvas.height
          copy.getContext("2d")?.drawImage(canvas, 0, 0)
          drawn[frame] = copy
        }
        frame = (frame + 1) % frames.length
      }
      tick()
      // with reduced motion it holds its first frame
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      // it only acts its story out while it can be seen: scrolled away, it holds still and costs nothing
      const seen = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting) clock.add(tick)
        else clock.delete(tick)
      })
      seen.observe(canvas)
      return () => {
        seen.disconnect()
        clock.delete(tick)
      }
    }
    // the theme is a dependency so a CSS-coloured doodle repaints in the new ink
  }, [animate, name, size, color, weight, resolvedTheme])

  return (
    <canvas
      ref={ref}
      style={{ width: size, height: size }}
      className={props.className}
      role={props.label ? "img" : undefined}
      aria-label={props.label}
      aria-hidden={props.label ? undefined : true}
    />
  )
}

function Doodle(props: DoodleProps) {
  return <DoodleCanvas {...props} animate={false} />
}

/** The doodle acting out its four-frame story at four frames a second. */
function AnimatedDoodle(props: DoodleProps) {
  return <DoodleCanvas {...props} animate />
}

export {
  AnimatedDoodle,
  Doodle,
  DOODLE_NAMES,
  type DoodleName,
  type DoodleProps,
}
