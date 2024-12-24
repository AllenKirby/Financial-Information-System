/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'lg-portrait': { raw: '(min-width: 1024px) and (orientation: portrait)' },
        'lg-landscape': { raw: '(min-width: 1024px) and (orientation: landscape)' },
      },
      fontFamily: {
        'times': ['"Times New Roman"', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        customgreen: '#009933',
        customFontColor: '#013237',
        superAdminBlue: '#00356b',
        superAdminMustard: '#F4BC1C',
        adminBlue: '#000080',
        BOGreen: '#2C5F2D',
        BOLightGreen: '#97BC62FF',
        fundingBlueGreen: '#317773',
        fundingGray: '#E2D0F9',
        preparerPrimary: '#00674F',
        preparerSecondary: '#A2A2A1',
        offWhite: '#F5F5F5',
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