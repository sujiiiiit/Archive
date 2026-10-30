import type { ComponentProps, ReactNode } from "react"
import type { MDXComponents } from "mdx/types"
import Image from "next/image"
import Link from "next/link"
import { highlight, type LanguageName } from "sugar-high"

import { Commit } from "@/components/blog/commit"
import { cn } from "@/lib/utils"

// "## the hard part" -> the-hard-part, so every heading can be linked to
function slugify(children: ReactNode) {
  return String(children)
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

// a heading with an id, and a faint # in the margin that fades in on hover to copy its link
function heading(Tag: "h2" | "h3", className: string) {
  function Heading({ children, ...props }: ComponentProps<"h2">) {
    const id = slugify(children)
    return (
      <Tag
        id={id}
        className={cn("group relative scroll-mt-8", className)}
        {...props}
      >
        <a
          href={`#${id}`}
          aria-hidden
          tabIndex={-1}
          className="absolute -left-5 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100"
        >
          #
        </a>
        {children}
      </Tag>
    )
  }
  return Heading
}

// site pages open in place, other sites in a new tab
function A({ href = "", ...props }: ComponentProps<"a">) {
  const className =
    "text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground"
  if (href.startsWith("/"))
    return <Link href={href} className={className} {...props} />
  if (href.startsWith("#"))
    return <a href={href} className={className} {...props} />
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...props}
    />
  )
}

// fence names as written (```ts) to the names the highlighter knows
const languages: Record<string, LanguageName> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  sh: "shell",
  bash: "shell",
  md: "markdown",
  yml: "yaml",
}

// a fenced block with a language is highlighted; inline code and bare fences stay plain
function Code({ className, children, ...props }: ComponentProps<"code">) {
  const fence = className?.match(/language-(\w+)/)?.[1]
  const classes =
    "rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
  if (!fence || typeof children !== "string")
    return (
      <code className={classes} {...props}>
        {children}
      </code>
    )
  const lang = languages[fence] ?? (fence as LanguageName)
  return (
    <code
      className={classes}
      dangerouslySetInnerHTML={{ __html: highlight(children, { lang }) }}
      {...props}
    />
  )
}

// a table from data, since plain markdown tables need a plugin: <Table data={{ headers: [...], rows: [[...]] }} />
function Table({ data }: { data: { headers: string[]; rows: string[][] } }) {
  return (
    <div className="my-8 overflow-x-auto rounded-xl border">
      <table className="w-full text-left text-[0.9375rem]">
        <thead className="bg-muted/40 text-foreground">
          <tr>
            {data.headers.map((header) => (
              <th key={header} className="px-4 py-2.5 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i} className="border-t">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// every post is styled here once, so a post file is only words and never carries its own classes.
// one scale for the whole page: 17px body on a 1.75 line, headings in the display serif, every gap a step of 4px
const mdxComponents: MDXComponents = {
  h2: heading(
    "h2",
    "mt-14 mb-4 font-display text-[1.625rem] leading-tight font-medium tracking-[-0.015em] text-foreground"
  ),
  h3: heading(
    "h3",
    "mt-10 mb-3 font-display text-xl leading-snug font-medium text-foreground"
  ),
  p: (props) => <p className="my-5" {...props} />,
  a: A,
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
  code: Code,
  pre: (props) => (
    <pre
      className="my-8 overflow-x-auto rounded-xl border bg-muted/40 px-5 py-4 font-mono text-[0.8125rem] leading-6 text-foreground/85 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit"
      {...props}
    />
  ),
  hr: () => <hr className="my-12" />,
  // usable in any post without an import: <Image src="/x.png" alt="..." width={1200} height={630} />
  Image: ({ alt, ...props }: ComponentProps<typeof Image>) => (
    <Image
      alt={alt}
      className="my-8 h-auto w-full rounded-xl border"
      {...props}
    />
  ),
  Table,
  Commit,
}

export { mdxComponents }
