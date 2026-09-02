import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f4efe0",
        paper: "#fbf7ec",
        forest: "#1b2c21",
        moss: "#3a5f45",
        leaf: "#5eae62",
        sun: "#c4a227",
        bark: "#6a4a32",
        stream: "#4d8eb5",
        ink: "#1c1a14",
        mist: "#6b6556",
        rule: "#d8d0b8",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
        ui: ["var(--font-ui)", "ui-sans-serif", "system-ui", "sans-serif"],
        pixel: ["var(--font-pixel)", "monospace"],
      },
      maxWidth: {
        page: "1080px",
      },
    },
  },
  plugins: [],
};

export default config;
