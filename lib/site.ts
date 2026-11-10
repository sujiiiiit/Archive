// the live address, for metadata and previews; Vercel sets this to the production domain
const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000"

const site = {
  name: "Sujit Dwivedi",
  description:
    "Sujit Dwivedi, a creative developer who brings design and engineering together, and learns by taking things apart and rebuilding them from scratch.",
}

export { baseUrl, site }
