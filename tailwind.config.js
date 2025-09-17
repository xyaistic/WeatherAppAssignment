/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js",
     "App/**/*.{js,jsx,ts,tsx}",
     "./components/**/*.{js,jsx,ts,tsx}",
     "./screens/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#d90429",     
        secondary: "#edf2f4",         
      },
    },
  },
  plugins: [],
}
