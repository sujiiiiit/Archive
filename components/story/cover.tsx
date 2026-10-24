"use client"

import Image from "next/image"
import { useReducedMotion } from "motion/react"

import type { StoryMeta } from "@/lib/stories"

// the thumbnail under a story's title, in the same frame as the homepage grid's cards.
// a loop plays on its own, silently; with reduced motion it waits for play instead
function Cover({ type, src, alt }: StoryMeta["cover"]) {
  const reduce = useReducedMotion()

  return (
    <figure className="relative aspect-1200/630 overflow-hidden rounded-xl border bg-muted dark:bg-muted/50">
      {type === "image" ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 720px, 100vw"
          loading="eager"
          fetchPriority="high"
          className="object-cover"
        />
      ) : (
        <video
          // remounts when the setting changes, since autoplay only counts on load
          key={reduce ? "still" : "loop"}
          src={src}
          aria-label={alt}
          autoPlay={!reduce}
          controls={!!reduce}
          muted
          loop
          playsInline
          preload="metadata"
          className="size-full object-cover"
        />
      )}
    </figure>
  )
}

export { Cover }
