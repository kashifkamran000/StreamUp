/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hopbush': {
          'main' : "#E8228C",
        '50': '#fcf3f8',
        '100': '#fae9f4',
        '200': '#f7d3e9',
        '300': '#f1b0d6',
        '400': '#e87eb9',
        '500': '#df62a5',
        '600': '#ca387f',
        '700': '#af2766',
        '800': '#912354',
        '900': '#792249',
        '950': '#490e27',
    },
      'background-all' : '#0E0E12',
      'gray-box' : '#18181B',
      'black-shade' : '#242427'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

