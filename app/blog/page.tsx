import type { Metadata } from "next"

import { PostList } from "@/components/blog/post-list"
import { ReadingPage } from "@/components/blog/reading-page"

export const metadata: Metadata = {
  title: "blog",
  description:
    "Notes from Sujit Dwivedi on building things and taking them apart.",
  alternates: { canonical: "/blog" },
}

// every post, newest first
export default function BlogPage() {
  return (
    <ReadingPage back={{ href: "/", label: "Home" }}>
      <h1 className="mb-8 font-display text-[clamp(2.25rem,5vw,3rem)] leading-[1.05] font-medium tracking-[-0.025em]">
        blog
      </h1>
      <PostList />
    </ReadingPage>
  )
}
