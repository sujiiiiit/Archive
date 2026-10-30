import { posts } from "@/lib/posts"
import { baseUrl, site } from "@/lib/site"

// built once at build time, like the pages it lists
export const dynamic = "force-static"

const escape = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

// every post, newest first
export async function GET() {
  const items = (await posts.all())
    .map(
      (e) => `    <item>
      <title>${escape(e.title)}</title>
      <link>${baseUrl}/blog/${e.slug}</link>
      <guid>${baseUrl}/blog/${e.slug}</guid>
      <description>${escape(e.description)}</description>
      <pubDate>${new Date(e.date).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n")

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escape(site.name)}</title>
    <link>${baseUrl}</link>
    <description>${escape(site.description)}</description>
${items}
  </channel>
</rss>`

  return new Response(feed, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
