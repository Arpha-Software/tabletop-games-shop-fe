import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      pattern: /col-span-(\d+)/,
    },
    {
      pattern: /row-span-(\d+)/,
    },
    {
      pattern: /col-start-(\d+)/,
    },
    {
      pattern: /row-start-(\d+)/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: 'var(--font-monsterrat-alternates)',
        secondary: 'var(--font-avenir-next-cyr)',
      },
      colors: {
        "primary": "#F18737",
        "secondary": "#E73B83",
        "secondary-50": "rgba(231, 59, 131, 0.05)",
        "secondary-100": "rgba(231, 59, 131, 0.08)",
      },
      boxShadow: {
        card: "0px 0px 4px rgba(0, 0, 0, 0.25)",
      },
      backdropBlur: {
        xs: "2px",
      }
    },
  },
  plugins: [],
};
export default config;
