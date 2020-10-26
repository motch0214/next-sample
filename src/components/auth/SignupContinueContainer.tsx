import { useRouter } from "next/router"
import React from "react"

import Button from "@material-ui/core/Button"
import LinearProgress from "@material-ui/core/LinearProgress"
import TextField from "@material-ui/core/TextField"

import Form from "components/atoms/Form"

import useEmailSignupContinue from "./useEmailSignupContinue"

const SignupContinueContainer: React.FC = () => {
  const router = useRouter()

  const email = useEmailSignupContinue({
    onInvalid: () => router.replace("/signup"),
    onSuccess: () => router.push("/"),
  })

  const state = email.state

  return (
    <div className="relative">
      {state.processing ? <LinearProgress className="absolute w-full" /> : null}

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        {state.initialized ? (
          <div className="flex flex-col items-center justify-center w-full max-w-md p-12 bg-white rounded shadow-2xl">
            <div className="mb-8 text-2xl font-bold">Signup</div>
            <Form className="w-full" onSubmit={email.signup}>
              <TextField
                className="w-full"
                type="email"
                label="Email"
                value={state.email}
                onChange={(e) => email.setEmail(e.target.value)}
                disabled={state.stored}
                error={!!state.emailError}
                helperText={state.emailError}
              />
              <TextField
                className="w-full mt-4"
                label="User Name"
                value={state.name}
                onChange={(e) => email.setName(e.target.value)}
              />
              <TextField
                className="w-full mt-4"
                type="password"
                label="Password"
                value={state.password}
                onChange={(e) => email.setPassword(e.target.value)}
                error={!!state.passwordError}
              />
              <TextField
                className="w-full mt-4"
                type="password"
                label="Password (Confirm)"
                value={state.confirm}
                onChange={(e) => email.setConfirm(e.target.value)}
                error={!!state.passwordError}
                helperText={state.passwordError}
              />
              <Button
                className="w-full mt-4"
                type="submit"
                color="primary"
                variant="contained"
                disabled={
                  state.processing ||
                  !state.email ||
                  !state.name ||
                  !state.password ||
                  !state.confirm
                }
              >
                Continue
              </Button>
            </Form>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default SignupContinueContainer
