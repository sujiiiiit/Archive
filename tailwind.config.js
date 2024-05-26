/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    //custom-fonts
    fontFamily: {
      Inter: ['"Inter"', "sans-serif"],
      SyoogBold: ['"SyoogBold"', "sans-serif"],
      Geist: ['"Geist"', "sans-serif"],
      GeistMono: ['"GeistMono"', "sans-serif"],
    },
    extend: {
      //custom colors
      colors: {
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        transparentWhite: "var(--graph-fill)",
      },
      //custom screen sizes
      screens: {
        xs: {
          raw: "(max-width: 580px)",
        },
      },
      //custom animation
      animation: {
        shimmer: "shimmer 8s infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
      },
      //custom keyframes
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
