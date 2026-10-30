/// <reference types="mdx" />

import type { MDXContent } from "mdx/types"

// what every post exports beside its words; a post about a project also carries its cover and stack
type PostMeta = {
  title: string
  // when it went up, as yyyy-mm-dd
  date: string
  // two or three lines, read before the post starts and shown in lists, search results and link previews
  description: string
  // the thumbnail under the title: a still or a short loop
  cover?: { type: "image" | "video"; src: string; alt: string }
  // what the project is built with, shown as chips under the thumbnail
  stack?: string[]
  // a 1200x630 png or jpg in public/ for link previews; without one, /og draws the title
  image?: string
}

type Post = { default: MDXContent; meta: PostMeta }

// one entry per file in content/blog; the key is the post's url, /blog/<slug>
const files: Record<string, () => Promise<unknown>> = {
  "hello-world": () => import("@/content/blog/hello-world.mdx"),
  openscreen: () => import("@/content/blog/openscreen.mdx"),
  "smooth-cursor": () => import("@/content/blog/smooth-cursor.mdx"),
  "auto-zoom": () => import("@/content/blog/auto-zoom.mdx"),
  "this-site": () => import("@/content/blog/this-site.mdx"),
}

const posts = {
  slugs: Object.keys(files),

  has: (slug: string) => Object.hasOwn(files, slug),

  // the mdx types only know the default export, so the meta it also exports is named here
  load: (slug: string) => files[slug]() as Promise<Post>,

  // every post's meta, newest first; yyyy-mm-dd dates sort as plain strings
  async all() {
    const list = await Promise.all(
      this.slugs.map(async (slug) => ({
        slug,
        ...(await this.load(slug)).meta,
      }))
    )
    return list.sort((a, b) => b.date.localeCompare(a.date))
  },
}

export { posts, type PostMeta }
