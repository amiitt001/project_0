/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: "#00ff88",
        void: "#010a05",
        surface: "#05150a"
      }
    }
  },
  plugins: []
};
