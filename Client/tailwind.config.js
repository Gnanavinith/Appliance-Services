/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e8f1f8',
          100: '#d1e3f1',
          200: '#a3c7e3',
          300: '#6baad1',
          400: '#3a8dbf',
          500: '#1a77b3',
          600: '#135c99',
          700: '#154a7a',
          800: '#1a365d',
          900: '#1a2a4a',
        },
        gold: {
          50: '#fef9ef',
          100: '#fdf3de',
          200: '#fae7bd',
          300: '#f6db9c',
          400: '#f2cf7b',
          500: '#d69e2e',
          600: '#b7791f',
          700: '#975a16',
          800: '#784614',
          900: '#623b12',
        },
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
