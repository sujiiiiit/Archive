// the live address, for sitemap, feed and previews; Vercel sets this to the production domain
const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000"

const site = {
  name: "Sujit Dwivedi",
  description:
    "Sujit Dwivedi, a creative developer who brings design and engineering together, and learns by taking things apart and rebuilding them from scratch.",
}

// the date as it reads in a byline: 21 Oct 2026. pinned to UTC so a yyyy-mm-dd never slips a day
const byline = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

export { baseUrl, byline, site }
