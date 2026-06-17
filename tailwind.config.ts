import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Playfair Display'", "Georgia", "'Times New Roman'", "serif"]
      },
      colors: {
        lama: {
          header: "rgb(var(--lama-header) / <alpha-value>)",
          detail: "rgb(var(--lama-detail) / <alpha-value>)",
          cream: "rgb(var(--lama-cream) / <alpha-value>)",
          card: "rgb(var(--lama-card) / <alpha-value>)",
          ink: "rgb(var(--lama-ink) / <alpha-value>)",
          line: "rgb(var(--lama-line) / <alpha-value>)"
        }
      },
      boxShadow: {
        soft: "var(--lama-shadow-soft)",
        lg: "var(--lama-shadow-lg)"
      },
      animation: {
        "fade-in-up": "fadeInUp 0.7s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.6s ease-out forwards",
        "float": "float 4s ease-in-out infinite",
        "bounce-down": "bounceDown 2s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "scale-in": "scaleIn 0.5s ease-out forwards"
      }
    }
  },
  plugins: []
};

export default config;
