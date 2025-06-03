/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#4B7BF5',
          light: '#6B93FF',
          dark: '#2B5BE5',
        },
        secondary: {
          main: '#3DD5B0',
          light: '#4EEBC2',
          dark: '#2DBF9A',
        },
        background: {
          dark: '#0F172A',
          paper: '#1E293B',
          card: '#334155',
        },
      },
    },
  },
  plugins: [],
}