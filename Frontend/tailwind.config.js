/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "navbar":"#001C27",
        "signin-button":"#5C647E",
        "chapter":"#2D2C45",
        "chapter-light":"#3D3C5D"

      }
    },
  },
  plugins: [],
}