/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "navbar": "#001C27",
        "signin-button": "#5C647E",
        "chapter": "#2D2C45",
        "chapter-light": "#3D3C5D",
        navy: {
          500: '#1E3A8A',
          600: '#1E40AF',
        },
        gold: {
          400: '#FBBF24',
        },
      },
      screens: {
        'xs': '375px',  // Custom mobile breakpoint
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
