module.exports = {
  purge: [
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false,
  theme: {
    colors: require("./src/styles/colors"),
  },
  variants: {},
  plugins: [],
}
