// tailwind.config.js
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#e6f0ff",
          DEFAULT: "#1e3a8a", // azul escuro
          dark: "#0b1f4a",
          accent: "#2563eb", // azul vivo
        },
      },
    },
  },
  plugins: [],
};