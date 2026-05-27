import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      colors: {
        cream: {
          50: "#fdf9f3",
          100: "#faf2e6",
          200: "#f4e4cc",
          300: "#ecd2a8",
        },
        amber: {
          warm: "#d97742",
          glow: "#e89968",
        },
        cocoa: {
          50: "#f5ede1",
          100: "#e6d4bb",
          400: "#8a6b4f",
          600: "#5b4632",
          800: "#3a2c1e",
          900: "#241910",
        },
      },
      boxShadow: {
        cozy: "0 10px 40px -10px rgba(91, 70, 50, 0.18), 0 2px 8px -2px rgba(91, 70, 50, 0.08)",
        cozyHover:
          "0 20px 50px -15px rgba(91, 70, 50, 0.28), 0 4px 12px -4px rgba(91, 70, 50, 0.12)",
        inset: "inset 0 1px 0 0 rgba(255, 255, 255, 0.6)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
