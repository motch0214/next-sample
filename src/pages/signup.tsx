import Head from "next/head"
import React from "react"

import SignupContainer from "components/auth/SignupContainer"

const Signup: React.FC = () => {
  return (
    <>
      <Head>
        <title>Signup | Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SignupContainer />
    </>
  )
}

export default Signup
