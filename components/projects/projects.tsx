"use client"

import {
  useEffect,
  useState,
  type ComponentProps,
  type FocusEvent,
} from "react"
import {
  ArrowUpRight01Icon,
  ComputerVideoIcon,
  Cursor01Icon,
  FolderClosedIcon,
  GithubIcon,
  GridViewIcon,
  Menu01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import Link from "next/link"
import {
  animate,
  AnimatePresence,
  MotionConfig,
  motion,
  motionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Project = {
  name: string
  blurb: string
  icon: IconSvgElement
  href: string
  repo?: { href: string; stars: number }
  stack: string[]
  status: string
  year: number
}

// dummy content: swap in the real projects, no logos
const projects: Project[] = [
  {
    name: "openscreen",
    blurb: "Screen recordings that look edited before you edit them.",
    icon: ComputerVideoIcon,
    href: "/projects/openscreen",
    repo: { href: "#", stars: 128 },
    stack: ["Electron", "PixiJS", "WebCodecs"],
    status: "Paused",
    year: 2026,
  },
  {
    name: "smooth-cursor",
    blurb: "Takes the shake out of a recorded cursor, without the lag.",
    icon: Cursor01Icon,
    href: "/projects/smooth-cursor",
    repo: { href: "#", stars: 42 },
    stack: ["TypeScript", "Vitest"],
    status: "Beta",
    year: 2026,
  },
]

// no bounce: things settle, they never wobble past where they land
const spring = { type: "spring", duration: 0.45, bounce: 0 } as const

// an open row's fan of cards, matching its h-20
const fanHeight = 80

// where each card lands when a row opens, dealt left to right
const fan = [
  { rotate: -10, y: 8 },
  { rotate: -3, y: -4 },
  { rotate: 5, y: 2 },
  { rotate: 9, y: 18 },
]

function Projects() {
  const [view, setView] = useState<"list" | "grid">("grid")
  const [active, bind] = useActive<string>()
  // how far each row's fan is open, in px
  const [fans] = useState(() => projects.map(() => motionValue(0)))
  const reserve = useTransform(fans, (open: number[]) =>
    Math.max(0, fanHeight - open.reduce((a, b) => a + b, 0))
  )

  return (
    <MotionConfig reducedMotion="user" transition={spring}>
      <section id="projects" className="mt-24 w-0 min-w-full scroll-mt-[6svh]">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-x-1.5">
            {/* the icon a touch taller than the text (17 to 15), so it reads as the same size beside the letters */}
            <h2 className="flex items-center gap-1.5 font-sans text-[15px] text-muted-foreground">
              <HugeiconsIcon
                icon={FolderClosedIcon}
                size={17}
                strokeWidth={1.75}
              />
              projects
            </h2>
            <StoryNote />
          </div>
          {/* pulled right by the buttons' padding so the icons end on the column edge */}
          <div className="-mr-1.5 flex">
            <ViewButton
              label="List view"
              icon={Menu01Icon}
              active={view === "list"}
              onClick={() => setView("list")}
            />
            <ViewButton
              label="Grid view"
              icon={GridViewIcon}
              active={view === "grid"}
              onClick={() => setView("grid")}
            />
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={view === "list" ? "mt-3" : "mt-5 flex flex-col gap-10"}
          >
            {view === "list" ? (
              <List active={active} bind={bind} fans={fans} />
            ) : (
              <Grid />
            )}
          </motion.ul>
        </AnimatePresence>

        <a
          href="https://github.com/sujiiiiit"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "mx-auto mt-6 flex w-fit font-text"
          )}
        >
          See more
          <HugeiconsIcon icon={ArrowUpRight01Icon} data-icon="inline-end" />
        </a>

        {/* gives back exactly what the open fans take, frame by frame, so hovering never changes the
            page's height: a page that shrinks while scrolled to the bottom snaps back up */}
        <motion.div aria-hidden style={{ height: reserve }} />
      </section>
    </MotionConfig>
  )
}

// a pencil note beside the heading: the arrow is drawn first, then the words are written left to right
function StoryNote() {
  const reduce = useReducedMotion()

  // watched from the whole note: the words start fully clipped, and the browser counts clipped text as out of view
  return (
    <motion.p
      initial={reduce ? "written" : "blank"}
      whileInView="written"
      viewport={{ once: true, amount: 0.5 }}
      className="flex -translate-y-0.5 -rotate-4 items-center gap-1 font-hand text-xl leading-none text-muted-foreground"
    >
      {/* a pencil swoosh curving back to the heading; the head's two barbs sit ±35° off the line's end direction */}
      <svg
        aria-hidden
        viewBox="0 0 40 20"
        className="h-5 w-10 fill-none stroke-current stroke-[1.3]"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M37 5C30 14 16 15 5 10M10.9 8.9 5 10l3.1 5.2" />
      </svg>
      <motion.span
        variants={{
          blank: { clipPath: "inset(0 100% 0 0)" },
          written: { clipPath: "inset(0 0% 0 0)" },
        }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
      >
        every project has a story
      </motion.span>
    </motion.p>
  )
}

function ViewButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string
  icon: IconSvgElement
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className="cursor-pointer rounded-md p-1.5 text-muted-foreground/50 transition-colors duration-200 hover:text-muted-foreground aria-pressed:text-foreground"
    >
      <HugeiconsIcon icon={icon} size={17} />
    </button>
  )
}

// hover or keyboard focus, whichever came last; focus moving inside the item keeps it.
// hover starts on a real pointer move, not on enter, so rows scrolling under a resting cursor stay shut
function useActive<T>() {
  const [active, setActive] = useState<T | null>(null)
  const bind = (value: T) => ({
    onPointerMove: () => setActive(value),
    onMouseLeave: () => setActive(null),
    onFocus: () => setActive(value),
    onBlur: (e: FocusEvent<HTMLElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget)) setActive(null)
    },
  })
  return [active, bind] as const
}

function List({
  active,
  bind,
  fans,
}: {
  active: string | null
  bind: ReturnType<typeof useActive<string>>[1]
  fans: MotionValue<number>[]
}) {
  return projects.map((p, i) => (
    <ListRow
      key={p.name}
      project={p}
      active={active === p.name}
      fan={fans[i]}
      {...bind(p.name)}
    />
  ))
}

// the whole row is the link; the GitHub count sits above it as its own link
function ListRow({
  project: p,
  active,
  fan,
  ...props
}: ComponentProps<"li"> & {
  project: Project
  active: boolean
  fan: MotionValue<number>
}) {
  useEffect(() => {
    const controls = animate(fan, active ? fanHeight : 0, spring)
    return () => controls.stop()
  }, [active, fan])
  // leaving the list view puts the row's share back in the reserve
  useEffect(() => () => fan.set(0), [fan])

  return (
    <li className="relative -mx-4 px-4" {...props}>
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 rounded-2xl bg-muted dark:bg-muted/60"
      />
      <Link
        href={p.href}
        aria-label={`Read the story of ${p.name}`}
        className="absolute inset-0 rounded-2xl outline-offset-2"
      />

      <div className="pointer-events-none relative flex items-center gap-3 py-3">
        <Tile
          icon={p.icon}
          initial={false}
          animate={
            active ? { scale: 1.06, rotate: -2 } : { scale: 1, rotate: 0 }
          }
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-lg leading-snug font-medium">
              {p.name}
            </h3>
            {/* count and arrow move as one: at rest the arrow waits past the edge (gap + icon = 24px),
                so the count ends on the column edge; on hover both slide in */}
            <motion.div
              initial={false}
              animate={{ x: active ? 0 : 24 }}
              className="ml-auto flex h-6 items-center gap-2"
            >
              {p.repo && (
                <a
                  href={p.repo.href}
                  aria-label={`${p.name} on GitHub`}
                  className="pointer-events-auto flex items-center gap-1 rounded-sm font-text text-xs text-muted-foreground tabular-nums transition-colors hover:text-foreground"
                >
                  <HugeiconsIcon icon={GithubIcon} size={14} />
                  {p.repo.stars}
                </a>
              )}
              <motion.span
                data-arrow
                initial={false}
                animate={{ opacity: active ? 1 : 0 }}
                transition={{ duration: 0.15 }}
              >
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />
              </motion.span>
            </motion.div>
          </div>
          <p className="truncate font-text text-sm text-muted-foreground">
            {p.blurb}
          </p>
        </div>
      </div>

      {/* the row opens into a fan of cards: two screens, the stack, where it stands */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        style={{ height: fan }}
        className="pointer-events-none relative overflow-hidden"
      >
        <motion.div
          initial={false}
          animate={active ? "open" : "closed"}
          variants={{ open: { transition: { staggerChildren: 0.04 } } }}
          className="flex h-20 items-end justify-center mask-b-from-50% mask-b-to-98%"
        >
          <FanCard index={0}>
            <Screen />
          </FanCard>
          <FanCard index={1} className="z-10">
            <Screen grid />
          </FanCard>
          <FanCard
            index={2}
            className="py-2 pr-2 pl-3 font-text text-[11px] leading-relaxed text-muted-foreground"
          >
            {p.stack.map((s) => (
              <div key={s}>{s}</div>
            ))}
          </FanCard>
          <FanCard index={3} className="p-2 font-display">
            <div className="text-sm font-medium">{p.status}</div>
            <div className="text-xs text-muted-foreground">{p.year}</div>
          </FanCard>
        </motion.div>
      </motion.div>
    </li>
  )
}

function Grid() {
  const [active, bind] = useActive<string>()

  return projects.map((p) => (
    <li key={p.name} className="relative" {...bind(p.name)}>
      <Link
        href={p.href}
        aria-label={`Read the story of ${p.name}`}
        className="absolute inset-0 z-10 rounded-xl outline-offset-4"
      />
      <div className="flex items-center justify-between pb-2">
        <h3 className="font-display text-lg leading-snug font-medium">
          {p.name}
        </h3>
        {p.repo && (
          <span className="flex items-center gap-1 font-text text-xs text-muted-foreground tabular-nums">
            <HugeiconsIcon icon={StarIcon} size={12} className="fill-current" />
            {p.repo.stars}
          </span>
        )}
      </div>
      {/* a window peeking up from the bottom, soft-focused so the icon reads first; it rises on hover */}
      <div className="relative grid aspect-1200/630 place-items-center overflow-hidden rounded-xl border bg-muted dark:bg-muted/50">
  <motion.div
          initial={false}
          animate={{ y: active === p.name ? "-4%" : "0%" }}
          className="absolute inset-x-[8%] top-[12%] bottom-[-4%] overflow-hidden rounded-t-xl border shadow-sm blur-[3px]"
        >
          <Screen />
        </motion.div>
        <Tile
          icon={p.icon}
          size={26}
          initial={false}
          animate={{ scale: active === p.name ? 1.06 : 1 }}
          className="relative size-14 rounded-2xl"
        />
        <motion.span
          initial={false}
          animate={{ opacity: active === p.name ? 1 : 0 }}
          className="absolute top-2 right-2 rounded-full border bg-background/80 p-1.5 shadow-xs backdrop-blur-sm"
        >
          <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} />
        </motion.span>
      </div>
      <p className="pt-3 font-text text-[0.9375rem] leading-relaxed text-balance text-muted-foreground">
        {p.blurb}
      </p>
    </li>
  ))
}

function Tile({
  icon,
  size = 20,
  className,
  ...props
}: ComponentProps<typeof motion.div> & {
  icon: IconSvgElement
  size?: number
}) {
  return (
    <motion.div
      data-tile
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-xl border bg-card text-foreground/80 shadow-xs",
        className
      )}
      {...props}
    >
      <HugeiconsIcon icon={icon} size={size} strokeWidth={1.5} />
    </motion.div>
  )
}

function FanCard({
  index,
  className,
  children,
}: {
  index: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      variants={{
        closed: { y: 48, rotate: 0, opacity: 0 },
        open: { ...fan[index], opacity: 1 },
      }}
      className={cn(
        "relative -mx-1.5 h-18 w-24 shrink-0 overflow-hidden rounded-xl border bg-card shadow-sm",
        className
      )}
    >
      {children}
    </motion.div>
  )
}

// a stand-in screenshot drawn from theme colours, sized to whatever box it is in
function Screen({ grid, className }: { grid?: boolean; className?: string }) {
  return (
    <div className={cn("@container size-full bg-card", className)}>
      <div className="flex size-full flex-col gap-[6cqw] p-[9cqw]">
        <div className="flex justify-between">
          <span className="h-[3cqw] w-[16cqw] rounded-full bg-foreground/20" />
          <span className="h-[3cqw] w-[10cqw] rounded-full bg-foreground/10" />
        </div>
        {grid ? (
          <div className="grid flex-1 grid-cols-3 gap-[4cqw]">
            <span className="rounded-[3cqw] bg-muted" />
            <span className="rounded-[3cqw] bg-muted" />
            <span className="rounded-[3cqw] bg-muted" />
          </div>
        ) : (
          <>
            <span className="h-[5cqw] w-[60cqw] rounded-full bg-foreground/25" />
            <span className="h-[5cqw] w-[42cqw] rounded-full bg-foreground/15" />
            <span className="flex-1 rounded-[4cqw] bg-muted" />
          </>
        )}
      </div>
    </div>
  )
}

export { Projects }
