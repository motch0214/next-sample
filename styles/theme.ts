import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles"

import colors from "./colors"

const theme = responsiveFontSizes(
  createMuiTheme({
    typography: {
      fontFamily: "inherit",
      button: {
        textTransform: "none",
      },
    },
    palette: {
      type: "light",
      primary: { main: colors.primary },
    },
  })
)

export default theme
