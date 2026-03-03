/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', "sans-serif"],
      },
      colors: {
        attendance: {
          page: "#000000",
          border: "#2d2d2d",
        },
      },
    },
    // Override the default font-family to ensure it applies everywhere
    fontFamily: {
      sans: ['"IBM Plex Sans Arabic"', "sans-serif"],
    },
  },
  plugins: [],
};
