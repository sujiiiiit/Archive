import Image from "next/image"

import { HeroStream } from "@/components/home/hero/hero-stream"

function Hero() {
  return (
    <section
      id="about"
      className="flex min-h-svh w-full items-center justify-center gap-[clamp(32px,4vw,80px)] py-[6svh] max-[900px]:portrait:flex-col"
    >
      {/* a print on the wall, dimmed a touch in dark mode like a lamp-lit room */}
      {/* as tall as the screen minus the section's padding (3:4 print, so width = 88svh * 3/4), capped by the width on narrow screens */}
      {/* it fades in with the same flowtoken fade the text streams in with */}
      <figure className="@container relative w-[min(66svh,38vw)] flex-none rotate-1 animate-[ft-fadeIn_0.6s_ease-in-out] max-[900px]:portrait:w-[min(85vw,50svh)] dark:brightness-90">
        <Image
          src="/char.jpeg"
          alt="Sujit Dwivedi"
          width={6048}
          height={8064}
          priority
          sizes="(max-width: 900px) 85vw, 38vw"
          className="block h-auto w-full"
        />
        {/* a strip of tape holding the print's top-left corner to the wall */}
        <Image
          src="/paper-tape-2.png"
          alt=""
          width={306}
          height={311}
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

      <HeroStream />
    </section>
  )
}

export { Hero }
