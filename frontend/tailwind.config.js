/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4e7cff',
          dark: '#6a4ef4',
          hover: '#553bb8'
        },
        background: {
          light: '#f4f8fb',
          dark: '#1c1e26',
          card: {
            light: '#dce8f2',
            dark: '#2d334a'
          }
        },
        text: {
          light: '#0d1b2a',
          dark: '#f4f4f4',
          muted: {
            light: '#555',
            dark: '#d0d3d8'
          }
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif']
      },
      boxShadow: {
        'focus': '0 0 0 3px rgba(78,124,255,0.2)'
      }
    },
  },
  plugins: [],
}
