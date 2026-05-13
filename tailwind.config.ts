import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'lama-primary': '#8fa18d',
        'lama-secondary': '#6f7f6d',
        'lama-light': '#f6f1e7',
        'lama-card': '#ede6d8',
        'lama-dark': '#37413d',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
export default config
