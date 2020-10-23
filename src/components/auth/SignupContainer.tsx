import Link from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"

import Button from "@material-ui/core/Button"
import LinearProgress from "@material-ui/core/LinearProgress"
import TextField from "@material-ui/core/TextField"

import { useShowError } from "components/ApiContext"
import { useFirebase } from "components/FirebaseContext"
import { validateEmail } from "utils/validations"

import GoogleLoginButton from "./GoogleLoginButton"
import useOAuthLogin from "./useOAuthLogin"

export const SIGNUP_EMAIL_KEY = "SIGNUP_EMAIL_KEY"

const SignupContainer: React.FC = () => {
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

  const [signupProcessing, setSignupProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const loginWithGoogle = async () => {
    const firebase = await getFirebase()
    await oauth.login(new firebase.auth.GoogleAuthProvider())
  }

  const signup = async () => {
    setEmailError("")

    const firebase = await getFirebase()

    setSignupProcessing(true)
    try {
      const providers = await firebase.auth().fetchSignInMethodsForEmail(email)
      if (providers.length > 0) {
        setEmailError("メールアドレスが既に使用されています。")
        return
      }

      const success = await firebase
        .auth()
        .sendSignInLinkToEmail(email, {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/signup/continue`,
          handleCodeInApp: true,
        })
        .then(() => true)
        .catch((error) => {
          // TODO
          showError(error.message)
        })

      if (success) {
        window.localStorage.setItem(SIGNUP_EMAIL_KEY, email)
        setSuccess(true)
      }
    } finally {
      setSignupProcessing(false)
    }
  }

  const processing = signupProcessing || oauth.processing

  return (
    <div className="relative">
      {processing ? <LinearProgress className="absolute w-full" /> : null}

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        <div className="flex flex-col items-center justify-center w-full max-w-md p-12 bg-white rounded shadow-2xl">
          <div className="mb-8 text-2xl font-bold">Signup</div>
          {success ? (
            <div>Please check email to continue signup process.</div>
          ) : (
            <>
              <GoogleLoginButton
                className="w-full"
                label="Signup with Google"
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
              <Button
                className="w-full mt-4"
                color="primary"
                variant="contained"
                disabled={processing || !validateEmail(email)}
                onClick={signup}
              >
                Continue
              </Button>

              <div className="flex flex-col items-center w-full pt-4 mt-10 border-t border-gray-300">
                <Link href="/login">
                  <a className="mt-2 outline-none text-primary hover:text-opacity-75 focus:underline">
                    Login with existing account
                  </a>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignupContainer
