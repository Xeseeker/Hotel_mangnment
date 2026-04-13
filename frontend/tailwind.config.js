/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#faf5f0",
          100: "#f5ebe0",
          200: "#ebd5c0",
          300: "#ddb895",
          400: "#cc9562",
          500: "#b8783e",
          600: "#9d5c2a",
          700: "#7d4522",
          800: "#64371e",
          900: "#512d19",
          950: "#2b170c",
        },
        dark: {
          50: "#f8f9fa",
          100: "#f1f3f5",
          200: "#e9ecef",
          300: "#dee2e6",
          400: "#ced4da",
          500: "#adb5bd",
          600: "#868e96",
          700: "#495057",
          800: "#343a40",
          900: "#212529",
          950: "#0f1215",
        },
        gold: {
          50: "#faf6ef",
          100: "#f3ead9",
          200: "#e8d5b5",
          300: "#d9b985",
          400: "#cda66e",
          500: "#c19a5f",
          600: "#a67d45",
          700: "#8a6539",
          800: "#6e5130",
          900: "#5a4329",
        },
        cream: {
          50: "#fffdf8",
          100: "#faf6eb",
          200: "#f2e8d8",
        },
        elysium: {
          ink: "#1a1814",
          mist: "#e8e2d6",
          sand: "#d4c4a8",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      borderRadius: {
        luxury: "28px",
        "luxury-lg": "32px",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        "soft-lg": "0 10px 40px -5px rgba(0, 0, 0, 0.08)",
        glow: "0 0 28px rgba(193, 154, 95, 0.22)",
        "glow-sm": "0 0 16px rgba(193, 154, 95, 0.15)",
        panel: "0 18px 60px -28px rgba(26, 24, 20, 0.28)",
        "panel-hover": "0 24px 70px -30px rgba(26, 24, 20, 0.38)",
        glass: "0 8px 32px rgba(26, 24, 20, 0.12)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "slide-down": "slideDown 0.35s ease-out forwards",
        "float-in": "floatIn 0.65s ease-out forwards",
        "hero-breathe": "heroBreathe 16s ease-in-out infinite alternate",
        "hero-kenburns": "heroKenburns 28s ease-in-out infinite alternate",
        "reveal-up": "revealUp 0.85s ease-out forwards",
        shimmer: "shimmer 2.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floatIn: {
          "0%": { opacity: "0", transform: "translateY(24px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        heroBreathe: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.045)" },
        },
        heroKenburns: {
          "0%": { transform: "scale(1.12) translate(-1.5%, -1%)" },
          "100%": { transform: "scale(1.2) translate(1.5%, 1%)" },
        },
        revealUp: {
          "0%": { opacity: "0", transform: "translateY(1.75rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
