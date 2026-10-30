import {
  ArrowUpRight01Icon,
  QuillWrite01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import { PostList } from "@/components/blog/post-list"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// the latest few posts under the projects, on the same rhythm as projects:
// - projects ends on an 80px reserve for its fans, so mt-4 puts this heading 96px below it, as projects sits below the hero
// - the heading row is as tall as projects' (its view buttons are 29px), and the first title lands 20px under it (mt-2 + the row's py-3)
// - pb-20 plus the page's 16px ends the page 96px below the button, as it did when projects came last
function LatestPosts() {
  return (
    <section id="blog" className="mt-4 w-0 min-w-full scroll-mt-[6svh] pb-20">
      <h2 className="flex h-[29px] items-center gap-1.5 font-sans text-[15px] text-muted-foreground">
        <HugeiconsIcon icon={QuillWrite01Icon} size={17} strokeWidth={1.75} />
        blog
      </h2>

      <div className="mt-2">
        <PostList limit={3} />
      </div>

      <Link
        href="/blog"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "mx-auto mt-6 flex w-fit font-text"
        )}
      >
        All posts
        <HugeiconsIcon icon={ArrowUpRight01Icon} data-icon="inline-end" />
      </Link>
    </section>
  )
}

export { LatestPosts }
