import Head from "next/head"
import React from "react"

import SignupContinueContainer from "../../components/auth/SignupContinueContainer"

const SignupContinue: React.FC = () => {
  return (
    <>
      <Head>
        <title>Signup | Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SignupContinueContainer />
    </>
  )
}

export default SignupContinue
