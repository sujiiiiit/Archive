"use client"

import { useEffect, useRef, useState, type MouseEvent } from "react"
import { useReducedMotion, type Transition } from "motion/react"

// the look every word that opens shares: it reads as touchable, and the hand says so
const wordClass =
  "relative inline-block cursor-pointer rounded-xs font-medium whitespace-nowrap text-foreground underline decoration-muted-foreground/50 decoration-dotted underline-offset-[5px] outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-ring"

// the little readouts the words show (a size, a timecode): shaped like the design system's tooltip
const chipClass =
  "block rounded-md bg-foreground px-1.5 py-1 text-[10px] leading-none font-medium whitespace-nowrap text-background tabular-nums shadow-sm"

// hover or focus opens, leaving closes; on touch a tap toggles and a tap anywhere else closes
function useReveal<T extends HTMLElement>(prepare?: (el: T) => void) {
  const ref = useRef<T>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const close = (e: globalThis.MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [open])

  const show = () => {
    if (open || !ref.current) return
    prepare?.(ref.current)
    // one frame at rest first, so everything starts from the word
    requestAnimationFrame(() => setOpen(true))
  }
  const hide = () => setOpen(false)

  return {
    ref,
    open,
    props: {
      ref,
      tabIndex: 0,
      role: "button",
      "aria-pressed": open,
      onMouseEnter: show,
      onMouseLeave: hide,
      onFocus: show,
      onBlur: hide,
      onClick: (e: MouseEvent) => {
        if ((e.nativeEvent as PointerEvent).pointerType === "mouse") return
        if (open) hide()
        else show()
      },
    },
  }
}

// with reduced motion everything lands on its last frame at once
function useTiming() {
  const reduce = useReducedMotion()
  return (t: Transition): Transition => (reduce ? { duration: 0 } : t)
}

// a soft spotlight centred on the word: dims and blurs the text around it, fading out at its edges
function Spotlight({
  open,
  width,
  height,
  x = 0,
  closeDelay = 0,
}: {
  open: boolean
  width: number | string
  height: number | string
  x?: number
  closeDelay?: number
}) {
  return (
    <span
      aria-hidden
      style={{
        marginLeft: x,
        width,
        height,
        opacity: open ? 1 : 0,
        transition: `opacity .45s ease ${open ? 0 : closeDelay}s`,
      }}
      className="pointer-events-none absolute top-1/2 left-1/2 block -translate-1/2 bg-background/85 mask-[radial-gradient(closest-side,#000_45%,rgb(0_0_0/0.6)_70%,transparent_100%)] backdrop-blur-[3px]"
    />
  )
}

export { chipClass, Spotlight, useReveal, useTiming, wordClass }
