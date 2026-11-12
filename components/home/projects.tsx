"use client"

import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type FocusEvent,
} from "react"
import {
  ArrowExpandIcon,
  FolderClosedIcon,
  GithubIcon,
  GridViewIcon,
  Menu01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  animate,
  MotionConfig,
  motion,
  motionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"

import { useViewportProgress } from "@/components/home/use-viewport-progress"
import { cn } from "@/lib/utils"

type Project = {
  name: string
  blurb: string
  // the GitHub repo; the whole card links here
  href: string
  // three short names at most: that's what the fan's stack card fits on one line each
  stack: string[]
  status: string
  year: number
  // a small autoplaying preview, and the full-resolution recording it opens in a new tab
  video?: { preview: string; poster: string; full: string }
  // or a still: a small copy for the card, and the original it opens
  image?: { src: string; full: string }
}

const projects: Project[] = [
  {
    name: "OpenScreen",
    blurb:
      "A Mac screen recorder that edits for you: auto-zoom, smooth cursor, MP4.",
    href: "https://github.com/sujiiiiit/openscreen",
    stack: ["Obj-C++", "PixiJS", "WebCodecs"],
    status: "Paused",
    year: 2026,
    image: {
      src: "/projects/openscreen.webp",
      full: "/projects/openscreen.png",
    },
  },
  {
    name: "OpenCode in Chrome",
    blurb:
      "A Chrome extension that lets an AI agent use your own browser, with your sign-ins, to get things done for you.",
    href: "https://github.com/sujiiiiit/opencode-in-chrome",
    stack: ["Chrome MV3", "CDP", "MCP"],
    status: "Active",
    year: 2026,
    video: {
      preview: "/projects/opencode-in-chrome-preview.webm",
      poster: "/projects/opencode-in-chrome-poster.jpg",
      full: "/projects/opencode-in-chrome.mp4",
    },
  },
]

// no bounce: things settle, they never wobble past where they land
const spring = { type: "spring", duration: 0.45, bounce: 0 } as const

// the same fade the hero's text streams in with (0.6s ease-in-out), opacity only
const fadeIn = {
  // from 1%, not 0: invisible on the paper, but the browser still paints it ahead of time. From a
  // true 0 it skips the painting until the fade starts, which landed mid-glide and stuttered it
  initial: { opacity: 0.01 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease: "easeInOut" },
} as const

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
      <section
        id="projects"
        // paged, it's as wide as still lets both cards fit one screen's height; where the page
        // scrolls freely (a stacked phone, a short landscape screen) the height doesn't matter
        className="w-[min(100%,30rem,calc((88svh-290px)/1.18))] max-[900px]:portrait:w-full max-[900px]:portrait:max-w-[30rem] short:w-full short:max-w-[30rem]"
      >
        <motion.div {...fadeIn} className="flex items-center justify-between">
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
        </motion.div>

        {/* both views stay laid out in the same cell, so the block is always as tall as the taller one
            and switching never moves the heading or anything around it: the two only cross-fade */}
        <div className="grid">
          <ViewLayer shown={view === "grid"}>
            <ul className="mt-5 flex flex-col gap-8">
              <Grid />
            </ul>
          </ViewLayer>
          <ViewLayer shown={view === "list"}>
            <ul className="mt-3">
              <List active={active} bind={bind} fans={fans} />
            </ul>
            {/* gives back exactly what the open fans take, frame by frame, so hovering a row never
                changes the list's height */}
            <motion.div aria-hidden style={{ height: reserve }} />
          </ViewLayer>
        </div>
      </section>
    </MotionConfig>
  )
}

// one of the two views, stacked in the same grid cell as the other; the hidden one fades out and
// is inert, so it can't be hovered, focused or read out while it's invisible
function ViewLayer({
  shown,
  children,
}: {
  shown: boolean
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: shown ? 1 : 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      inert={!shown}
      // min-w-0: a grid item is otherwise as wide as its longest unbroken line, so a one-line blurb
      // would widen the whole section instead of truncating
      className={cn("min-w-0 [grid-area:1/1]", !shown && "pointer-events-none")}
    >
      {children}
    </motion.div>
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

// the whole row links to the project's GitHub repo
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
      <a
        href={p.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${p.name} on GitHub`}
        className="relative block rounded-2xl outline-none"
      >
        <div className="py-3">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-lg leading-snug font-medium">
              {p.name}
            </h3>
            <GithubLabel active={active} className="ml-auto" />
          </div>
          <p className="truncate font-text text-sm text-muted-foreground">
            {p.blurb}
          </p>
        </div>

        {/* the row opens into a fan of cards: two screens, the stack, where it stands and when */}
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
      </a>
    </li>
  )
}

function Grid() {
  const [active, bind] = useActive<string>()

  return projects.map((p, i) => (
    <GridCard
      key={p.name}
      project={p}
      index={i}
      active={active === p.name}
      {...bind(p.name)}
    />
  ))
}

// the lower card drifts a little faster than the upper one as the panel glides in, and the window
// inside each frame slides against it. The whole card links to the project's GitHub repo
function GridCard({
  project: p,
  index,
  active,
  ...props
}: ComponentProps<typeof motion.li> & {
  project: Project
  index: number
  active: boolean
}) {
  const ref = useRef<HTMLLIElement>(null)
  const reduce = useReducedMotion()
  const progress = useViewportProgress(ref)
  // a playing video stays put: moving it with the scroll re-composites every frame and it stutters
  const depth = reduce || p.video || p.image ? 0 : 1
  const drift = (index % 2 ? 28 : 12) * depth
  const cardY = useTransform(progress, [0, 1], [drift, -drift])
  const screenY = useTransform(progress, [0, 1], [18 * depth, -18 * depth])

  return (
    <motion.li
      ref={ref}
      {...fadeIn}
      style={{ y: cardY }}
      className="relative will-change-transform"
      {...props}
    >
      {/* three siblings, not one link: the preview opens the recording, the rest opens the repo */}
      <a
        href={p.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${p.name} on GitHub`}
        className="flex items-center justify-between rounded-xl pb-2 outline-none"
      >
        <h3 className="font-display text-lg leading-snug font-medium">
          {p.name}
        </h3>
        <GithubLabel active={active} />
      </a>
      <a
        href={p.video?.full ?? p.image?.full ?? p.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={
          p.video
            ? `Open the ${p.name} video`
            : p.image
              ? `Open the ${p.name} screenshot`
              : `${p.name} on GitHub`
        }
        className={cn(
          "group relative block overflow-hidden rounded-xl border bg-muted outline-none dark:bg-muted/50",
          // a recording keeps its own shape; the mock-ups share the wide one
          p.video || p.image ? "aspect-3420/2224" : "aspect-1200/630"
        )}
      >
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image.src}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full"
          />
        ) : p.video ? (
          // the frame is the recording's own shape, so nothing is cropped
          <video
            src={p.video.preview}
            poster={p.video.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            className="absolute inset-0 size-full"
          />
        ) : (
          // the scroll moves this layer; the window inside it still rises on hover
          <motion.div
            style={{ y: screenY }}
            className="absolute inset-0 will-change-transform"
          >
            <motion.div
              initial={false}
              animate={{ y: active ? "-4%" : "0%" }}
              className="absolute inset-x-[8%] top-[12%] bottom-[-14%] overflow-hidden rounded-t-xl border"
            >
              <Screen />
            </motion.div>
          </motion.div>
        )}
        {(p.video || p.image) && (
          <span
            aria-hidden
            className="absolute top-2 right-2 grid size-7 place-items-center rounded-lg bg-background/80 text-foreground opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <HugeiconsIcon icon={ArrowExpandIcon} size={15} />
          </span>
        )}
      </a>
      <a
        href={p.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        className="block rounded-xl pt-3 font-text text-[0.9375rem] leading-relaxed text-muted-foreground outline-none"
      >
        {p.blurb}
      </a>
    </motion.li>
  )
}

// "GitHub" with its mark, beside a project's name; it brightens while the card is hovered or focused
function GithubLabel({
  active,
  className,
}: {
  active: boolean
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex items-center gap-1 font-text text-xs text-muted-foreground transition-colors duration-200",
        active && "text-foreground",
        className
      )}
    >
      <HugeiconsIcon icon={GithubIcon} size={14} />
      GitHub
    </span>
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
