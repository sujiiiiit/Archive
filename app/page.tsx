import { Hero } from "@/components/hero/hero"
import { Projects } from "@/components/projects/projects"
import { ThemeDot } from "@/components/theme-dot"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Page() {
  return (
    <>
      <ThemeDot />
      {/* the page scrolls inside this, so the scrollbar is drawn from theme colours in every browser */}
      <ScrollArea className="h-svh">
        {/* clipped sideways so the reverse-engineer spotlight can't make the page scroll horizontally on phones */}
        <main className="mx-auto flex max-w-310 flex-col items-center overflow-x-clip px-8 pt-[6svh] pb-24 font-display">
          {/* one column as wide as the hero, so every section below shares its edges */}
          <div className="flex w-full flex-col min-[700px]:w-fit">
            <Hero />
            <Projects />
          </div>
        </main>
      </ScrollArea>
    </>
  )
}
