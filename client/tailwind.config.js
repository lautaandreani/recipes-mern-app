/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        soft_gray: '#101010',
        dark_gray: '#333',
      },
    },
  },
  plugins: [],
}
