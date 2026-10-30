import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { Caveat, EB_Garamond, Inter, Newsreader } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { baseUrl, site } from "@/lib/site"
import { cn } from "@/lib/utils"

// the defaults every page starts from; posts fill in their own title and preview
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  // the feed readers find from the homepage; pages that set their own canonical replace this
  alternates: {
    types: { "application/rss+xml": [{ url: "/rss", title: site.name }] },
  },
  openGraph: {
    title: site.name,
    description: site.description,
    url: "/",
    siteName: site.name,
    locale: "en_US",
    type: "website",
    images: ["/og"],
  },
  twitter: { card: "summary_large_image", images: ["/og"] },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

// display serif for the name, Garamond italic for the handle and accent words
const newsreader = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-newsreader",
})

const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-eb-garamond",
})

// handwriting, only for the pencil notes scribbled beside things
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        inter.variable,
        newsreader.variable,
        garamond.variable,
        caveat.variable,
        "font-sans"
      )}
    >
      {/* extensions such as ColorZilla add attributes to <body> before React loads */}
      <body suppressHydrationWarning>
        {/* the dark theme stays in the code but is not used: the page is always light */}
        <ThemeProvider forcedTheme="light">{children}</ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
