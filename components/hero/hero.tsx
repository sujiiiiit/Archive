import Image from "next/image"

import { DesignWord } from "@/components/hero/design-word"
import { EngineeringWord } from "@/components/hero/engineering-word"
import { Hello } from "@/components/hero/hello"
import { ReverseEngineer } from "@/components/hero/reverse-engineer"

function Hero() {
  return (
    <section
      id="about"
      className="flex scroll-mt-[6svh] items-center justify-center gap-[clamp(20px,3vw,40px)] max-[700px]:flex-col"
    >
      <div className="w-[min(28.5rem,60vw)] max-[700px]:w-full">
        <Hello />
        <h1 className="mb-[0.6svh] text-[clamp(1.4rem,2.2vw,2rem)] leading-[1.2] font-medium tracking-[-0.01em] whitespace-nowrap">
          Sujit Dwivedi
        </h1>

        <div className="space-y-4 font-text text-[clamp(.9375rem,1.1vw,1.0625rem)] leading-[1.75] text-pretty text-foreground/75">
          <p>
            When asked what I do, I say software engineer. But there&rsquo;s
            more: I bring <DesignWord /> and <EngineeringWord /> together.
          </p>
          <p>
            I observe, overthink, plan, design, build, test, ship, break things,
            debug, fix them&hellip; and most of what I know came from the things
            I <ReverseEngineer /> and rebuild from scratch.
          </p>
          {/* the hero ends on this */}
          <p className="text-foreground">
            I&rsquo;m a{" "}
            <em className="font-accent text-[1.67em]">Creative Developer.</em>
          </p>
        </div>
      </div>

      {/* a print taped to the wall, dimmed a touch in dark mode like a lamp-lit room */}
      <figure className="relative mt-[clamp(28px,4vw,48px)] w-[clamp(120px,11.5vw,165px)] flex-none -rotate-1 dark:brightness-90">
        {/* taped only at the top, the bottom-left corner lifts: a wedge of shadow, thin at the tape, wide at the bottom */}
        <div
          aria-hidden
          className="absolute inset-0 origin-top translate-y-0.5 scale-y-[1.015] -skew-x-6 bg-black/40 blur-[3px] dark:bg-black/70"
        />
        <div className="relative bg-paper p-[1.6%] shadow-[0_0_1px_rgb(0_0_0/0.3)]">
          <Image
            src="/img.jpg"
            alt="Sujit Dwivedi"
            width={541}
            height={665}
            priority
            className="block h-auto w-full"
          />
        </div>

        {/*
            real paper tape cutout, 1324 x 1188. Its fold line (604px down, 50.8%) is where it bends over the print,
            so that line sits on the print's top edge. The visible tape spans x 176-1190, centred at 51.6%.
          */}
        <Image
          src="/papertape_cutout.png"
          alt=""
          width={1324}
          height={1188}
          className="absolute top-0 left-1/2 w-[63%] max-w-none translate-x-[-51.6%] translate-y-[-50.8%]"
        />
      </figure>
    </section>
  )
}

export { Hero }
