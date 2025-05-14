/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: '#0b1033',
        earth: '#4ade80',
        savings: '#10b981',
        investment: '#f59e0b',
        debt: '#8b5cf6',
      },
    },
  },
  plugins: [],
} 