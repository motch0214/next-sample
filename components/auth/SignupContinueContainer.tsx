import React, { useContext, useEffect, useState } from "react"

import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"

import FirebaseContext from "../FirebaseContext"

const SignupContinueContainer: React.FC = () => {
  const { firebase, getFirebase } = useContext(FirebaseContext)

  const [storedEmail, setStoredEmail] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!firebase) {
      return
    }

    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      setStoredEmail(window.localStorage.getItem("emailForSignup"))
    } else {
      window.location.href = "/signup"
    }
  }, [firebase])

  const signup = async () => {
    if (password !== confirm) {
      // TODO
      console.error("Different password")
      return
    }

    const firebase = await getFirebase()

    setProcessing(true)
    try {
      const response = await firebase
        .auth()
        .signInWithEmailLink(storedEmail || email, window.location.href)
        .catch((error) => {
          // TODO
          console.error(error)
        })

      if (!response) {
        return
      }
      const { user } = response

      await user
        .updatePassword(password)
        .then(() => {
          user.updateProfile({ displayName: name })
        })
        .then(() => {
          window.location.href = "/"
        })
        .catch((error) => {
          console.log(error)
        })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="flex flex-col items-center justify-center w-full max-w-md p-12 bg-white rounded shadow-2xl">
        <div className="mb-8 text-2xl font-bold">Signup</div>
        <TextField
          className="w-full"
          type="email"
          label="Email"
          value={storedEmail || email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!!storedEmail}
        />
        <TextField
          className="w-full mt-4"
          label="User Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          className="w-full mt-4"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          className="w-full mt-4"
          type="password"
          label="Password (Confirm)"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <Button
          className="w-full mt-4"
          color="primary"
          variant="contained"
          disabled={
            processing ||
            (!storedEmail && !email) ||
            !name ||
            !password ||
            !confirm
          }
          onClick={signup}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

export default SignupContinueContainer
