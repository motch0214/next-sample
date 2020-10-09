import React from "react"

import Seo from "components/Seo"
import SignupContainer from "components/auth/SignupContainer"

const Signup: React.FC = () => {
  return (
    <>
      <Seo title="Signup" />
      <SignupContainer />
    </>
  )
}

export default Signup
