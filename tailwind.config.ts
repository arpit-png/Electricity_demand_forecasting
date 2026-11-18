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
        background: "#09090c",
        foreground: "#f4f4f6",
        card: {
          DEFAULT: "#111115",
          foreground: "#f4f4f6",
        },
        popover: {
          DEFAULT: "#111115",
          foreground: "#f4f4f6",
        },
        primary: {
          DEFAULT: "#d4af37", // Brushed Champagne Gold
          foreground: "#09090c",
        },
        secondary: {
          DEFAULT: "#18181d",
          foreground: "#e4e4e7",
        },
        muted: {
          DEFAULT: "#1c1c22",
          foreground: "#a1a1aa",
        },
        accent: {
          DEFAULT: "#cfac62",
          foreground: "#09090c",
        },
        border: "rgba(255, 255, 255, 0.08)",
        luxury: {
          gold: "#d4af37",
          champagne: "#e6cca0",
          bronze: "#b89758",
          steel: "#788ca0",
          terracotta: "#c86754",
          sage: "#5a9a7c",
          charcoal: "#121216",
          graphite: "#18181e",
        },
        grid: {
          demand: "#788ca0",     // Smoked Steel Slate
          solar: "#d4af37",      // Brushed Champagne Gold
          wind: "#9aa9b8",       // Mist Platinum
          net: "#c86754",        // Smoked Terracotta
          battery: "#5a9a7c",    // Celadon Sage
          lstm: "#9d8ec2",       // Muted Iris
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      animation: {
        "shimmer": "shimmer 3s linear infinite",
        "pulse-slow": "pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ticker": "ticker 40s linear infinite",
        "float": "float 7s ease-in-out infinite",
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
      },
    },
  },
  plugins: [],
};

export default config;
