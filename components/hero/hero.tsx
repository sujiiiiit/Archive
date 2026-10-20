function Hero() {
  return (
    <main className="mx-auto flex min-h-svh max-w-310 flex-col items-center px-8 pt-[6svh] pb-[3svh] font-display">
      <section className="flex items-center justify-center gap-[clamp(20px,3vw,40px)] max-[700px]:flex-col">
        <div className="w-[min(28.5rem,60vw)]">
          <h1 className="mb-[0.6svh] text-[clamp(1.4rem,2.2vw,2rem)] leading-[1.2] font-medium tracking-[-0.01em] whitespace-nowrap">
            Sujit Dwivedi
            <small className="ml-[0.35em] font-accent text-[0.72em] font-normal text-muted-foreground italic">
              @sujiiiiit
            </small>
          </h1>

          <p className="min-h-[7em] font-text text-[clamp(.88rem,1.05vw,1rem)] leading-[1.7] text-foreground/75 max-[700px]:min-h-[9em]">
            When asked what I do, I say software engineer. Then I keep going. I
            observe, overthink, plan, design, build, ship, break things, debug,
            fix them&hellip;
            <span className="mt-[0.15em] block text-foreground">
              I&rsquo;m a{" "}
              <em className="font-accent text-[1.67em]">Creative Developer.</em>
            </span>
          </p>
        </div>

        {/* instax frame, 511 x 842: thin sides, wide bottom lip */}
        <figure className="w-[clamp(120px,11.5vw,165px)] flex-none rotate-3">
          <div className="aspect-511/842 bg-card pt-[14%] pr-[7.5%] pb-[31.5%] pl-[7%] shadow-[0_10px_28px_rgb(0_0_0/0.22)] dark:bg-primary">
            <div className="grid size-full place-items-center bg-foreground font-accent text-[0.8rem] text-background italic dark:bg-background dark:text-muted-foreground">
              photo soon
            </div>
          </div>
        </figure>
      </section>
    </main>
  )
}

export { Hero }
