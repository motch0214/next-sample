import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

import Button from "@material-ui/core/Button"
import LinearProgress from "@material-ui/core/LinearProgress"
import TextField from "@material-ui/core/TextField"

import { useFirebase } from "components/FirebaseContext"
import Form from "components/atoms/Form"

import GoogleLoginButton from "./GoogleLoginButton"
import useEmailLogin from "./useEmailLogin"
import useOAuthLogin from "./useOAuthLogin"

const LoginContainer: React.FC = () => {
  const router = useRouter()
  const { getFirebase } = useFirebase()

  const email = useEmailLogin({
    onSuccess: () => router.push("/"),
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
          <div className="mb-8 text-2xl font-bold">Login</div>
          <GoogleLoginButton
            className="w-full"
            label="Login with Google"
            onClick={loginWithGoogle}
            disabled={processing}
          />
          <div className="my-4">or</div>
          <Form className="w-full" onSubmit={email.login}>
            <TextField
              className="w-full"
              label="Email"
              value={email.state.email}
              onChange={(e) => email.setEmail(e.target.value)}
              error={!!email.state.emailError}
              helperText={email.state.emailError}
            />
            <TextField
              className="w-full mt-2"
              type="password"
              label="Password"
              value={email.state.password}
              onChange={(e) => email.setPassword(e.target.value)}
            />
            <Button
              className="w-full mt-4"
              type="submit"
              color="primary"
              variant="contained"
              disabled={
                processing || !email.state.email || !email.state.password
              }
            >
              Login
            </Button>
          </Form>

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
