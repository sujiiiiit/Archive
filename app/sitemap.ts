import type { MetadataRoute } from "next"

import { posts } from "@/lib/posts"
import { baseUrl } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date().toISOString().split("T")[0]
  const pages = ["", "/blog"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: today,
  }))

  const blog = (await posts.all()).map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: p.date,
  }))

  return [...pages, ...blog]
}
