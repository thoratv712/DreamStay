/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        gold: {
          400: "#e8c777",
          500: "#d4af37",
          600: "#b3901f",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
