/// <reference types="mdx" />

import type { MDXContent } from "mdx/types"

// what every story file exports beside its words; the page lays these out the same way for each one
type StoryMeta = {
  title: string
  // when the story went up, as yyyy-mm-dd
  date: string
  // the thumbnail under the title: a still or a short loop
  cover: { type: "image" | "video"; src: string; alt: string }
  // what it's built with, shown as chips under the thumbnail
  stack: string[]
  // two or three lines on what the project is, read before the story starts
  description: string
}

type Story = { default: MDXContent; meta: StoryMeta }

// one entry per file in content/projects; the key is the story's url, /projects/<slug>
const stories = {
  openscreen: () => import("@/content/projects/openscreen.mdx"),
  "smooth-cursor": () => import("@/content/projects/smooth-cursor.mdx"),
  "auto-zoom": () => import("@/content/projects/auto-zoom.mdx"),
  "this-site": () => import("@/content/projects/this-site.mdx"),
}

type Slug = keyof typeof stories

const slugs = Object.keys(stories) as Slug[]

function isSlug(slug: string): slug is Slug {
  return slug in stories
}

// the mdx types only know the default export, so the meta it also exports is named here
function loadStory(slug: Slug) {
  return stories[slug]() as Promise<Story>
}

export { isSlug, loadStory, slugs, type StoryMeta }
