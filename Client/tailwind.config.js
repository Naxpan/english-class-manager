/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cou: {
          100: "#e3f2fd",
          400: "#42a5f5",
          700: "#1565c0",
        },
      },
    },
  },
  plugins: [],
}
