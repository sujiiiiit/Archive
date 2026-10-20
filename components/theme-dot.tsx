"use client"

import { useTheme } from "next-themes"

function ThemeDot() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      aria-label="Switch light and dark mode"
      title="Switch theme (d)"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="fixed top-6 right-6 grid size-8 cursor-pointer place-items-center rounded-full outline-offset-2"
    >
      <span className="size-2.5 rounded-full bg-foreground" />
    </button>
  )
}

export { ThemeDot }
