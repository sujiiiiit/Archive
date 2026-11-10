"use client"

import { animate, type AnimationPlaybackControls } from "motion/react"
import { useEffect } from "react"

// a stacked phone layout, and a screen too short for a panel (a phone held sideways), scroll freely;
// everywhere else the page moves a whole panel at a time. The second query is the `short` variant
// in globals.css
const FREE =
  "(max-width: 900px) and (orientation: portrait), (max-height: 560px) and (orientation: landscape)"

// one swipe or one burst of wheel clicks moves one panel, however long the swipe is. A new gesture
// is told apart from the one still running by a pause in the events, or, over a trackpad's fading
// momentum, by the deltas climbing well clear of the lowest they had sunk to. A long swipe's deltas
// wobble up and down on their own, so a mere rise isn't enough: it has to be a big one, and not
// straight after the last panel moved
const PAUSE = 120
const RISE = 3
const MIN_RISE = 12
const SETTLE = 350
// how long a glide takes; the same ease-in-out the text fades with
const GLIDE = 0.7

const KEYS_DOWN = new Set(["ArrowDown", "PageDown", " "])
const KEYS_UP = new Set(["ArrowUp", "PageUp"])

// where a panel sits in the viewport's own scroll coordinates
const offsetOf = (viewport: HTMLElement, panel: HTMLElement) =>
  viewport.scrollTop +
  panel.getBoundingClientRect().top -
  viewport.getBoundingClientRect().top

// turns the page into full-screen panels ([data-panel]): a nudge of the wheel, an arrow key or a
// "go to" request glides to the next one, up or down, so each panel lands exactly filling the screen
function PanelPager() {
  useEffect(() => {
    const viewport = document.querySelector<HTMLElement>(
      "[data-slot=scroll-area-viewport]"
    )
    if (!viewport) return
    const free = window.matchMedia(FREE)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")

    let gliding: AnimationPlaybackControls | null = null
    let lastWheel = 0
    // the smallest delta since the current gesture moved a panel
    let floor = Infinity
    // whether the current gesture has already moved a panel, and when it did
    let spent = false
    let spentAt = 0
    // the panel the page is on, or heading to
    let index = 0

    const panels = () => [
      ...viewport.querySelectorAll<HTMLElement>("[data-panel]"),
    ]
    // the panel nearest the top of the screen; used when the page moved some other way
    const nearest = () => {
      let best = 0
      panels().forEach((p, i, list) => {
        const d = Math.abs(offsetOf(viewport, p) - viewport.scrollTop)
        if (d < Math.abs(offsetOf(viewport, list[best]!) - viewport.scrollTop))
          best = i
      })
      return best
    }

    const glideTo = (i: number) => {
      const list = panels()
      const target = list[Math.min(list.length - 1, Math.max(0, i))]
      if (!target) return
      const next = list.indexOf(target)
      // already on its way there: leave the glide alone rather than restart it from where it is
      if (gliding && next === index) return
      index = next
      const to = Math.min(
        offsetOf(viewport, target),
        viewport.scrollHeight - viewport.clientHeight
      )
      gliding?.stop()
      if (reduce.matches) {
        viewport.scrollTop = to
        gliding = null
        return
      }
      gliding = animate(viewport.scrollTop, to, {
        duration: GLIDE,
        ease: "easeInOut",
        onUpdate: (v) => (viewport.scrollTop = v),
        onComplete: () => (gliding = null),
      })
    }
    const step = (dir: 1 | -1) => {
      // between glides, start from wherever the page actually is (a scrollbar drag, a resize)
      if (!gliding) index = nearest()
      glideTo(index + dir)
    }

    const onWheel = (e: WheelEvent) => {
      if (free.matches || e.ctrlKey) return
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      e.preventDefault()
      const now = performance.now()
      const delta = Math.abs(e.deltaY)
      const fresh =
        now - lastWheel > PAUSE ||
        (now - spentAt > SETTLE && delta > MIN_RISE && delta > floor * RISE)
      lastWheel = now
      if (fresh) {
        spent = false
        floor = delta
      } else floor = Math.min(floor, delta)
      if (spent) return
      spent = true
      spentAt = now
      step(e.deltaY > 0 ? 1 : -1)
    }
    const onKey = (e: KeyboardEvent) => {
      if (free.matches || e.defaultPrevented || e.altKey || e.metaKey) return
      // typing, or a focused control, keeps its own keys
      const el = e.target as HTMLElement
      if (
        el.closest(
          "input, textarea, select, [contenteditable], button, [role=button]"
        )
      )
        return
      const dir =
        KEYS_DOWN.has(e.key) && !e.shiftKey
          ? 1
          : KEYS_UP.has(e.key) || (e.key === " " && e.shiftKey)
            ? -1
            : 0
      if (!dir) return
      e.preventDefault()
      step(dir)
    }
    // links ask for a panel with a "panel:go" event carrying the element to show
    const onGo = (e: Event) => {
      const el = (e as CustomEvent<HTMLElement>).detail
      const panel = el?.closest<HTMLElement>("[data-panel]")
      const i = panel ? panels().indexOf(panel) : -1
      if (i < 0 || free.matches) return
      e.preventDefault()
      glideTo(i)
    }
    // a resize changes where every panel sits, so settle back onto the current one
    const onResize = () => {
      if (free.matches) return
      // mid-glide, re-aim at the same panel's new place; at rest, sit back on the nearest one
      if (gliding) return glideTo(index)
      const panel = panels()[nearest()]
      if (panel) viewport.scrollTop = offsetOf(viewport, panel)
    }

    // the page can also be moved some other way (a scrollbar drag, tabbing to a link, find in
    // page); when that scroll comes to rest between panels, glide onto the nearest one
    const onScrollEnd = () => {
      if (free.matches || gliding) return
      const i = nearest()
      const panel = panels()[i]
      if (panel && Math.abs(offsetOf(viewport, panel) - viewport.scrollTop) > 2)
        glideTo(i)
    }

    viewport.addEventListener("wheel", onWheel, { passive: false })
    viewport.addEventListener("scrollend", onScrollEnd)
    window.addEventListener("keydown", onKey)
    window.addEventListener("panel:go", onGo)
    window.addEventListener("resize", onResize)
    return () => {
      gliding?.stop()
      viewport.removeEventListener("wheel", onWheel)
      viewport.removeEventListener("scrollend", onScrollEnd)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("panel:go", onGo)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return null
}

// asks the pager to glide to the panel holding `el`; false when there's no pager to answer
// (a phone's free scrolling), so the caller can scroll there itself
function goToPanel(el: HTMLElement) {
  const event = new CustomEvent("panel:go", { detail: el, cancelable: true })
  return !window.dispatchEvent(event)
}

export { goToPanel, PanelPager }
