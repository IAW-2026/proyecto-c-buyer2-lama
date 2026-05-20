import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
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
        soft: "var(--lama-shadow-soft)"
      }
    }
  },
  plugins: []
};

export default config;
