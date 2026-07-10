/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Atmos palette
        dust:    { DEFAULT: "#DAD7CD", 100: "#F5F4F1", 200: "#EAE8E3", 300: "#DAD7CD", 400: "#C4C0B5" },
        sage:    { DEFAULT: "#A3B18A", 100: "#D4DEC8", 200: "#C2D0AD", 300: "#A3B18A", 400: "#8A9870" },
        fern:    { DEFAULT: "#588157", 100: "#9DC49B", 200: "#73A870", 300: "#588157", 400: "#426640" },
        hunter:  { DEFAULT: "#3A5A40", 100: "#6B9670", 200: "#4E7853", 300: "#3A5A40", 400: "#2B4430" },
        pine:    { DEFAULT: "#344E41", 100: "#526F5F", 200: "#41604E", 300: "#344E41", 400: "#243828" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "atmos-dark":  "linear-gradient(135deg, #1a2e25 0%, #243828 40%, #1e2d22 100%)",
        "atmos-light": "linear-gradient(135deg, #F5F4F1 0%, #EAE8E3 50%, #DAD7CD 100%)",
        "card-dark":   "linear-gradient(135deg, rgba(52,78,65,0.6) 0%, rgba(36,56,40,0.5) 100%)",
        "card-light":  "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(245,244,241,0.65) 100%)",
      },
      boxShadow: {
        "glass-dark":  "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glass-light": "0 8px 32px rgba(52,78,65,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
        "glow-green":  "0 0 24px rgba(88,129,87,0.35)",
        "glow-red":    "0 0 24px rgba(239,68,68,0.3)",
      },
      animation: {
        "pulse-slow":   "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in":      "fadeIn 0.5s ease-out forwards",
        "slide-up":     "slideUp 0.4s ease-out forwards",
        "spin-slow":    "spin 8s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
}
