import Link from "next/link"

import { posts } from "@/lib/posts"
import { byline } from "@/lib/site"

// the blog as a list, newest first: title and date on one line, the description under it
async function PostList({ limit }: { limit?: number }) {
  const list = (await posts.all()).slice(0, limit)

  return (
    <ul>
      {list.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/blog/${post.slug}`}
            className="-mx-4 block rounded-2xl px-4 py-3 outline-offset-2 transition-colors duration-200 hover:bg-muted dark:hover:bg-muted/60"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="truncate font-display text-lg leading-snug font-medium">
                {post.title}
              </h3>
              <time
                dateTime={post.date}
                className="shrink-0 font-text text-xs text-muted-foreground tabular-nums"
              >
                {byline.format(new Date(post.date))}
              </time>
            </div>
            <p className="truncate font-text text-sm text-muted-foreground">
              {post.description}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export { PostList }
