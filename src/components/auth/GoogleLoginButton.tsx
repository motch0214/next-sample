import React from "react"

import MuiButton from "@material-ui/core/Button"
import clsx from "clsx"

import { useFirebase } from "components/FirebaseContext"

import styles from "./GoogleLoginButton.module.scss"

const GoogleLoginButton: React.FC<{
  className?: string
  label: string
}> = ({ className, label }) => {
  const { firebase } = useFirebase()

  const login = async () => {
    // TODO
  }

  return (
    <MuiButton
      classes={{ root: clsx(className, styles.root) }}
      variant="contained"
      startIcon={<img src="/google.svg" height="24px" width="24px" />}
      onClick={login}
    >
      {label}
    </MuiButton>
  )
}

export default GoogleLoginButton
