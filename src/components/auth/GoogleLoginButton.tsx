import React from "react"

import Button, { ButtonProps } from "@material-ui/core/Button"
import clsx from "clsx"

import GoogleSvg from "images/google.svg?sprite"

const GoogleLoginButton: React.FC<
  {
    className?: string
    label: string
  } & Omit<ButtonProps, "classes" | "variant" | "startIcon">
> = ({ className, label, ...props }) => {
  return (
    <Button
      className={clsx(className, "bg-white hover:bg-gray-100")}
      variant="contained"
      startIcon={<GoogleSvg className="h-font" />}
      {...props}
    >
      {label}
    </Button>
  )
}

export default GoogleLoginButton
