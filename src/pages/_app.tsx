import type { AppProps } from "next/app"
import React from "react"

import { ThemeProvider, StylesProvider } from "@material-ui/core/styles"

import { ApiContextProvider } from "components/ApiContext"
import { FirebaseContextProvider } from "components/FirebaseContext"
import { ErrorHandlerContextProvider } from "components/atoms/useShowError"
import { UserContextProvider } from "components/auth/useUserState"

import theme from "../styles/theme"

import "../styles/globals.css"

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <FirebaseContextProvider>
          <ErrorHandlerContextProvider>
            <UserContextProvider>
              <ApiContextProvider>
                <Component {...pageProps} />
              </ApiContextProvider>
            </UserContextProvider>
          </ErrorHandlerContextProvider>
        </FirebaseContextProvider>
      </ThemeProvider>
    </StylesProvider>
  )
}

export default MyApp
