import React from "react"

import MuiButton from "@material-ui/core/Button"
import clsx from "clsx"

import { useFirebase } from "components/FirebaseContext"

import GoogleSvg from "images/google.svg?sprite"

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
      startIcon={<GoogleSvg className="h-font" />}
      onClick={login}
    >
      {label}
    </MuiButton>
  )
}

export default GoogleLoginButton
