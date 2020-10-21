import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"

import { useShowError } from "components/ApiContext"
import { useFirebase } from "components/FirebaseContext"

import { SIGNUP_EMAIL_KEY } from "./SignupContainer"

const SignupContinueContainer: React.FC = () => {
  const router = useRouter()
  const { firebase, getFirebase } = useFirebase()
  const showError = useShowError()

  const [storedEmail, setStoredEmail] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (firebase) {
      if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        setStoredEmail(window.localStorage.getItem(SIGNUP_EMAIL_KEY) || "")
      } else {
        router.replace("/signup")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebase])

  const signup = async () => {
    if (password !== confirm) {
      // TODO
      showError("Different password")
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
          showError(error.message)
        })

      const user = response && response.user
      if (!user) {
        return
      }

      await user
        .updatePassword(password)
        .then(() => {
          user.updateProfile({ displayName: name })
        })
        .then(() => {
          router.push("/")
        })
        .catch((error) => {
          // TODO
          showError(error.message)
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
