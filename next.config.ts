import createMDX from "@next/mdx"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // blog posts are .mdx files under content/blog, imported by app/blog/[slug]
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // lets a phone on the same Wi-Fi load the dev server's scripts by this machine's IP
  allowedDevOrigins: ["172.20.10.2"],
}

export default createMDX()(nextConfig)
