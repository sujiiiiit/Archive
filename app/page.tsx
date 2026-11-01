import { Hero } from "@/components/home/hero/hero"
import { ScrollArea } from "@/components/ui/scroll-area"

// one screen: the hero fills it on desktop, and on a phone, where it stacks taller, the page scrolls
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
