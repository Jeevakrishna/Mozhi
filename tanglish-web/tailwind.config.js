/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'temple-yellow': '#F4C430',
        'temple-maroon': '#800020',
        'leaf-green': '#228B22',
        'paper': '#F5F5F0',
        'tamil-brown': '#3D2B1F',
      },
      fontFamily: {
        'sans': ['Noto Sans Tamil', 'sans-serif'],
        'display': ['Baloo Thambi 2', 'cursive'],
      },
      backgroundImage: {
        'kolam-pattern': "url('/images/kolam-pattern.svg')",
      }
    },
  },
  plugins: [],
}
