/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#3BB77E',
        'brand-dark': '#253D4E',
        'brand-light': '#BCE3C9',
      },
    },
  },
  plugins: [],
}