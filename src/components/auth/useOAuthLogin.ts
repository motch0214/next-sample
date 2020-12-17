import { useCallback, useEffect, useState } from "react"

import type firebase from "firebase"

import { useFirebase } from "components/FirebaseContext"
import useShowError from "components/atoms/useShowError"

const LOGIN_REDIRECT_KEY = "LOGIN_REDIRECT_KEY"

const useOAuthLogin = ({
  onSuccess,
}: {
  onSuccess: () => void
}): {
  login: (provider: firebase.auth.AuthProvider) => Promise<void>
  processing: boolean
} => {
  const { firebase, getFirebase } = useFirebase()
  const showError = useShowError()

  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    setProcessing(!!window.sessionStorage[LOGIN_REDIRECT_KEY])
  }, [])

  useEffect(() => {
    if (firebase) {
      ;(async () => {
        try {
          const result = await firebase
            .auth()
            .getRedirectResult()
            .catch((error) => {
              if (error.code === "auth/user-cancelled") {
                // cancelled
              } else if (
                error.code ===
                  "auth/account-exists-with-different-credential" ||
                error.code === "auth/credential-already-in-use" ||
                error.code === "auth/email-already-in-use"
              ) {
                showError("別の認証方法によるアカウントが既に存在します。")
              } else {
                showError(error.message)
              }
            })

          if (!result) {
            setProcessing(false)
            return
          }

          if (result?.additionalUserInfo?.isNewUser) {
            // Handle as signup
          }

          if (result.user) {
            onSuccess()
          } else {
            setProcessing(false)
          }
        } finally {
          window.sessionStorage.removeItem(LOGIN_REDIRECT_KEY)
        }
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebase])

  const login = useCallback(async (provider: firebase.auth.AuthProvider) => {
    setProcessing(true)
    try {
      const firebase = await getFirebase()

      window.sessionStorage[LOGIN_REDIRECT_KEY] = provider.providerId

      await firebase
        .auth()
        .signInWithRedirect(provider)
        .catch((error) => {
          showError(error.message)
          window.sessionStorage.removeItem(LOGIN_REDIRECT_KEY)
        })
    } finally {
      setProcessing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { login, processing }
}

export default useOAuthLogin
