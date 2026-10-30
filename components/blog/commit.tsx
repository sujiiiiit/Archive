import type { ReactNode } from "react"
import { GitCommitIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

// a commit pinned between paragraphs, so a post can walk through the history it's told from.
// only the message, as written, quiet beside a commit glyph
function Commit({ children }: { children: ReactNode }) {
  return (
    <p className="my-7 flex items-start gap-2.5 text-sm leading-5 text-muted-foreground">
      <HugeiconsIcon
        icon={GitCommitIcon}
        size={18}
        strokeWidth={1.75}
        aria-hidden
        className="-mt-px shrink-0 text-foreground/40"
      />
      <span>
        <span className="sr-only">Commit: </span>
        {children}
      </span>
    </p>
  )
}

export { Commit }
