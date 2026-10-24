"use client"

import { useEffect } from "react"
import {
  animate,
  AnimatePresence,
  easeInOut,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"

import {
  chipClass,
  Spotlight,
  useReveal,
  useTiming,
  wordClass,
} from "@/components/hero/reveal"

const WORD = "functionality"
const SCRUB = { delay: 0.35, duration: 1.6 }
// the zoom segment on the second track, as a share of the clip's length
const ZOOM = { from: 0.42, to: 0.74, scale: 1.18 }
// the clip reaches .05em past the line box at top and bottom and .6em past the word at each side;
// the word sits .6em in from its left edge
const CLIP = { y: 0.05, x: 0.6 }

// "engineering" plays like a clip in your editor: the word sits on a clip with a zoom segment under it,
// and as the playhead scrubs across it renders the word, zooming in while it crosses the segment
function EngineeringWord() {
  const reduce = useReducedMotion()
  const timing = useTiming()
  const { open, props } = useReveal<HTMLSpanElement>()

  const progress = useMotionValue(0)
  const left = useTransform(progress, (p) => `${p * 100}%`)
  const rendered = useTransform(
    progress,
    (p) => `inset(0 ${100 - p * 100}% 0 0)`
  )
  const zoom = useTransform(
    progress,
    [ZOOM.from, ZOOM.from + 0.08, ZOOM.to - 0.08, ZOOM.to],
    [1, ZOOM.scale, ZOOM.scale, 1],
    // eased in and out of the zoom, like the real thing, not a linear ramp
    { ease: easeInOut }
  )
  // the segment lights up while the playhead is inside it
  const live = useTransform(
    progress,
    [ZOOM.from - 0.01, ZOOM.from, ZOOM.to, ZOOM.to + 0.01],
    [0, 1, 1, 0]
  )
  // one second of footage at 60fps, as seconds:frames
  const timecode = useTransform(progress, (p) => {
    const f = Math.round(p * 60)
    const pad = (n: number) => String(n).padStart(2, "0")
    return `${pad(Math.floor(f / 60))}:${pad(f % 60)}`
  })

  // leaving freezes the clip where it is while it fades out; it rewinds only when it opens again
  useEffect(() => {
    if (!open) return
    progress.jump(0)
    const scrub = animate(
      progress,
      1,
      reduce ? { duration: 0 } : { ...SCRUB, ease: "linear" }
    )
    return () => scrub.stop()
  }, [open, progress, reduce])

  return (
    <span
      {...props}
      style={{
        color: open ? "transparent" : undefined,
        textDecorationColor: open ? "transparent" : undefined,
      }}
      className={`${wordClass} ${open ? "z-30" : ""}`}
    >
      <Spotlight open={open} width="calc(100% + 20em)" height="11em" />
      <span className="relative">{WORD}</span>

      <AnimatePresence>
        {open && (
          <motion.span
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={timing({ duration: 0.2 })}
            style={{ inset: `${CLIP.y}em -${CLIP.x}em -${CLIP.y}em` }}
            className="pointer-events-none absolute"
          >
            {/* the clip: the word is its footage, faint ahead of the playhead, rendered behind it */}
            <span className="absolute inset-0 block overflow-hidden rounded-md border bg-muted">
              <Footage zoom={zoom} className="text-muted-foreground/50" />
              <motion.span
                style={{ clipPath: rendered }}
                className="absolute inset-0 block"
              >
                <Footage zoom={zoom} className="text-foreground" />
              </motion.span>
              {/* trim handles */}
              <span className="absolute inset-y-1.5 left-1 block w-0.5 rounded-full bg-foreground/25" />
              <span className="absolute inset-y-1.5 right-1 block w-0.5 rounded-full bg-foreground/25" />
            </span>

            {/* the zoom track */}
            <span className="absolute inset-x-0 top-full mt-1 block h-4 rounded-[5px] bg-foreground/5">
              <span
                style={{
                  left: `${ZOOM.from * 100}%`,
                  width: `${(ZOOM.to - ZOOM.from) * 100}%`,
                }}
                className="absolute inset-y-0 grid place-items-center overflow-hidden rounded-[5px] border bg-background text-[9px] leading-none font-medium text-muted-foreground"
              >
                <motion.span
                  style={{ opacity: live }}
                  className="absolute inset-0 block bg-foreground/10"
                />
                <span className="relative">zoom</span>
              </span>
            </span>

            {/* the playhead: its time on top, the line tapering from bold to a hairline
                and fading as it drops through both tracks */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={timing({ duration: 0.2, delay: SCRUB.delay - 0.1 })}
              style={{ left }}
              className="absolute -top-1.5 -bottom-5.5 block w-0.75 -translate-x-1/2"
            >
              <span className="absolute inset-0 block bg-linear-to-b from-foreground to-foreground/15 [clip-path:polygon(0_0,100%_0,66%_100%,33%_100%)]" />
              <span className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2">
                <motion.span className={chipClass}>{timecode}</motion.span>
              </span>
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

// the word inside the clip, in the same spot as the inline word, zooming toward the segment's middle
function Footage({
  zoom,
  className,
}: {
  zoom: MotionValue<number>
  className: string
}) {
  return (
    <motion.span
      style={{
        scale: zoom,
        transformOrigin: `${((ZOOM.from + ZOOM.to) / 2) * 100}% 50%`,
      }}
      // drawn as one layer while it scales, so the letters glide instead of snapping pixel to pixel
      className="absolute inset-0 block will-change-transform"
    >
      <span
        // less the clip's 1px border, which these are positioned inside of
        style={{
          top: `calc(-${CLIP.y}em - 1px)`,
          left: `calc(${CLIP.x}em - 1px)`,
        }}
        className={`absolute block ${className}`}
      >
        {WORD}
      </span>
    </motion.span>
  )
}

export { EngineeringWord }
