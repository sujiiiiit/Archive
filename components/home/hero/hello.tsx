// the Mac "hello" followed by ", I'm", sized like a small note above the name:
// the word's ascenders reach the italic's cap height, both in the same muted ink
function Hello() {
  return (
    <p className="mb-[0.65em] flex items-baseline text-[clamp(1.15rem,2vw,1.9rem)] leading-none text-muted-foreground">
      <svg
        aria-label="hello"
        role="img"
        viewBox="0 0 82 30"
        className="h-[0.82em] w-auto fill-none stroke-current stroke-[2.75]"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 23.102C7.79 23.102 28.248 2.129 19.499 2c-8.75-.128-7.85 25.862-7.85 25.862s.387-12.223 7.464-12.223c7.076 0-1.158 11.966 5.018 12.352 6.175.386 15.053-11.709 8.62-11.966-6.433-.257-6.305 11.323 2.316 11.709 8.62.386 18.528-24.318 10.937-24.833-7.592-.515-6.176 24.19 1.544 24.704 7.72.515 18.914-24.447 11.065-24.833-7.849-.386-6.948 24.704 1.158 24.833 5.147-.257 3.474-12.095 10.165-11.837 3.73.257 5.275 3.088 5.146 2.959-.129-.129 1.158 8.75-5.661 8.75-6.82 0-6.047-11.967.515-11.71 5.918.515 5.146 5.662 5.275 4.247 0 .128 4.246-1.287 4.89-4.118" />
      </svg>
      <span className="font-accent italic">, I&rsquo;m</span>
    </p>
  )
}

export { Hello }
