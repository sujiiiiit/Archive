import createMDX from "@next/mdx"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // blog posts are .mdx files under content/blog, imported by app/blog/[slug]
  pageExtensions: ["ts", "tsx", "md", "mdx"],
}

export default createMDX()(nextConfig)
