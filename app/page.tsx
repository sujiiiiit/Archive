import { Hero } from "@/components/home/hero/hero"
import { ScrollArea } from "@/components/ui/scroll-area"

// the print stays put on the left; the column beside it scrolls from the intro into the projects
export default function Page() {
  return (
    // the page scrolls inside this, so the scrollbar is drawn from theme colours in every browser
    <ScrollArea className="h-svh">
      {/* clipped sideways so the reverse-engineer spotlight can't make the page scroll horizontally on phones */}
      <main className="mx-auto flex max-w-400 flex-col items-center overflow-x-clip px-8 font-display">
        <Hero />
      </main>
    </ScrollArea>
  )
}
