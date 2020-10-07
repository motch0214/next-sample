/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require("next-compose-plugins")

module.exports = withPlugins([
  [
    require("next-optimized-images"),
    {
      responsive: {
        adapter: require("responsive-loader/sharp"),
      },
    },
  ],
])
