import type { AppProps } from "next/app"
import React, { useEffect } from "react"

import { ThemeProvider, StylesProvider } from "@material-ui/core/styles"

import "../styles/globals.css"
import { FirebaseContextProvider } from "../components/FirebaseContext"
import theme from "../styles/theme"

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <FirebaseContextProvider>
          <Component {...pageProps} />
        </FirebaseContextProvider>
      </ThemeProvider>
    </StylesProvider>
  )
}

export default MyApp
