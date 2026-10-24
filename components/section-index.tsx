"use client"

import { useEffect, useRef, useState, type MouseEvent } from "react"
import { useReducedMotion } from "motion/react"

// in page order; each id is a <section> on the page
const sections = [
  { id: "about", label: "about" },
  { id: "projects", label: "projects" },
]

// a magazine's contents down the right edge: the section you're reading is inked, the rest stay faint.
// the page scrolls inside the scroll area, so that's the scroller it watches
function SectionIndex() {
  const ref = useRef<HTMLElement>(null)
  const [current, setCurrent] = useState(sections[0].id)
  const reduce = useReducedMotion()

  useEffect(() => {
    const viewport = ref.current?.closest<HTMLElement>(
      "[data-slot=scroll-area-viewport]"
    )
    if (!viewport) return

    // a section is current once its top passes a third of the way down; scrolled to the end, the last one is,
    // since a short last section never reaches that line
    const update = () => {
      const { scrollTop, clientHeight, scrollHeight } = viewport
      const atEnd =
        scrollTop > 0 && scrollTop + clientHeight >= scrollHeight - 2
      const line = viewport.getBoundingClientRect().top + clientHeight / 3
      let next = sections[0].id
      for (const { id } of sections) {
        const el = document.getElementById(id)
        if (el && (atEnd || el.getBoundingClientRect().top <= line)) next = id
      }
      setCurrent(next)
    }

    update()
    viewport.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      viewport.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  const go = (e: MouseEvent, id: string) => {
    e.preventDefault()
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
  }

  return (
    // the ticks sit under the theme dot: same 10px width, ending on its right edge (24px inset + 11px)
    <nav
      ref={ref}
      aria-label="Sections"
      className="fixed top-1/2 right-[35px] z-20 -translate-y-1/2 max-lg:hidden"
    >
      <ol className="flex flex-col items-end gap-1">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={current === id ? "true" : undefined}
              onClick={(e) => go(e, id)}
              className="flex items-center gap-3 rounded-sm py-0.5 font-hand text-xl leading-none text-muted-foreground/50 outline-offset-2 transition-colors duration-200 hover:text-muted-foreground aria-[current=true]:text-foreground"
            >
              {label}
              <span aria-hidden className="h-px w-2.5 bg-current" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export { SectionIndex }
