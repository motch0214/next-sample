import React from "react"

import Seo from "components/Seo"
import SignupContinueContainer from "components/auth/SignupContinueContainer"

const SignupContinue: React.FC = () => {
  return (
    <>
      <Seo title="Signup" />
      <SignupContinueContainer />
    </>
  )
}

export default SignupContinue
