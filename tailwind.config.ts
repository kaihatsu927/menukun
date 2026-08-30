import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mincho: ['"Hiragino Mincho ProN"', '"Yu Mincho"', "YuMincho", "serif"],
        maru: ['"Hiragino Maru Gothic ProN"', '"Zen Maru Gothic"', "sans-serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#1c1917",
          soft: "#44403c",
          muted: "#78716c",
        },
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
