import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202A",
        paper: "#F8FAFC",
        mint: "#E6F5EF",
        coral: "#FF6B5F",
        teal: "#0E7C7B"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(23, 32, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
