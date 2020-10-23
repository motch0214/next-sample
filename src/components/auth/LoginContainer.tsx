import Link from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"

import Button from "@material-ui/core/Button"
import LinearProgress from "@material-ui/core/LinearProgress"
import TextField from "@material-ui/core/TextField"

import { useShowError } from "components/ApiContext"
import { useFirebase } from "components/FirebaseContext"

import GoogleLoginButton from "./GoogleLoginButton"
import useOAuthLogin from "./useOAuthLogin"

const LoginContainer: React.FC = () => {
  const router = useRouter()
  const { getFirebase } = useFirebase()
  const showError = useShowError()

  const oauth = useOAuthLogin({
    onSuccess: () => {
      router.push("/")
    },
  })

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [password, setPassword] = useState("")

  const [loginProcessing, setLoginProcessing] = useState(false)

  const loginWithGoogle = async () => {
    const firebase = await getFirebase()
    await oauth.login(new firebase.auth.GoogleAuthProvider())
  }

  const login = async () => {
    setEmailError("")

    const firebase = await getFirebase()

    setLoginProcessing(true)
    try {
      const credential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch((error) => {
          if (error.code === "auth/invalid-email") {
            setEmailError("不正なメールアドレスです。")
          } else if (
            error.code === "auth/user-not-found" ||
            error.code === "auth/user-disabled" ||
            error.code === "auth/wrong-password"
          ) {
            showError("ログインに失敗しました。")
          } else {
            showError(error.message)
          }
        })

      if (credential && credential.user) {
        router.push("/")
      }
    } finally {
      setLoginProcessing(false)
    }
  }

  const processing = loginProcessing || oauth.processing

  return (
    <div className="relative">
      {processing ? <LinearProgress className="absolute w-full" /> : null}

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        <div className="flex flex-col items-center justify-center w-full max-w-md p-12 bg-white rounded shadow-2xl">
          <div className="mb-8 text-2xl font-bold">Login</div>
          <GoogleLoginButton
            className="w-full"
            label="Login with Google"
            onClick={loginWithGoogle}
            disabled={processing}
          />
          <div className="my-4">or</div>
          <TextField
            className="w-full"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            className="w-full mt-2"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="w-full mt-4"
            color="primary"
            variant="contained"
            disabled={processing || !email || !password}
            onClick={login}
          >
            Login
          </Button>

          <div className="flex flex-col items-center w-full pt-4 mt-10 border-t border-gray-300">
            <a className="outline-none text-primary hover:text-opacity-75 focus:underline">
              Forget password?
            </a>
            <Link href="/signup">
              <a className="mt-2 outline-none text-primary hover:text-opacity-75 focus:underline">
                Create a new account
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginContainer
