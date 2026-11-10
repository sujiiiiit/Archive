import Image from "next/image"

import { HeroText } from "@/components/home/hero/hero-text"
import { PanelPager } from "@/components/home/panel-pager"
import { Projects } from "@/components/home/projects"

function Hero() {
  return (
    <section
      id="about"
      className="flex w-full justify-center gap-[clamp(32px,4vw,80px)] max-[900px]:portrait:flex-col max-[900px]:portrait:items-center max-[900px]:portrait:py-[6svh]"
    >
      {/* the print stays pinned to the wall while the column beside it scrolls from the intro into the projects;
          stacked on a phone, it simply scrolls away with the page */}
      {/* self-start lets it stick beside the column; stacked, it's centred above it instead */}
      <div className="sticky top-0 flex h-svh flex-none items-center self-start max-[900px]:portrait:static max-[900px]:portrait:h-auto max-[900px]:portrait:self-center">
        {/* a print on the wall, dimmed a touch in dark mode like a lamp-lit room */}
        {/* as tall as the screen minus the section's padding (3:4 print, so width = 88svh * 3/4), capped by the width on narrow screens */}
        {/* it fades in with the same fade the text streams in with */}
        <figure className="@container relative w-[min(66svh,38vw)] rotate-1 animate-[ft-fadeIn_0.6s_ease-in-out] max-[900px]:portrait:w-[min(85vw,50svh)] dark:brightness-90">
          {/* the page's largest paint, so it's preloaded from the <head>. `sizes` mirrors the figure's
              own width rule, so the browser picks the file that matches the print at the screen's
              pixel density: sharp, without fetching more than it shows. Quality 90 keeps the
              photo's fine detail (the frames, the shirt's stripes) from going soft */}
          <Image
            src="/char.jpg"
            alt="Sujit Dwivedi"
            width={2400}
            height={3200}
            preload
            quality={90}
            sizes="(max-width: 900px) and (orientation: portrait) min(85vw, 50vh), min(66vh, 38vw)"
            className="block h-auto w-full"
          />
          {/* a strip of tape holding the print's top-left corner to the wall. Served as the original
              PNG: it's only 42KB, and recompressing it would soften its paper texture */}
          <Image
            src="/paper-tape-2.png"
            alt=""
            width={306}
            height={311}
            unoptimized
            loading="eager"
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 w-[30%] -translate-x-[30%] -translate-y-[28%] select-none"
          />
          {/* a pen note written on the print's lower left, sized off the print's width so it scales with it */}
          <p className="pointer-events-none absolute bottom-[9%] left-[6%] text-center font-hand text-[6cqw] leading-[1.05] text-[#cfcfcf] select-none max-[900px]:portrait:text-[7cqw]">
            Open to
            <br />
            learn
            <br />
            anything
          </p>
        </figure>
      </div>

      {/* the column that changes, one full screen at a time: the intro, then the projects in its place */}
      {/* stacked on a tablet it keeps its 38rem measure, centred under the print, rather than stretching edge to edge */}
      <div className="flex w-[38rem] max-w-full min-w-0 flex-col max-[900px]:portrait:w-full max-[900px]:portrait:max-w-[38rem]">
        <HeroText />
        <div
          data-panel
          className="flex h-svh items-center py-[6svh] max-[900px]:portrait:h-auto short:h-auto"
        >
          <Projects />
        </div>
      </div>
      <PanelPager />
    </section>
  )
}

export { Hero }
