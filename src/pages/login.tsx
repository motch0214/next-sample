import React from "react"

import Seo from "components/Seo"
import LoginContainer from "components/auth/LoginContainer"

const Login: React.FC = () => {
  return (
    <>
      <Seo title="Login" />
      <LoginContainer />
    </>
  )
}

export default Login
