import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand — deep forest/teal (growth, trust, Rwandan tech identity)
        brand: {
          50: "#EAF4F1",
          100: "#CFE6DF",
          200: "#9FCDBE",
          300: "#6BB29C",
          400: "#3B937D",
          500: "#0F6B5C", // core brand
          600: "#0C5A4E",
          700: "#0A483F",
          800: "#073730",
          900: "#052721",
        },
        // Secondary — deep obsidian/charcoal for high-contrast reading outdoors
        ink: {
          50: "#F3F4F3",
          100: "#E4E6E4",
          400: "#5B625E",
          600: "#333733",
          800: "#1C201D",
          900: "#12140F",
        },
        // Gold — Rwandan sun / MoMo-adjacent accent, used sparingly for money & trust stamps
        gold: {
          400: "#F5C518",
          500: "#EFB308",
          600: "#C99400",
        },
        surface: "#F6F8F7",
        danger: "#B23A2E",
        // Trade color-coding system — signature element.
        // Mirrors real trade signifiers: pipe blue, tape amber, brick sienna, palette violet.
        trade: {
          plumber: "#2563A8",
          electrician: "#C97F00",
          cleaner: "#0F6B5C",
          painter: "#6B3FA0",
          mason: "#A0522D",
          driver: "#1E40AF",
          it: "#0E7490",
          software: "#4F46E5",
          wedding: "#DB2777",
          chef: "#EA580C",
          home: "#15803D",
          fitness: "#C026D3",
          events: "#92400E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(18,20,15,0.06), 0 2px 8px rgba(18,20,15,0.05)",
        floating: "0 8px 24px rgba(18,20,15,0.18)",
      },
      minHeight: {
        tap: "48px",
      },
      minWidth: {
        tap: "48px",
      },
    },
  },
  plugins: [],
};

export default config;
