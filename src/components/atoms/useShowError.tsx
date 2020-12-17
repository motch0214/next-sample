import React, { createContext, useCallback, useContext, useState } from "react"

import IconButton from "@material-ui/core/IconButton"
import Snackbar from "@material-ui/core/Snackbar"
import CloseIcon from "@material-ui/icons/Close"

export type ShowError = (message: string) => void

// eslint-disable-next-line @typescript-eslint/no-empty-function
const ErrorHandlerContext = createContext<ShowError>(() => {})

export const ErrorHandlerContextProvider: React.FC = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const showError = useCallback((message: string) => {
    setErrorMessage(message)
    setOpen(true)
  }, [])

  const handleClose = (
    _: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return
    }
    setOpen(false)
  }

  return (
    <>
      <ErrorHandlerContext.Provider value={showError}>
        {children}
      </ErrorHandlerContext.Provider>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={<span>{errorMessage}</span>}
        action={
          <IconButton color="inherit" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        }
      />
    </>
  )
}

const useShowError = (): ShowError => {
  return useContext(ErrorHandlerContext)
}

export default useShowError
