"use client"

import { useEffect, useRef } from "react"

import {
  cursorFor,
  cursors,
  type Art,
  type Cursor,
} from "@/components/cursor/cursors"
import {
  getCursorSettings,
  useCursorSettings,
} from "@/components/cursor/cursor-settings"

// the arrow's solid shape is 385 canvas px tall; both draw at the scale that makes it `size` px
const ARROW_HEIGHT = 385

// critically damped follow (Game Programming Gems 4, "Critically Damped Ease-In/Out Smoothing"):
// eases in and out like a spring with no bounce, and is the same at 60Hz or 144Hz
function smoothDamp(
  from: number,
  to: number,
  velocity: number,
  time: number,
  dt: number
): [number, number] {
  if (time <= 0) return [to, 0]
  const omega = 2 / time
  const x = omega * dt
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)
  const change = from - to
  const temp = (velocity + omega * change) * dt
  let next = to + (change + temp) * decay
  let v = (velocity - omega * temp) * decay
  // never pass the target: the cursor lands, it doesn't overshoot and come back
  if (to - from > 0 === next > to) {
    next = to
    v = 0
  }
  return [next, v]
}

// how much the tip turns toward the way it's moving: the sideways part of the motion
// (sin of the angle between path and heading), growing with speed and easing into the limit.
// Written without dividing by speed so it fades smoothly to nothing as the cursor stops.
function turn(vx: number, vy: number, facing: number, max: number) {
  const speed = Math.hypot(vx, vy)
  const across = vy * Math.cos(facing) - vx * Math.sin(facing)
  const ease = speed > 1e-3 ? Math.tanh(speed / 900) / speed : 1 / 900
  return max * across * ease
}

// one <img> per shape, made once and reused, so switching back and forth never re-decodes a file
// and a shape still fading out is picked up where it is rather than stacked twice
type Layer = {
  name: Cursor
  art: Art
  img: HTMLImageElement
  turn: number
  enter?: Animation
  leave?: Animation
}

// where an animation has got to, so the next one carries on from there instead of jumping
function snapshot(img: HTMLImageElement): Keyframe {
  const now = getComputedStyle(img)
  return { opacity: now.opacity, transform: now.transform, filter: now.filter }
}

// sits the art so its hotspot is on the container's origin; it turns and scales around its pivot
function place({ art, img }: Layer, size: number) {
  const k = size / ARROW_HEIGHT
  Object.assign(img.style, {
    left: `${-art.hot.x * k}px`,
    top: `${-art.hot.y * k}px`,
    width: `${art.w * k}px`,
    height: `${art.h * k}px`,
    transformOrigin: `${art.pivot.x * k}px ${art.pivot.y * k}px`,
  })
}

// a drawn cursor that trails the real one on a spring, turns its tip toward where it's going,
// presses down on click, and blurs from one shape into the next as it changes
function SmoothCursor() {
  const { size } = useCursorSettings()
  const root = useRef<HTMLDivElement>(null)
  const pool = useRef(new Map<Cursor, Layer>())

  useEffect(() => {
    // only for a mouse or trackpad: touch screens have no cursor to replace
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return

    const el = root.current!
    const made = pool.current
    // the shapes on screen right now: the current one, and any still fading out
    const live = new Set<Layer>()
    const reduce = matchMedia("(prefers-reduced-motion: reduce)")
    // the system cursor only hides once ours has somewhere to be, so the page never loads with no cursor at all
    const html = document.documentElement

    // where the hand is, and where the drawn cursor is on its way there
    const target = { x: 0, y: 0 }
    const pos = { x: 0, y: 0, vx: 0, vy: 0 }
    // the direction it's travelling, smoothed so the turn follows the path rather than every twitch
    const motion = { x: 0, y: 0, ax: 0, ay: 0 }
    const press = { scale: 1, v: 0, down: false }
    let under: Element | null = null
    // the page scrolled, so what's under a still cursor needs checking on the next frame
    let rescan = false
    let current: Layer | null = null
    let shown = false
    let frame = 0
    let last = 0
    let drawn = ""

    const layerFor = (name: Cursor) => {
      let layer = made.get(name)
      if (!layer) {
        const art = cursors[name]
        const img = document.createElement("img")
        img.src = art.src
        img.alt = ""
        img.draggable = false
        // its own compositor layer, so turning and fading it never repaints the page
        img.className = "absolute max-w-none select-none will-change-transform"
        layer = { name, art, img, turn: 0 }
        place(layer, getCursorSettings().size)
        made.set(name, layer)
      }
      return layer
    }

    const drop = (layer: Layer) => {
      if (layer === current) return
      layer.img.remove()
      layer.leave?.cancel()
      layer.leave = undefined
      live.delete(layer)
    }

    // the old shape shrinks and blurs away while the new one comes into focus a little faster,
    // so the change lands before the old one has quite gone
    const show = (name: Cursor) => {
      if (current?.name === name) return

      const s = getCursorSettings()
      const next = layerFor(name)
      const instant = !current || !shown || reduce.matches
      const blur = `blur(${(s.size * 0.08).toFixed(2)}px)`
      const prev = current
      current = next

      if (prev) {
        if (instant) drop(prev)
        else {
          // reading back the style costs a recalc, so only when it was still arriving
          const from =
            prev.enter?.playState === "running"
              ? snapshot(prev.img)
              : { opacity: 1, transform: "scale(1)", filter: "blur(0px)" }
          prev.enter?.cancel()
          prev.enter = undefined
          prev.leave = prev.img.animate(
            [from, { opacity: 0, transform: "scale(0.8)", filter: blur }],
            { duration: 140, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" }
          )
          prev.leave.finished.then(() => drop(prev), () => {})
        }
      }

      // coming back before it had gone: turn it around from where it is
      let from: Keyframe = { opacity: 0, transform: "scale(0.9)", filter: blur }
      if (next.leave) {
        from = snapshot(next.img)
        next.leave.cancel()
        next.leave = undefined
      }
      if (!next.img.isConnected) el.appendChild(next.img)
      live.add(next)

      if (!instant) {
        next.enter = next.img.animate(
          [from, { opacity: 1, transform: "scale(1)", filter: "blur(0px)" }],
          { duration: 100, easing: "cubic-bezier(0,0,.2,1)" }
        )
      }
    }

    // while the button is held the cursor keeps the shape it was pressed with, as on a Mac
    const look = () => {
      if (press.down) return
      show(under ? cursorFor(under) : "default")
    }

    // only touches the DOM when something actually moved
    const draw = (s = getCursorSettings()) => {
      const on = s.tilt && !reduce.matches
      const transform = `translate3d(${pos.x.toFixed(2)}px, ${pos.y.toFixed(2)}px, 0) scale(${press.scale.toFixed(4)})`
      if (transform !== drawn) {
        el.style.transform = transform
        drawn = transform
      }
      for (const layer of live) {
        const t = on ? turn(motion.x, motion.y, layer.art.heading, s.tiltMax) : 0
        if (Math.abs(t - layer.turn) < 0.01) continue
        layer.turn = t
        layer.img.style.rotate = `${t.toFixed(2)}deg`
      }
    }

    const tick = (now: number) => {
      // capped so a frame after a hidden tab doesn't fling the cursor
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now
      const s = getCursorSettings()
      const still = reduce.matches

      // once per frame however many scroll events came in, since it forces a layout
      if (rescan) {
        rescan = false
        under = document.elementFromPoint(target.x, target.y)
        look()
      }

      const px = pos.x
      const py = pos.y
      ;[pos.x, pos.vx] = smoothDamp(pos.x, target.x, pos.vx, still ? 0 : s.smoothing, dt)
      ;[pos.y, pos.vy] = smoothDamp(pos.y, target.y, pos.vy, still ? 0 : s.smoothing, dt)

      // measured from what's drawn, so it works with smoothing off too
      const vx = dt > 0 ? (pos.x - px) / dt : 0
      const vy = dt > 0 ? (pos.y - py) / dt : 0
      ;[motion.x, motion.ax] = smoothDamp(motion.x, vx, motion.ax, 0.1, dt)
      ;[motion.y, motion.ay] = smoothDamp(motion.y, vy, motion.ay, 0.1, dt)

      // a quick press down, a slightly slower release
      const pressGoal = press.down ? s.clickScale : 1
      ;[press.scale, press.v] = smoothDamp(press.scale, pressGoal, press.v, still ? 0 : press.down ? 0.06 : 0.1, dt)

      draw(s)

      const settled =
        Math.abs(target.x - pos.x) < 0.05 &&
        Math.abs(target.y - pos.y) < 0.05 &&
        Math.hypot(motion.x, motion.y) < 1 &&
        Math.abs(press.scale - pressGoal) < 0.001
      frame = settled ? 0 : requestAnimationFrame(tick)
    }

    const wake = () => {
      if (frame) return
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const setShown = (on: boolean) => {
      shown = on
      el.style.opacity = on ? "1" : "0"
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      target.x = e.clientX
      target.y = e.clientY
      // working out the shape walks up the tree, so only when the element underneath changes
      if (e.target instanceof Element && e.target !== under) {
        under = e.target
        look()
      }
      // coming back into the window: appear where the hand is rather than flying in from the edge
      if (!shown) {
        pos.x = target.x
        pos.y = target.y
        pos.vx = pos.vy = 0
        motion.x = motion.y = motion.ax = motion.ay = 0
        draw()
        setShown(true)
        html.classList.add("custom-cursor")
      }
      wake()
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return
      press.down = true
      wake()
    }
    const onUp = () => {
      if (!press.down) return
      press.down = false
      look()
      wake()
    }
    // the page can scroll under a still cursor, so what it's over can change
    const onScroll = () => {
      if (!shown) return
      rescan = true
      wake()
    }
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) setShown(false)
    }

    show("default")
    // the hand fetched and decoded ahead, so the first switch isn't waiting on the network or the decoder
    const idle = (window.requestIdleCallback ?? setTimeout)(() =>
      layerFor("pointer").img.decode().catch(() => {})
    )

    addEventListener("pointermove", onMove, { passive: true })
    addEventListener("pointerdown", onDown, { passive: true })
    addEventListener("pointerup", onUp, { passive: true })
    addEventListener("blur", onUp)
    addEventListener("scroll", onScroll, { capture: true, passive: true })
    document.addEventListener("mouseout", onLeave)

    return () => {
      cancelAnimationFrame(frame)
      ;(window.cancelIdleCallback ?? clearTimeout)(idle)
      html.classList.remove("custom-cursor")
      made.forEach((l) => {
        l.img.getAnimations().forEach((a) => a.cancel())
        l.img.remove()
      })
      made.clear()
      live.clear()
      removeEventListener("pointermove", onMove)
      removeEventListener("pointerdown", onDown)
      removeEventListener("pointerup", onUp)
      removeEventListener("blur", onUp)
      removeEventListener("scroll", onScroll, { capture: true })
      document.removeEventListener("mouseout", onLeave)
    }
  }, [])

  // a new size from the panel re-sits every shape on screen
  useEffect(() => {
    pool.current.forEach((l) => place(l, size))
  }, [size])

  return (
    <div
      ref={root}
      aria-hidden
      style={{ opacity: 0 }}
      // pinned at the hotspot, so a click presses toward the tip, where it lands
      className="pointer-events-none fixed top-0 left-0 z-[2147483647] origin-top-left transition-opacity duration-150 will-change-transform"
    />
  )
}

export { SmoothCursor }
