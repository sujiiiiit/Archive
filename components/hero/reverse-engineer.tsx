"use client"

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react"
import { useReducedMotion } from "motion/react"

const WORD = "reverse-engineer"
const EASE = "cubic-bezier(.22,.8,.14,1)"
// the plates draw the word at 30px; at rest they're scaled down to sit exactly on the inline word
const PLATE_FONT = 30

type Geometry = { rest: number; k: number; dx: number }

// where the stack rests (on the word) and where it opens to (tilted, kept inside the screen)
function measure(word: HTMLElement): Geometry {
  const r = word.getBoundingClientRect()
  const rest = parseFloat(getComputedStyle(word).fontSize) / PLATE_FONT
  const k = Math.min(1, (innerWidth - 32) / 400)
  const half = 200 * k
  const cx = r.left + r.width / 2
  const dx = Math.min(Math.max(cx, half + 16), innerWidth - half - 16) - cx
  return { rest, k, dx }
}

// the word lifts out of the sentence into an exploded stack of what makes it: code, render, inspect
function ReverseEngineer() {
  const reduce = useReducedMotion()
  const word = useRef<HTMLSpanElement>(null)
  const [geo, setGeo] = useState<Geometry>({ rest: 0.5, k: 1, dx: 0 })
  const [open, setOpen] = useState(false)

  useLayoutEffect(() => {
    const update = () => word.current && setGeo(measure(word.current))
    update()
    document.fonts?.ready.then(update)
    addEventListener("resize", update)
    return () => removeEventListener("resize", update)
  }, [])

  // a tap elsewhere closes it on touch screens
  useEffect(() => {
    if (!open) return
    const close = (e: globalThis.MouseEvent) => {
      if (!word.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [open])

  const show = () => {
    if (open || !word.current) return
    setGeo(measure(word.current))
    // one frame at rest first, so the stack starts exactly on the word
    requestAnimationFrame(() => setOpen(true))
  }
  const hide = () => setOpen(false)
  const tap = (e: MouseEvent) => {
    if ((e.nativeEvent as PointerEvent).pointerType !== "mouse") {
      if (open) hide()
      else show()
    }
  }

  const still = reduce ? { transition: "none" } : {}
  const { rest, k, dx } = geo

  return (
    <span
      ref={word}
      tabIndex={0}
      role="button"
      aria-pressed={open}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onClick={tap}
      style={{
        color: open ? "transparent" : undefined,
        textDecorationColor: open ? "transparent" : undefined,
        // swapped with its copy in one frame, both ways, so there is nothing to see:
        // gone the moment the copy appears, back the moment the copy lands and hides (.85s)
        transition: open
          ? "none"
          : "color 0s linear .85s, text-decoration-color 0s linear .85s",
        ...still,
      }}
      className="relative inline-block cursor-default rounded-xs font-medium whitespace-nowrap text-foreground underline decoration-muted-foreground/50 decoration-dotted underline-offset-[5px] outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-ring"
    >
      {WORD}

      {/* the overlay is pinned to the word's centre; the stage turns in 3D around it.
          It sets its own colour and weight: the word above goes transparent while it's open */}
      <span
        aria-hidden
        style={{ perspectiveOrigin: `${dx}px 0px` }}
        className="pointer-events-none absolute top-1/2 left-1/2 z-20 size-0 font-normal text-foreground perspective-[1500px]"
      >
        {/* a soft spotlight: dims and blurs the text around the stack, fading out at its edges */}
        <span
          style={{
            left: dx,
            width: 720 * k,
            height: 440 * k,
            opacity: open ? 1 : 0,
            transition: `opacity .45s ease ${open ? 0 : 0.15}s`,
          }}
          className="absolute top-0 block -translate-1/2 bg-background/85 mask-[radial-gradient(closest-side,#000_45%,rgb(0_0_0/0.6)_70%,transparent_100%)] backdrop-blur-[3px]"
        />

        <span
          style={{
            transform: open
              ? `translate(${dx}px, 0px) rotateX(56deg) rotateZ(-32deg) scale(${k * 0.92})`
              : `scale(${rest})`,
            transition: `transform .85s ${EASE}`,
            ...still,
          }}
          className="absolute block size-0 transform-3d"
        >
          <Plate n={0} open={open} still={still} label="code">
            <span className="font-mono text-sm leading-[1.6] whitespace-pre">
              <span className="text-muted-foreground">&lt;em&gt;</span>
              {WORD}
              <span className="text-muted-foreground">&lt;/em&gt;</span>
            </span>
          </Plate>
          <Plate n={2} open={open} still={still} label="inspect">
            <span className="text-[30px] leading-none font-medium whitespace-nowrap">
              {[...WORD].map((c, i) => (
                <span
                  key={i}
                  className="inline-block text-foreground/20 outline-1 -outline-offset-1 outline-ring outline-dashed"
                >
                  {c}
                </span>
              ))}
            </span>
          </Plate>
          {/* the top plate starts as an exact copy of the inline word, dotted underline included
              (offset scaled up so it lands at the same 5px), then drops the underline as it grows its plate */}
          <Plate n={1} open={open} still={still} label="render" render>
            <span
              style={{
                textUnderlineOffset: `${5 / rest}px`,
                textDecorationColor: open ? "transparent" : undefined,
                transition: open
                  ? "text-decoration-color .3s ease .25s"
                  : "text-decoration-color .3s ease .5s",
                ...still,
              }}
              className="text-[30px] leading-none font-medium whitespace-nowrap text-foreground underline decoration-muted-foreground/50 decoration-dotted"
            >
              {WORD}
            </span>
          </Plate>
        </span>
      </span>
    </span>
  )
}

function Plate({
  n,
  open,
  still,
  label,
  render,
  children,
}: {
  n: number
  open: boolean
  still: CSSProperties
  label: string
  render?: boolean
  children: React.ReactNode
}) {
  const transform = `translateZ(${open ? (n - 1) * 62 : 0}px)`
  // layers lift from the top down and settle from the bottom up
  const lag = `${(4 - n) * (open ? 70 : 40)}ms`

  const style: CSSProperties = render
    ? {
        transform,
        visibility: open ? "visible" : "hidden",
        transition: open
          ? `transform .85s ${EASE}, background-color .4s ease .25s, border-color .4s ease .25s, box-shadow .4s ease, visibility 0s`
          : `transform .85s ${EASE}, background-color .4s ease, border-color .4s ease, box-shadow .4s ease, visibility 0s linear .85s`,
      }
    : {
        transform,
        opacity: open ? 1 : 0,
        transition: `transform .85s ${EASE} ${lag}, opacity .3s ease ${lag}, background-color .4s ease ${lag}, border-color .4s ease ${lag}, box-shadow .4s ease ${lag}`,
      }

  // 88px tall with 20px top and 12px bottom padding: pulled up 48px (not 44) so the word sits on the stage's centre,
  // which is the inline word's centre
  return (
    <span
      style={{ ...style, ...still }}
      className={
        "absolute -top-12 -left-47.5 grid h-22 w-95 place-items-center rounded-md border mask-[linear-gradient(90deg,transparent,#000_16%,#000_84%,transparent)] px-4.5 pt-5 pb-3 font-text " +
        (open
          ? "border-border bg-card shadow-[0_30px_40px_-20px_rgb(0_0_0/0.35)] dark:shadow-[0_30px_40px_-20px_rgb(0_0_0/0.7)]"
          : "border-transparent bg-transparent")
      }
    >
      <span
        style={{
          opacity: open ? 1 : 0,
          transition: `opacity .3s ease ${open ? 0.45 : 0}s`,
          ...still,
        }}
        className="absolute inset-x-14.5 top-2.25 block font-mono text-[10px] leading-none tracking-[0.02em] text-muted-foreground"
      >
        {label}
      </span>
      {children}
    </span>
  )
}

export { ReverseEngineer }
