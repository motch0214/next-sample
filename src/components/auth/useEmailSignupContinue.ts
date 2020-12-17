import { useEffect, useState } from "react"

import { useFirebase } from "components/FirebaseContext"
import useShowError from "components/atoms/useShowError"

import { SIGNUP_EMAIL_KEY } from "./useEmailSignup"

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useEmailSignupContinue = ({
  onInvalid,
  onSuccess,
}: {
  onInvalid: () => void
  onSuccess: () => void
}) => {
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
        onInvalid()
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
          console.error(error)
          if (
            error.code === "auth/expired-action-code" ||
            error.code === "auth/invalid-action-code"
          ) {
            showError("リンクが失効しました。")
            onInvalid()
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
          onSuccess()
        })
        .catch((error) => {
          console.error(error)
          showError(error.message)
        })
    } finally {
      setProcessing(false)
    }
  }

  return {
    state: {
      stored: !!storedEmail,
      email: storedEmail || email,
      emailError,
      name,
      password,
      passwordError,
      confirm,
      initialized,
      processing,
    },
    setEmail,
    setPassword,
    setConfirm,
    setName,
    signup,
  }
}

export default useEmailSignupContinue
