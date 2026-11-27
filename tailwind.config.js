/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        forest:       "#1a2e1a",
        "forest-mid": "#243824",
        "forest-light":"#2d4a2d",
        "forest-pale": "#3d5e3d",
        gold:         "#c9a84c",
        "gold-light": "#e2c97e",
        "gold-pale":  "#f0dfa0",
        slate:        "#8a9ba8",
        "slate-light":"#b0bec8",
        cream:        "#f5f0e8",
        "cream-dark": "#ede6d8",
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', "serif"],
        sans: ['"DM Sans"', "sans-serif"],
      },
      backdropBlur: {
        xs: "4px",
      },
    },
  },
  plugins: [],
};
