/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        drip: ["Poppins", "sans-serif"],
      },
      colors: {
        drip: "#6C63FF",
        "drip-glow": "#8E8DFF",
        "drip-bg": "#0f172a",
        "drip-contrast": "#f9fafb",
      },
      dropShadow: {
        drip: "0 0 15px #6C63FF",
      },
    },
  },
  plugins: [],
};
