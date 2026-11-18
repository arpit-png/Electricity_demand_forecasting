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
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#090d16",
        },
        brand: {
          blue: "#2563eb",
          blueLight: "#60a5fa",
          amber: "#d97706",
          amberLight: "#fbbf24",
          emerald: "#059669",
          emeraldLight: "#34d399",
          rose: "#e11d48",
          roseLight: "#fb7185",
          violet: "#7c3aed",
          violetLight: "#a78bfa",
          cyan: "#0891b2",
          cyanLight: "#22d3ee",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "'SF Mono'",
          "Menlo",
          "Monaco",
          "Consolas",
          "'Liberation Mono'",
          "monospace",
        ],
      },
      animation: {
        "shimmer": "shimmer 3s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ticker": "ticker 35s linear infinite",
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
      },
    },
  },
  plugins: [],
};

export default config;
