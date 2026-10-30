import type { MDXComponents } from "mdx/types"

import { mdxComponents } from "@/components/blog/mdx"

// next looks for this file at the root; the styling itself lives in components/blog/mdx.tsx
export function useMDXComponents(): MDXComponents {
  return mdxComponents
}
