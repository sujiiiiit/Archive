"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import {
  chipClass,
  Spotlight,
  useReveal,
  useTiming,
  wordClass,
} from "@/components/home/hero/reveal"

const EASE = [0.65, 0, 0.35, 1] as const
// the frame hugs the letters, not the line box: .2em out at the sides, .35em in from the top, .25em from the bottom
const FRAME = { x: 0.2, top: 0.35, bottom: 0.25 }
const CORNERS = [
  "left-0 top-0",
  "left-full top-0",
  "left-0 top-full",
  "left-full top-full",
]

// "design" gets selected the way a design tool does it: a marquee is dragged over the word,
// and it lets go as a layer with handles and its real size
function DesignWord() {
  const timing = useTiming()
  const [size, setSize] = useState("")
  const { open, props } = useReveal<HTMLSpanElement>((el) => {
    const r = el.getBoundingClientRect()
    const fs = parseFloat(getComputedStyle(el).fontSize)
    const w = Math.round(r.width + 2 * FRAME.x * fs)
    const h = Math.round(r.height - (FRAME.top + FRAME.bottom) * fs)
    setSize(`${w} × ${h}`)
  })

  return (
    <span
      {...props}
      style={{ textDecorationColor: open ? "transparent" : undefined }}
      className={`${wordClass} ${open ? "z-30" : ""}`}
    >
      <Spotlight open={open} width="calc(100% + 20em)" height="10em" />
      <span className="relative">design</span>

      <AnimatePresence>
        {open && (
          <motion.span
            aria-hidden
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            style={{ inset: `${FRAME.top}em -${FRAME.x}em ${FRAME.bottom}em` }}
            className="pointer-events-none absolute"
          >
            {/* the marquee, dragged out from the top-left corner */}
            <motion.span
              initial={{ clipPath: "inset(0 100% 100% 0)" }}
              animate={{ clipPath: "inset(0 0% 0% 0)", opacity: 0 }}
              transition={timing({
                clipPath: { duration: 0.45, ease: EASE },
                opacity: { duration: 0.12, delay: 0.5 },
              })}
              className="absolute inset-0 block border border-dashed border-foreground/40 bg-foreground/5"
            />
            {/* let go: it's selected */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={timing({ duration: 0.12, delay: 0.48 })}
              className="absolute inset-0 block border border-foreground"
            />
            {CORNERS.map((at, i) => (
              <motion.span
                key={at}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={timing({ duration: 0.15, delay: 0.5 + i * 0.03 })}
                className={`absolute block size-1.5 -translate-1/2 rounded-[1.5px] border border-foreground bg-background ${at}`}
              />
            ))}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={timing({ duration: 0.2, delay: 0.6 })}
              className="absolute top-full left-1/2 mt-2 -translate-x-1/2"
            >
              <span className={chipClass}>{size}</span>
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

export { DesignWord }
