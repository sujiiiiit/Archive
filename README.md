# Sujit Dwivedi — portfolio

A personal site, built with Next.js, Tailwind CSS and shadcn/ui.

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
  page.tsx            homepage: hero, projects
  og/                 /og?title=… link-preview image
  sitemap.ts, not-found.tsx
components/
  home/               homepage sections (hero/, projects, section-index)
  layout/             reading-page, the frame for standalone pages
  ui/                 shadcn primitives
lib/
  site.ts             site name, description, base url
docs/                 planning notes
public/               images
```

## Deploying

On Vercel the base url comes from `VERCEL_PROJECT_PRODUCTION_URL`; elsewhere it falls back to `http://localhost:3000`.
