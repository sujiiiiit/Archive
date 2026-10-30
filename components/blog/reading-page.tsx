import type { ReactNode } from "react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import { ScrollArea } from "@/components/ui/scroll-area"

// the frame every post and list page is read in: one column, and a way back at the end
function ReadingPage({
  back,
  children,
}: {
  back: { href: string; label: string }
  children: ReactNode
}) {
  return (
    <ScrollArea className="h-svh">
      {/* the scroll area's content sizes to fit its widest child, so long paragraphs would stretch it past a
          phone's edge; pinning the page to the viewport makes the column wrap instead */}
      <div className="w-screen">
        {/* a 640px reading column; the cover and chips share its edges so the page reads as one block */}
        <main className="mx-auto w-full max-w-[42rem] px-6 pt-[12svh] pb-28 font-sans sm:px-8">
          {children}

          <hr className="mt-16 mb-8" />
          <Link
            href={back.href}
            className="inline-flex items-center gap-1.5 rounded-sm text-sm text-muted-foreground outline-offset-4 transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} aria-hidden />
            {back.label}
          </Link>
        </main>
      </div>
    </ScrollArea>
  )
}

export { ReadingPage }
