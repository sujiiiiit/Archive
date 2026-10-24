import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Cover } from "@/components/story/cover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { isSlug, loadStory, slugs } from "@/lib/stories"

type Props = { params: Promise<{ slug: string }> }

// every story is built ahead of time; a slug with no file is a 404, not a render
export const dynamicParams = false

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (!isSlug(slug)) return {}
  const { meta } = await loadStory(slug)
  return { title: `${meta.title} · Sujit Dwivedi` }
}

// the date as it reads in a byline: 21 Oct 2026. pinned to UTC so a yyyy-mm-dd never slips a day
const byline = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

// one layout for every project: date, title, thumbnail, then the story itself
export default async function StoryPage({ params }: Props) {
  const { slug } = await params
  if (!isSlug(slug)) notFound()
  const { default: Content, meta } = await loadStory(slug)

  return (
    <ScrollArea className="h-svh">
      {/* the scroll area's content sizes to fit its widest child, so long paragraphs would stretch it past a
          phone's edge; pinning the page to the viewport makes the column wrap instead */}
      <div className="w-screen">
        {/* a 640px reading column; the cover and chips share its edges so the page reads as one block */}
        <main className="mx-auto w-full max-w-[42rem] px-6 pt-[12svh] pb-28 font-sans sm:px-8">
          <article>
            <header>
              <time
                dateTime={meta.date}
                className="block text-[0.8125rem] leading-5 text-muted-foreground tabular-nums"
              >
                {byline.format(new Date(meta.date))}
              </time>
              <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,3rem)] leading-[1.05] font-medium tracking-[-0.025em] text-balance">
                {meta.title}
              </h1>

              <div className="mt-10">
                <Cover {...meta.cover} />
              </div>

              {/* one height for every chip, so a wrapped second row lines up with the first */}
              <ul aria-label="Built with" className="mt-5 flex flex-wrap gap-2">
                {meta.stack.map((tech) => (
                  <li
                    key={tech}
                    className="flex h-7 items-center rounded-full border bg-muted/40 px-3 text-xs font-medium text-muted-foreground"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              <p className="mt-10 text-[1.1875rem] leading-[1.6] tracking-[-0.005em] text-pretty text-foreground">
                {meta.description}
              </p>
            </header>

            <hr className="my-12" />

            <div className="text-[1.0625rem] leading-[1.75] text-pretty text-foreground/80 [&>:first-child]:mt-0">
              <Content />
            </div>
          </article>

          <hr className="mt-16 mb-8" />
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 rounded-sm text-sm text-muted-foreground outline-offset-4 transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} aria-hidden />
            All projects
          </Link>
        </main>
      </div>
    </ScrollArea>
  )
}
