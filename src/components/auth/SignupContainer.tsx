import Link from "next/link"
import React, { useState } from "react"

import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"

import { useFirebase } from "components/FirebaseContext"

import GoogleLoginButton from "./GoogleLoginButton"

export const SIGNUP_EMAIL_KEY = "emailForSignup"

const SignupContainer: React.FC = () => {
  const { getFirebase } = useFirebase()

  const [email, setEmail] = useState("")

  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const signup = async () => {
    const firebase = await getFirebase()

    setProcessing(true)
    try {
      const providers = await firebase.auth().fetchSignInMethodsForEmail(email)
      if (providers.length > 0) {
        // TODO
        console.error("Email already exists.")
        return
      }

      await firebase
        .auth()
        .sendSignInLinkToEmail(email, {
          // TODO
          url: "http://localhost:3000/signup/continue",
          handleCodeInApp: true,
        })
        .then(() => {
          window.localStorage.setItem(SIGNUP_EMAIL_KEY, email)
          setSuccess(true)
        })
        .catch((error) => {
          // TODO
          console.error(error)
        })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="flex flex-col items-center justify-center w-full max-w-md p-12 bg-white rounded shadow-2xl">
        <div className="mb-8 text-2xl font-bold">Signup</div>
        {success ? (
          <div>Please check email to continue signup process.</div>
        ) : (
          <>
            <GoogleLoginButton className="w-full" label="Signup with Google" />
            <div className="my-4">or</div>
            <TextField
              className="w-full"
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
  )
}

const validateEmail = (email: string) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(email.toLowerCase())
}

export default SignupContainer
