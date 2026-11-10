"use client"

import { motionValue } from "motion/react"
import { useEffect, useState, type RefObject } from "react"

// how far an element has travelled through the scroll area's viewport: 0 as its top enters at the
// bottom, 1 as its bottom leaves at the top. The page scrolls inside the scroll area, not the window,
// so that's the scroller it reads
function useViewportProgress(ref: RefObject<HTMLElement | null>) {
  const [progress] = useState(() => motionValue(0.5))

  useEffect(() => {
    const el = ref.current
    const viewport = el?.closest<HTMLElement>(
      "[data-slot=scroll-area-viewport]"
    )
    if (!el || !viewport) return
    const update = () => {
      const box = el.getBoundingClientRect()
      const view = viewport.getBoundingClientRect()
      const t = (view.bottom - box.top) / (view.height + box.height)
      progress.set(Math.min(1, Math.max(0, t)))
    }
    update()
    viewport.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      viewport.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [ref, progress])

  return progress
}

export { useViewportProgress }
