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
          header: "#8fa18d",
          detail: "#6f7f6d",
          cream: "#f6f1e7",
          card: "#ede6d8",
          ink: "#37413d",
          line: "#d8cebd"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(55, 65, 61, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;

