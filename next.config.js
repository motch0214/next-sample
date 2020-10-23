/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require("next-compose-plugins")

module.exports = withPlugins([
  [
    require("next-pwa"),
    {
      pwa: {
        disable: process.env.NODE_ENV === "development",
        dest: "public",
        buildExcludes: [
          /static\/images\/.*$/, // Generated by next-optimized-images
        ],
      },
    },
  ],
  [
    require("next-optimized-images"),
    {
      responsive: {
        adapter: require("responsive-loader/sharp"),
      },
    },
  ],
])
