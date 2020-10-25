import Link from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"

import Button from "@material-ui/core/Button"
import LinearProgress from "@material-ui/core/LinearProgress"
import TextField from "@material-ui/core/TextField"

import { useFirebase } from "components/FirebaseContext"
import { validateEmail } from "utils/validations"

import GoogleLoginButton from "./GoogleLoginButton"
import useEmailSignup from "./useEmailSignup"
import useOAuthLogin from "./useOAuthLogin"

const SignupContainer: React.FC = () => {
  const router = useRouter()
  const { getFirebase } = useFirebase()

  const [success, setSuccess] = useState(false)

  const email = useEmailSignup({
    onSuccess: () => setSuccess(true),
  })

  const oauth = useOAuthLogin({
    onSuccess: () => router.push("/"),
  })

  const loginWithGoogle = async () => {
    const firebase = await getFirebase()
    await oauth.login(new firebase.auth.GoogleAuthProvider())
  }

  const processing = email.state.processing || oauth.processing

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
                value={email.state.email}
                onChange={(e) => email.setEmail(e.target.value)}
                error={!!email.state.emailError}
                helperText={email.state.emailError}
              />
              <Button
                className="w-full mt-4"
                color="primary"
                variant="contained"
                disabled={processing || !validateEmail(email.state.email)}
                onClick={email.signup}
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
