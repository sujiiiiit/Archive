import type { Metadata } from "next"

import { baseUrl, site } from "@/lib/site"

type Article = {
  title: string
  description: string
  date: string
  // the page's path, like /blog/hello-world
  path: string
  image?: string
}

const ogImage = ({ title, image }: Article) =>
  image ?? `/og?title=${encodeURIComponent(title)}`

// how a post shows up in search results and link previews
function articleMetadata(article: Article): Metadata {
  const { title, description, date, path } = article
  const images = [ogImage(article)]
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: date,
      url: path,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  }
}

// the same post as structured data, for search engines
function articleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    image: `${baseUrl}${ogImage(article)}`,
    url: `${baseUrl}${article.path}`,
    author: { "@type": "Person", name: site.name, url: baseUrl },
  }
}

export { articleJsonLd, articleMetadata }
