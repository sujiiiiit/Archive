# Sujit Dwivedi — portfolio

A personal site with a blog, built with Next.js, Tailwind CSS, shadcn/ui and MDX. Every project is written up as a blog post.

## Scripts

```bash
pnpm dev        # local dev server
pnpm build      # production build
pnpm lint       # eslint
pnpm typecheck  # tsc
pnpm format     # prettier
```

## Structure

```
app/
  page.tsx            homepage: hero, projects, latest posts
  blog/               /blog and /blog/[slug]
  og/                 /og?title=… link-preview image
  rss/                /rss feed
  sitemap.ts, robots.ts, not-found.tsx
components/
  home/               homepage sections (hero/, projects, latest-posts, section-index)
  blog/               post list, reading layout, cover, commit, mdx styling, json-ld
  ui/                 shadcn primitives
content/blog/         one .mdx file per post
lib/
  posts.ts            the post registry and loader
  site.ts             site name, description, base url, date format
  seo.ts              per-post metadata and structured data
docs/                 planning notes
public/               images
mdx-components.tsx    required by @next/mdx; re-exports components/blog/mdx.tsx
```

## Writing a post

1. Add `content/blog/<slug>.mdx`, exporting its `meta`:

   ```mdx
   export const meta = {
     title: "hello, world",
     date: "2026-10-27",
     description: "A line or two, used in lists, search results and previews.",
     // optional, for a project write-up:
     cover: { type: "image", src: "/blog/placeholder.svg", alt: "…" },
     stack: ["Next.js", "TypeScript"],
     // optional 1200x630 png/jpg for link previews; otherwise /og draws the title
     image: "/blog/preview.png",
   }
   ```

2. Register it in `lib/posts.ts`.
3. For a project, point its card's `href` in `components/home/projects.tsx` to `/blog/<slug>`.

Posts can use `<Commit>`, `<Image>` and `<Table>` without importing them.

## Deploying

On Vercel the base url comes from `VERCEL_PROJECT_PRODUCTION_URL`; elsewhere it falls back to `http://localhost:3000`.
