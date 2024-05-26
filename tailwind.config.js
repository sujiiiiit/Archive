/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      Inter: ['"Inter"', "sans-serif"],
      SyoogBold: ['"SyoogBold"', "sans-serif"],
      Geist: ['"Geist"', "sans-serif"],
      GeistMono: ['"GeistMono"', "sans-serif"],
    },
    extend: {
      colors: {
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        transparentWhite: "var(--graph-fill)",
      },
      screens: {
        xs: {
          raw: "(max-width: 580px)",
        },
      },
      animation: {
        shimmer: "shimmer 8s infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
      },
      keyframes: {
        shimmer: {
          "0%, 90%, 100%": {
            "background-position": "calc(-100% - var(--shimmer-width)) 0",
          },
          "30%, 60%": {
            "background-position": "calc(100% + var(--shimmer-width)) 0",
          },
        },
      },
    },
  },
  plugins: [],
};
