"use client"

import { ArrowDown02Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import type { CSSProperties, ReactNode } from "react"

import { DesignWord } from "@/components/home/hero/design-word"
import { EngineeringWord } from "@/components/home/hero/engineering-word"
import { Hello } from "@/components/home/hero/hello"
import { ReverseEngineer } from "@/components/home/hero/reverse-engineer"
import { goToPanel } from "@/components/home/panel-pager"
import { buttonVariants } from "@/components/ui/button"
import { AnimatedDoodle, DOODLE_NAMES } from "@/components/ui/doodle/doodle"
import { cn } from "@/lib/utils"

// the intro, block by block. Plain text streams in a word at a time; a word that opens (a
// component) and the italic run each arrive as one token, so neither ever shows half-written
type Part = string | { node: ReactNode } | { em: string }
type Block = { tag: "h1" | "p"; parts: Part[] }

const INTRO: Block[] = [
  { tag: "h1", parts: ["Sujit Dwivedi"] },
  {
    tag: "p",
    parts: [
      "When asked what I do, I say software engineer. But there’s more: I bring ",
      { node: <DesignWord /> },
      " and ",
      { node: <EngineeringWord /> },
      " together.",
    ],
  },
  {
    tag: "p",
    parts: [
      "I observe, overthink, plan, design, build, test, ship, break things, debug, fix them… and most of what I know came from the things I ",
      { node: <ReverseEngineer /> },
      " and rebuild from scratch.",
    ],
  },
  { tag: "p", parts: ["I’m a ", { em: "Creative Developer." }] },
]

// the streaming pace: 200 tokens a second, each fading in over 0.6s (see .stream-token)
const SPEED = 200
const FADE_S = 0.6

// every token numbered in reading order, worked out once: its number is its place in the stream
type Token = { part: Exclude<Part, string> | string; at: number }
let count = 0
const BLOCKS = INTRO.map(({ tag, parts }) => ({
  tag,
  tokens: parts.flatMap((part): Token[] =>
    typeof part === "string"
      ? (part.match(/\s*\S+\s*/g) ?? []).map((word) => ({
          part: word,
          at: count++,
        }))
      : [{ part, at: count++ }]
  ),
}))
// when the last word has finished fading in
const STREAM_END = count / SPEED + FADE_S

const delay = (seconds: number): CSSProperties => ({
  animationDelay: `${seconds.toFixed(3)}s`,
})
// the same fade, for the pieces around the text, starting at a given moment
const fadeAt = (seconds: number): CSSProperties => ({
  animation: `ft-fadeIn ${FADE_S}s ease-in-out ${seconds.toFixed(3)}s both`,
})

function TokenSpan({ token }: { token: Token }) {
  const { part } = token
  return (
    <span className="stream-token" style={delay(token.at / SPEED)}>
      {typeof part === "string" ? (
        part
      ) : "em" in part ? (
        <em className="font-accent text-[1.67em]">{part.em}</em>
      ) : (
        part.node
      )}
    </span>
  )
}

// every doodle, sketched in a loose row under the buttons like margin doodles in a notebook:
// each tilted a little its own way, fading in one after another once the answer is through
const TILTS = [-8, 5, -3, 9, -6, 4, -10, 7, -4, 6]

function DoodleStrip() {
  return (
    <div
      aria-hidden
      className="mt-[4svh] flex h-7 items-center gap-[clamp(10px,1.4vw,18px)] text-muted-foreground"
    >
      {DOODLE_NAMES.map((name, i) => (
        <span
          key={name}
          style={{
            ...fadeAt(STREAM_END + i * 0.08),
            rotate: `${TILTS[i % TILTS.length]}deg`,
          }}
          className="inline-flex motion-reduce:animate-none"
        >
          <AnimatedDoodle name={name} size={24} />
        </span>
      ))}
    </div>
  )
}

// the same type as the hero had before; the last paragraph (the one with the italic) is in full ink
function HeroStream() {
  const reduce = useReducedMotion()

  return (
    <div className="max-w-[38rem] min-w-0 flex-1 max-[900px]:portrait:w-full max-[900px]:portrait:flex-none">
      <div style={fadeAt(0)} className="motion-reduce:animate-none">
        <Hello />
      </div>

      <div className="font-text text-[clamp(1rem,1.4vw,1.3rem)] leading-[1.7] text-pretty text-foreground/75">
        {BLOCKS.map(({ tag, tokens }, i) =>
          tag === "h1" ? (
            <h1
              key={i}
              className="mb-[1.2svh] font-display text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[1.1] font-medium tracking-[-0.02em] whitespace-nowrap text-foreground"
            >
              {tokens.map((t) => (
                <TokenSpan key={t.at} token={t} />
              ))}
            </h1>
          ) : (
            <p
              key={i}
              className="mt-[1.1em] has-[em]:text-foreground [h1+&]:mt-0"
            >
              {tokens.map((t) => (
                <TokenSpan key={t.at} token={t} />
              ))}
            </p>
          )
        )}
      </div>

      {/* the buttons come in as the answer's last line, once the text is through */}
      <div
        style={fadeAt(count / SPEED)}
        className="mt-[4svh] flex flex-wrap gap-3 font-text motion-reduce:animate-none"
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
          onClick={(e) => {
            // the pager glides to the whole projects panel; on a phone, where the page scrolls
            // freely, it's a plain smooth scroll inside the scroll area
            const target = document.getElementById("projects")
            if (!target) return
            e.preventDefault()
            if (goToPanel(target)) return
            target.scrollIntoView({
              behavior: reduce ? "auto" : "smooth",
              block: "start",
            })
          }}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          See projects
          <HugeiconsIcon icon={ArrowDown02Icon} data-icon="inline-end" />
        </a>
      </div>

      <DoodleStrip />
    </div>
  )
}

export { HeroStream }
