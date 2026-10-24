import type { MDXComponents } from "mdx/types"

import { Commit } from "@/components/story/commit"

// every story is styled here once, so a story file is only words and never carries its own classes.
// one scale for the whole page: 17px body on a 1.75 line, headings in the display serif, every gap a step of 4px
const components: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-14 mb-4 font-display text-[1.625rem] leading-tight font-medium tracking-[-0.015em] text-foreground"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-10 mb-3 font-display text-xl leading-snug font-medium text-foreground"
      {...props}
    />
  ),
  p: (props) => <p className="my-5" {...props} />,
  a: (props) => (
    <a
      className="text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="my-6 list-disc space-y-3 pl-5 marker:text-muted-foreground/60"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="my-6 list-decimal space-y-3 pl-5 marker:text-muted-foreground"
      {...props}
    />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  strong: (props) => (
    <strong className="font-medium text-foreground" {...props} />
  ),
  em: (props) => <em className="font-accent text-[1.15em]" {...props} />,
  // a line in my own words: body size, set apart only by the rule, the italic and full ink
  blockquote: (props) => (
    <blockquote
      className="my-8 border-l-2 border-foreground/15 pl-5 text-foreground italic [&>p]:my-0"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-8 overflow-x-auto rounded-xl border bg-muted/40 px-5 py-4 font-mono text-[0.8125rem] leading-6 text-foreground/85 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit"
      {...props}
    />
  ),
  hr: () => <hr className="my-12" />,
  // usable in any story without an import
  Commit,
}

export function useMDXComponents(): MDXComponents {
  return components
}
