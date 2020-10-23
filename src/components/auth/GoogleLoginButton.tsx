import React from "react"

import Button, { ButtonProps } from "@material-ui/core/Button"
import clsx from "clsx"

import GoogleSvg from "images/google.svg?sprite"

import styles from "./GoogleLoginButton.module.scss"

const GoogleLoginButton: React.FC<
  {
    className?: string
    label: string
  } & Omit<ButtonProps, "classes" | "variant" | "startIcon">
> = ({ className, label, ...props }) => {
  return (
    <Button
      className={clsx(className, styles.root)}
      variant="contained"
      startIcon={<GoogleSvg className="h-font" />}
      {...props}
    >
      {label}
    </Button>
  )
}

export default GoogleLoginButton
