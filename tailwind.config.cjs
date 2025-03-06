/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-gray": "#cfcfcf",
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
        sourceSansPro: ['Source Sans Pro', 'sans-serif'],
        openSans: ['Open Sans', 'sans-serif'],
        notoSans: ['Noto Sans', 'sans-serif'],
        dottie: ['Dottie', 'sans-serif'],
        merchant: ['MerchantCopy', 'sans-serif'],
        merchantDouble: ['MerchantCopyDouble', 'sans-serif'],
        merchantWide: ['MerchantCopyWide', 'sans-serif'],
      },
    },
  },
  darkMode: "class",
  plugins: [require("daisyui")],
};
