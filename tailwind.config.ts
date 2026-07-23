import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ws: {
          blue: "#2B7DD4",
          "blue-dark": "#1E5AA8",
          "blue-deeper": "#163f78",
          "blue-light": "#4a96e8",
          "blue-pale": "#e8f2fc",
          yellow: "#FFC533",
          "yellow-dark": "#e6a800",
          "yellow-light": "#ffd166",
          // Rosso acceso (da usare con moderazione) · richiesta committente 17/06/2026
          red: "#E53935",
          "red-dark": "#C62828",
          "red-light": "#EF5350",
          ivory: "#FAFAF7",
          "ivory-dark": "#F2F1EC",
          dark: "#1a1a2e",
          text: "#2C2C3E",
          "text-light": "#5a5a72",
        },
      },
      fontFamily: {
        display: ["var(--font-poppins)", "var(--font-nunito)", "sans-serif"],
        body: ["var(--font-nunito)", "sans-serif"],
        script: ["var(--font-caveat)", "cursive"],
      },
      boxShadow: {
        "ws-card": "0 4px 24px rgba(43, 125, 212, 0.07)",
        "ws-card-hover": "0 20px 56px rgba(43, 125, 212, 0.13)",
      },
      animation: {
        "ws-float": "ws-float 3s ease-in-out infinite",
        "ws-heart-pulse": "ws-heart-pulse 0.3s ease",
      },
      keyframes: {
        "ws-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "ws-heart-pulse": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
