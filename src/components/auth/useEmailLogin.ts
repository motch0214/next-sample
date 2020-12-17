import { useState } from "react"

import { useFirebase } from "components/FirebaseContext"
import useShowError from "components/atoms/useShowError"

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useEmailLogin = ({ onSuccess }: { onSuccess: () => void }) => {
  const { getFirebase } = useFirebase()
  const showError = useShowError()

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [password, setPassword] = useState("")

  const [processing, setProcessing] = useState(false)

  const login = async () => {
    setEmailError("")

    if (!email || !password) {
      return
    }

    const firebase = await getFirebase()

    setProcessing(true)
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
        onSuccess()
      }
    } finally {
      setProcessing(false)
    }
  }

  return {
    state: {
      email,
      emailError,
      password,
      processing,
    },
    setEmail,
    setPassword,
    login,
  }
}

export default useEmailLogin
