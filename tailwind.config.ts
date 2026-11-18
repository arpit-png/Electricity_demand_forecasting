import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#131314", // Google Dark canvas (Google AI Studio / Gemini Dark)
        foreground: "#e8eaed", // Google Text Primary
        card: {
          DEFAULT: "#202124",  // Google Surface Container
          foreground: "#e8eaed",
        },
        popover: {
          DEFAULT: "#28292c",
          foreground: "#e8eaed",
        },
        primary: {
          DEFAULT: "#8ab4f8", // Google Blue 300 (Dark Theme Primary)
          foreground: "#041e49",
        },
        secondary: {
          DEFAULT: "#303134", // Google Surface Container Highest
          foreground: "#e8eaed",
        },
        muted: {
          DEFAULT: "#28292c",
          foreground: "#9aa0a6",
        },
        accent: {
          DEFAULT: "#81c995", // Google Green 300
          foreground: "#072711",
        },
        border: "#3c4043",    // Google Outline
        google: {
          blue: "#4285f4",
          blueDark: "#1a73e8",
          blueLight: "#8ab4f8",
          blueContainer: "#174ea6",
          red: "#ea4335",
          redDark: "#d93025",
          redLight: "#f28b82",
          redContainer: "#5c1d1d",
          yellow: "#fbbc04",
          yellowDark: "#f9ab00",
          yellowLight: "#fdd663",
          yellowContainer: "#553b00",
          green: "#34a853",
          greenDark: "#1e8e3e",
          greenLight: "#81c995",
          greenContainer: "#0d652d",
          purple: "#a142f4",
          purpleLight: "#c58af9",
          purpleContainer: "#4a154b",
          canvas: "#131314",
          surface: "#202124",
          surfaceLow: "#18191c",
          surfaceHigh: "#28292c",
          surfaceHighest: "#303134",
          outline: "#3c4043",
          outlineVariant: "#5f6368",
          textPrimary: "#e8eaed",
          textSecondary: "#9aa0a6",
        },
        grid: {
          demand: "#8ab4f8",     // Google Blue (Gross Demand)
          solar: "#fdd663",      // Google Yellow (Solar Belly)
          wind: "#81c995",       // Google Green (Wind Renewables)
          net: "#c58af9",        // Google Iris / DeepMind Purple (Net Demand / Duck Curve)
          battery: "#78d9ec",    // Google Cyan (BESS Storage Buffer)
          peaker: "#f28b82",     // Google Red (Evening Ramp & Peaker Generation)
        },
      },
      fontFamily: {
        sans: ["'Google Sans'", "'Google Sans Text'", "Roboto", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'Roboto Mono'", "'Google Sans Code'", "monospace"],
      },
      animation: {
        "shimmer": "shimmer 3s linear infinite",
        "pulse-slow": "pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ticker": "ticker 40s linear infinite",
        "float": "float 7s ease-in-out infinite",
        "google-bar": "googleGradient 6s ease infinite",
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        googleGradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
