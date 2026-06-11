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
        // Refresh 06/06/2026 · richiesta committente: "più fresco, luminoso,
        // giovane — non platinum luxury". Blu schiarito verso il cielo
        // mediterraneo, rosso corallo vivace al posto del bordeaux, giallo sole.
        ws: {
          blue: "#2E9BE8",
          "blue-dark": "#1D7FC9",
          "blue-deeper": "#16639E",
          "blue-light": "#62B8F2",
          "blue-pale": "#EAF6FE",
          yellow: "#FFC833",
          "yellow-dark": "#E8A800",
          "yellow-light": "#FFD96B",
          red: "#E63946",
          "red-dark": "#C92836",
          "red-light": "#F2606B",
          ivory: "#FDFCF7",
          "ivory-dark": "#F4F2EA",
          dark: "#1a1a2e",
          text: "#2C2C3E",
          "text-light": "#5a5a72",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        body: ['"Nunito Sans"', "sans-serif"],
      },
      boxShadow: {
        "ws-card": "0 4px 24px rgba(46, 155, 232, 0.08)",
        "ws-card-hover": "0 22px 60px rgba(46, 155, 232, 0.16)",
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
