import createMDX from "@next/mdx"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // project stories are .mdx files under content/, imported by app/projects/[slug]
  pageExtensions: ["ts", "tsx", "md", "mdx"],
}

export default createMDX()(nextConfig)
