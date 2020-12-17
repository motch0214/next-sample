import { useState } from "react"

import { useFirebase } from "components/FirebaseContext"
import useShowError from "components/atoms/useShowError"

export const SIGNUP_EMAIL_KEY = "SIGNUP_EMAIL_KEY"

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useEmailSignup = ({ onSuccess }: { onSuccess: () => void }) => {
  const { getFirebase } = useFirebase()
  const showError = useShowError()

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const [processing, setProcessing] = useState(false)

  const signup = async () => {
    setEmailError("")

    const firebase = await getFirebase()

    setProcessing(true)
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
      processing,
    },
    setEmail,
    signup,
  }
}

export default useEmailSignup
