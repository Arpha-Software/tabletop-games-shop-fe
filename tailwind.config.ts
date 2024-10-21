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
      pattern: /row-start-(\d+)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00CF67",
        secondary: "#F8FFF6",
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
