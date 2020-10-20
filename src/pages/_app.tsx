import type { AppProps } from "next/app"
import React, { useEffect } from "react"

import { ThemeProvider, StylesProvider } from "@material-ui/core/styles"

import { ApiContextProvider } from "components/ApiContext"
import { FirebaseContextProvider } from "components/FirebaseContext"

import theme from "../styles/theme"

import "../styles/globals.css"

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side")
    jssStyles?.parentElement?.removeChild(jssStyles)
  }, [])

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <FirebaseContextProvider>
          <ApiContextProvider>
            <Component {...pageProps} />
          </ApiContextProvider>
        </FirebaseContextProvider>
      </ThemeProvider>
    </StylesProvider>
  )
}

export default MyApp
