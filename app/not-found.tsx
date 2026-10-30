import { ReadingPage } from "@/components/blog/reading-page"

export default function NotFound() {
  return (
    <ReadingPage back={{ href: "/", label: "Home" }}>
      <p className="text-[0.8125rem] leading-5 text-muted-foreground tabular-nums">
        404
      </p>
      <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,3rem)] leading-[1.05] font-medium tracking-[-0.025em]">
        nothing here
      </h1>
      <p className="mt-6 font-text text-[1.0625rem] leading-[1.75] text-foreground/80">
        This page doesn&rsquo;t exist, or it moved.
      </p>
    </ReadingPage>
  )
}
