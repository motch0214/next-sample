import Link from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"

import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"

import { useShowError } from "components/ApiContext"
import { useFirebase } from "components/FirebaseContext"

import GoogleLoginButton from "./GoogleLoginButton"

const LoginContainer: React.FC = () => {
  const router = useRouter()
  const { getFirebase } = useFirebase()
  const showError = useShowError()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [processing, setProcessing] = useState(false)

  const login = async () => {
    const firebase = await getFirebase()

    setProcessing(true)
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
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
        <div className="mb-8 text-2xl font-bold">Login</div>
        <GoogleLoginButton className="w-full" label="Login with Google" />
        <div className="my-4">or</div>
        <TextField
          className="w-full"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
  )
}

export default LoginContainer
