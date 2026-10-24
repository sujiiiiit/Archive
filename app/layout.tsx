import { Caveat, EB_Garamond, Inter, Newsreader } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

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
      </body>
    </html>
  )
}
