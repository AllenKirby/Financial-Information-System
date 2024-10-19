/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'times': ['"Times New Roman"', 'serif'],
        poppins: ['Poppins', 'sans-serif'], // Add Poppins to the font family list
      },
      colors: {
        customgreen: '#009933',
        customFontColor: '#013237',
        customBg: '#eaebeb'
      },
      boxShadow: {
        'customShadowStyle': '2px 0 10px rgba(0, 0, 0, 0.2), 0 2px 10px rgba(0, 0, 0, 0.19)',
      },
      spacing: {
        'a4-width': '210mm',  // Custom A4 width
        'a4-height': '296mm', // Custom A4 height
        'long-width': '215.9mm',
        'long-height': '330.2mm'
      },
      animation: {
        blink: 'blink 2s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}