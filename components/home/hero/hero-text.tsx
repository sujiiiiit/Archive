"use client"

import { motion, useReducedMotion, useTransform } from "motion/react"
import { useRef } from "react"

import { HeroStream } from "@/components/home/hero/hero-stream"
import { useViewportProgress } from "@/components/home/use-viewport-progress"

// the intro, a screen tall and centred beside the print. As the projects scroll up, it trails
// behind the scroll (parallax) and fades out, the way it faded in
function HeroText() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const progress = useViewportProgress(ref)
  // at rest the intro sits halfway through its travel (0.5); by the time it has left the top it's at 1
  const y = useTransform(progress, [0.5, 1], [0, reduce ? 0 : 160])
  // it bottoms out at 1%, not 0, so the browser keeps its painting for the way back up
  const opacity = useTransform(progress, [0.5, 0.85], [1, 0.01])

  return (
    <div
      ref={ref}
      data-panel
      className="flex min-h-svh items-center py-[6svh] max-[900px]:portrait:min-h-0"
    >
      <motion.div
        style={{ y, opacity }}
        className="w-full will-change-[transform,opacity]"
      >
        <HeroStream />
      </motion.div>
    </div>
  )
}

export { HeroText }
