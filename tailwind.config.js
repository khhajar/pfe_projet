/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        //primary: '#3B82F6',
        primary: '#143D60', //'#1E3A8A',
        hoverPrimary: '#2C4FA4', // '#1E3A8A80'
        secondary: '#9B9496',
      },
    },
  },
  plugins: [],
};
