import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f4efd8",
        parchment: "#e8dfc0",
        forest: "#1c3324",
        moss: "#2d5a3d",
        leaf: "#5eae62",
        sun: "#e6c84a",
        bark: "#5a3d2b",
        stream: "#4d8eb5",
        ink: "#172117",
        mist: "#6a7a62",
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        body: ["var(--font-body)", "Georgia", "serif"],
      },
      boxShadow: {
        pixel: "4px 4px 0 0 #1c3324",
        "pixel-sun": "4px 4px 0 0 #e6c84a",
      },
    },
  },
  plugins: [],
};

export default config;
