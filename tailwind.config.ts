import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        shell: "#F5F1E8",
        chalk: "#ECE6DA",
        graphite: "#23211D",
        ink: "#312D26",
        brass: "#9A7A42",
        olive: "#646B54",
        sage: "#7A8772"
      },
      boxShadow: {
        panel: "0 10px 35px rgba(41, 36, 30, 0.08)",
        soft: "0 3px 12px rgba(41, 36, 30, 0.08)"
      },
      borderRadius: {
        panel: "1.25rem"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["'Cormorant Garamond'", "Georgia", "serif"]
      }
    }
  },
  plugins: []
};

export default config;
