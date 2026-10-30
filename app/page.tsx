import { LatestPosts } from "@/components/home/latest-posts"
import { Hero } from "@/components/home/hero/hero"
import { Projects } from "@/components/home/projects"
import { SectionIndex } from "@/components/home/section-index"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Page() {
  return (
    // the page scrolls inside this, so the scrollbar is drawn from theme colours in every browser
    <ScrollArea className="h-svh">
      <SectionIndex />
      {/* clipped sideways so the reverse-engineer spotlight can't make the page scroll horizontally on phones */}
      <main className="mx-auto flex max-w-310 flex-col items-center overflow-x-clip px-8 pt-[6svh] pb-4 font-display">
        {/* one column as wide as the hero, so every section below shares its edges */}
        <div className="flex w-full flex-col min-[700px]:w-fit">
          <Hero />
          <Projects />
          <LatestPosts />
        </div>
      </main>
    </ScrollArea>
  )
}
