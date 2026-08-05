import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        aheers: {
          green: "#1B5E3B",
          "green-light": "#2D8A5E",
          "green-dark": "#0D3D26",
          gold: "#C9A227",
          mist: "#F3F6F4",
          cream: "#F3F6F4",
          red: "#C0392B",
          charcoal: "#1A2420",
        },
        powertrade: {
          orange: "#E65100",
          dark: "#BF360C",
        },
        grabngo: {
          teal: "#00897B",
          mint: "#4DB6AC",
        },
        buildsave: {
          slate: "#455A64",
          steel: "#607D8B",
        },
        foodworks: {
          red: "#C62828",
          warm: "#E53935",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(13, 61, 38, 0.08)",
        lift: "0 16px 40px rgba(13, 61, 38, 0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.55s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
