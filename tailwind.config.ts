import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        dream: {
          sky: "#9ee7ff",
          mist: "#eefaff",
          navy: "#16213f",
          moon: "#fff7bf",
          pony: "#d7ccff"
        }
      },
      boxShadow: {
        dream: "0 24px 80px rgba(80, 150, 210, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
