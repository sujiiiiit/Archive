import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { JsonLd } from "@/components/blog/json-ld"
import { Cover } from "@/components/blog/cover"
import { ReadingPage } from "@/components/blog/reading-page"
import { posts, type PostMeta } from "@/lib/posts"
import { articleJsonLd, articleMetadata } from "@/lib/seo"
import { byline } from "@/lib/site"

type Props = { params: Promise<{ slug: string }> }

// every post is built ahead of time; a slug with no file is a 404, not a render
export const dynamicParams = false

export function generateStaticParams() {
  return posts.slugs.map((slug) => ({ slug }))
}

// the cover can be a loop or an svg, which link previews can't show, so only `image` is used for them
const article = (slug: string, meta: PostMeta) => ({
  title: meta.title,
  description: meta.description,
  date: meta.date,
  image: meta.image,
  path: `/blog/${slug}`,
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (!posts.has(slug)) return {}
  const { meta } = await posts.load(slug)
  return articleMetadata(article(slug, meta))
}

// one layout for every post: date, title, the project's thumbnail and stack if it has them, the lede, then the post
export default async function PostPage({ params }: Props) {
  const { slug } = await params
  if (!posts.has(slug)) notFound()
  const { default: Content, meta } = await posts.load(slug)

  return (
    <ReadingPage back={{ href: "/blog", label: "All posts" }}>
      <JsonLd data={articleJsonLd(article(slug, meta))} />
      <article>
        <header>
          <time
            dateTime={meta.date}
            className="block text-[0.8125rem] leading-5 text-muted-foreground tabular-nums"
          >
            {byline.format(new Date(meta.date))}
          </time>
          <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,3rem)] leading-[1.05] font-medium tracking-[-0.025em] text-balance">
            {meta.title}
          </h1>

          {meta.cover && (
            <div className="mt-10">
              <Cover {...meta.cover} />
            </div>
          )}

          {/* one height for every chip, so a wrapped second row lines up with the first */}
          {meta.stack && (
            <ul aria-label="Built with" className="mt-5 flex flex-wrap gap-2">
              {meta.stack.map((tech) => (
                <li
                  key={tech}
                  className="flex h-7 items-center rounded-full border bg-muted/40 px-3 text-xs font-medium text-muted-foreground"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-10 text-[1.1875rem] leading-[1.6] tracking-[-0.005em] text-pretty text-foreground">
            {meta.description}
          </p>
        </header>

        <hr className="my-12" />

        <div className="text-[1.0625rem] leading-[1.75] text-pretty text-foreground/80 [&>:first-child]:mt-0">
          <Content />
        </div>
      </article>
    </ReadingPage>
  )
}
