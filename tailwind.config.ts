import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ZEST Brand Colors
        primary: {
          DEFAULT: "#fcff59", // ZEST Brand Yellow
          50: "#FEFCE8",
          100: "#FEF9C3", 
          200: "#FEF08A",
          300: "#FDE047",
          400: "#FACC15",
          500: "#fcff59", // ZEST Brand Yellow
          600: "#CA8A04",
          700: "#A16207",
          800: "#854D0E",
          900: "#713F12",
        },
        // ZEST Brand Background
        zest: {
          bg: "#fcff59", // Main ZEST background color
          yellow: "#fcff59",
          black: "#000000",
          white: "#ffffff",
          "gray-light": "#f5f5f5",
        },
        dark: {
          DEFAULT: "#1A1A1A",
          50: "#F7F7F7",
          100: "#E3E3E3",
          200: "#C8C8C8",
          300: "#A4A4A4",
          400: "#717171",
          500: "#4A4A4A",
          600: "#3A3A3A",
          700: "#2A2A2A",
          800: "#1A1A1A",
          900: "#0A0A0A",
        },
        gray: {
          light: "#BFBFBF",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Montserrat", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        stencil: ["Orbitron", "Montserrat", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"], // Gaiza Stencil alternative
      },
    },
  },
  plugins: [],
};
export default config;
