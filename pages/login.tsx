import Head from "next/head"
import React from "react"

import LoginContainer from "../components/auth/LoginContainer"

const Login: React.FC = () => {
  return (
    <>
      <Head>
        <title>Login | Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoginContainer />
    </>
  )
}

export default Login
