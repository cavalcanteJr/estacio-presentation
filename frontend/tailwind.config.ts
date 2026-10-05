import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cyber: {
          dark: "#0b0f19",
          card: "#131b2e",
          border: "#1e293b",
          accent: "#38bdf8",
          danger: "#f43f5e",
          success: "#10b981",
          warning: "#f59e0b"
        }
      },
    },
  },
  plugins: [],
};
export default config;
