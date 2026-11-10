import type { MetadataRoute } from "next"

import { baseUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().split("T")[0]
  return [{ url: baseUrl, lastModified: today }]
}
