import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

import Button from "@material-ui/core/Button"
import LinearProgress from "@material-ui/core/LinearProgress"
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
  const [emailError, setEmailError] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const [initialized, setInitialized] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (firebase) {
      if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        setStoredEmail(window.localStorage.getItem(SIGNUP_EMAIL_KEY) || "")
        setInitialized(true)
      } else {
        router.replace("/signup")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebase])

  const signup = async () => {
    setEmailError("")
    setPasswordError("")

    if (password !== confirm) {
      setPasswordError("パスワードが異なります。")
      return
    }
    if (password.length < 6) {
      setPasswordError("パスワードは6文字以上にしてください。")
      return
    }

    const firebase = await getFirebase()

    setProcessing(true)
    try {
      const response = await firebase
        .auth()
        .signInWithEmailLink(storedEmail || email, window.location.href)
        .catch((error) => {
          if (
            error.code === "auth/expired-action-code" ||
            error.code === "auth/invalid-action-code"
          ) {
            showError("リンクが失効しました。")
            router.replace("/signup")
          } else if (error.code === "auth/invalid-email") {
            setEmailError("不正なメールアドレスです。")
          } else {
            showError(error.message)
          }
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
    <div className="relative">
      {processing ? <LinearProgress className="absolute w-full" /> : null}

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        {initialized ? (
          <div className="flex flex-col items-center justify-center w-full max-w-md p-12 bg-white rounded shadow-2xl">
            <div className="mb-8 text-2xl font-bold">Signup</div>
            <TextField
              className="w-full"
              type="email"
              label="Email"
              value={storedEmail || email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!storedEmail}
              error={!!emailError}
              helperText={emailError}
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
              error={!!passwordError}
            />
            <TextField
              className="w-full mt-4"
              type="password"
              label="Password (Confirm)"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
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
        ) : null}
      </div>
    </div>
  )
}

export default SignupContinueContainer
