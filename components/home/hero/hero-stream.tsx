"use client"

import { ArrowDown02Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatedMarkdown } from "flowtoken"
import "flowtoken/dist/styles.css"
import { useReducedMotion } from "motion/react"
import { useEffect, useState, type ReactNode } from "react"

import { DesignWord } from "@/components/home/hero/design-word"
import { EngineeringWord } from "@/components/home/hero/engineering-word"
import { Hello } from "@/components/home/hero/hello"
import { wordClass } from "@/components/home/hero/reveal"
import { ReverseEngineer } from "@/components/home/hero/reverse-engineer"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// the intro as markdown, so it can arrive the way an answer from a model does;
// the words that open are custom tags, rendered as their components
const INTRO = `# Sujit Dwivedi

When asked what I do, I say software engineer. But there’s more: I bring <designword></designword> and <engineeringword></engineeringword> together.

I observe, overthink, plan, design, build, test, ship, break things, debug, fix them… and most of what I know came from the things I <reverseengineer></reverseengineer> and rebuild from scratch.

I’m a *Creative Developer.*`

// a token is a word with the space after it; a custom tag and the italic run each count as one,
// so a half-written tag or a lone asterisk never shows
const TOKENS = INTRO.match(/(<(\w+)><\/\2>|\*[^*]+\*|\S+)\s*/g) ?? []

// the streaming settings: 200 tokens a second, each fading in over 0.6s
const SPEED = 200
const FADE = { animation: "fadeIn", duration: "0.6s", timing: "ease-in-out" }
const fade = {
  animation: `ft-fadeIn ${FADE.duration} ${FADE.timing}`,
} as const

// animateText always hands back an array: the node wrapped in a fading span while streaming, bare once settled
type Rendered = {
  animateText: (node: ReactNode) => ReactNode[]
  children?: ReactNode
}

// the same type as the hero had before; the last paragraph (the one with the italic) is the one in full ink
const text = {
  h1: ({ animateText, children }: Rendered) => (
    <h1 className="mb-[1.2svh] font-display text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[1.1] font-medium tracking-[-0.02em] whitespace-nowrap text-foreground">
      {animateText(children)}
    </h1>
  ),
  p: ({ animateText, children }: Rendered) => (
    <p className="mt-[1.1em] has-[em]:text-foreground [h1+&]:mt-0">
      {animateText(children)}
    </p>
  ),
  em: ({ animateText, children }: Rendered) => (
    <em className="font-accent text-[1.67em]">{animateText(children)}</em>
  ),
}

// kept at module level: flowtoken rebuilds its renderers when this object changes, which would remount the words
const live = {
  ...text,
  designword: ({ animateText }: Rendered) => animateText(<DesignWord />)[0],
  engineeringword: ({ animateText }: Rendered) =>
    animateText(<EngineeringWord />)[0],
  reverseengineer: ({ animateText }: Rendered) =>
    animateText(<ReverseEngineer />)[0],
}

// the finished text, laid out but unseen, so the column has its final height from the first frame
// and the streaming text never pushes the centred hero around
const ghost = {
  ...text,
  designword: () => <span className={wordClass}>design</span>,
  engineeringword: () => <span className={wordClass}>functionality</span>,
  reverseengineer: () => <span className={wordClass}>reverse-engineer</span>,
}

// flowtoken sets each token inline-block, which breaks lines in other places than the finished text does;
// as plain inline spans they wrap exactly like the settled paragraph, so nothing reflows when it lands
const markdown =
  "font-text text-[clamp(1rem,1.4vw,1.3rem)] leading-[1.7] text-pretty text-foreground/75 [&_span[style*=pre-wrap]]:inline! [&_span[style*=pre-wrap]]:whitespace-normal!"

function HeroStream() {
  const reduce = useReducedMotion()
  const [streamed, setCount] = useState(0)
  // once the last tokens have faded in, the spans are dropped for plain text (flowtoken's advice for finished messages)
  const [faded, setSettled] = useState(false)
  // with reduced motion the whole text is there at once, already settled
  const count = reduce ? TOKENS.length : streamed
  const settled = reduce || faded
  const done = count >= TOKENS.length

  useEffect(() => {
    if (reduce) return
    let frame = 0
    const start = performance.now()
    const step = (now: number) => {
      const next = Math.min(
        TOKENS.length,
        Math.floor(((now - start) / 1000) * SPEED)
      )
      setCount(next)
      if (next < TOKENS.length) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [reduce])

  useEffect(() => {
    if (!done || settled) return
    const timer = setTimeout(
      () => setSettled(true),
      parseFloat(FADE.duration) * 1000
    )
    return () => clearTimeout(timer)
  }, [done, settled])

  return (
    <div className="max-w-[38rem] min-w-0 flex-1 max-[900px]:portrait:w-full max-[900px]:portrait:flex-none">
      <div style={fade}>
        <Hello />
      </div>

      <div className="grid" aria-busy={!settled}>
        {!settled && (
          <div
            aria-hidden
            className={cn(markdown, "invisible [grid-area:1/1]")}
          >
            <AnimatedMarkdown
              content={INTRO}
              animation={null}
              customComponents={ghost}
            />
          </div>
        )}
        <div className={cn(markdown, "[grid-area:1/1]")}>
          <AnimatedMarkdown
            content={TOKENS.slice(0, count).join("")}
            sep="diff"
            animation={settled ? null : FADE.animation}
            animationDuration={FADE.duration}
            animationTimingFunction={FADE.timing}
            customComponents={live}
          />
        </div>
      </div>

      {/* the buttons come in as the answer's last line, once the text is through */}
      <div
        style={done ? fade : undefined}
        className={cn(
          "mt-[4svh] flex flex-wrap gap-3 font-text",
          !done && "invisible"
        )}
      >
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ size: "lg" }))}
        >
          My resume
          <HugeiconsIcon icon={ArrowUpRight01Icon} data-icon="inline-end" />
        </a>
        <a
          href="#projects"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          See projects
          <HugeiconsIcon icon={ArrowDown02Icon} data-icon="inline-end" />
        </a>
      </div>
    </div>
  )
}

export { HeroStream }
