/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        linkedin: {
          blue: '#0077B5',
          dark: '#004182'
        }
      }
    },
  },
  plugins: [],
} 