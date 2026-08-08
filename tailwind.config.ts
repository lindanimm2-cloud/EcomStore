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
        "slide-in-left": {
          "0%": { opacity: "0.6", transform: "translateX(-100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "typing-dot": {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.45" },
          "30%": { transform: "translateY(-4px)", opacity: "1" },
        },
        "msg-in": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "assistant-pulse": {
          "0%, 100%": { boxShadow: "0 12px 40px rgba(13,61,38,0.25)" },
          "50%": { boxShadow: "0 12px 40px rgba(201,162,39,0.45), 0 0 0 8px rgba(201,162,39,0.12)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "sparkle-spin": {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "40%": { transform: "rotate(12deg) scale(1.08)" },
          "70%": { transform: "rotate(-8deg) scale(0.96)" },
          "100%": { transform: "rotate(0deg) scale(1)" },
        },
        "orbit-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "soft-breathe": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.55" },
          "50%": { transform: "scale(1.35)", opacity: "1" },
        },
        "chip-in": {
          "0%": { opacity: "0", transform: "translateY(6px) scale(0.92)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "send-pop": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
        },
        "wave-bar": {
          "0%, 100%": { transform: "scaleY(0.45)" },
          "50%": { transform: "scaleY(1)" },
        },
        "panel-rise": {
          "0%": { opacity: "0", transform: "translateY(28px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.55s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
        float: "float 5s ease-in-out infinite",
        "slide-in-left": "slide-in-left 0.28s ease-out both",
        "typing-dot": "typing-dot 1s ease-in-out infinite",
        "msg-in": "msg-in 0.35s ease-out both",
        "assistant-pulse": "assistant-pulse 2.2s ease-in-out infinite",
        shimmer: "shimmer 2.8s linear infinite",
        "sparkle-spin": "sparkle-spin 2.4s ease-in-out infinite",
        "orbit-spin": "orbit-spin 8s linear infinite",
        "soft-breathe": "soft-breathe 1.8s ease-in-out infinite",
        "chip-in": "chip-in 0.4s ease-out both",
        "send-pop": "send-pop 1.6s ease-in-out infinite",
        "wave-bar": "wave-bar 0.9s ease-in-out infinite",
        "panel-rise": "panel-rise 0.45s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
