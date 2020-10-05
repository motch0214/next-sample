import React, { createContext, useEffect, useState } from "react"

import firebase from "firebase/app"

type User = { id: string; name: string | null }

const FirebaseContext = createContext<{
  firebase: firebase.app.App | null
  getFirebase: () => Promise<firebase.app.App | null>
  user: User | null
  initialized: boolean
}>({
  firebase: null,
  getFirebase: async () => null,
  user: null,
  initialized: false,
})

const initialize = async () => {
  if (typeof window === "undefined") {
    return
  }

  if (!process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    console.error("firebase config not found.")
    return null
  }

  await Promise.all([import("firebase/auth"), import("firebase/analytics")])

  const config = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG)
  const app = firebase.initializeApp(config)

  // Initialzation
  app.analytics()

  return app
}
const promise = initialize()

const FirebaseContextProvider: React.FC = ({ children }) => {
  const [firebase, setFirebase] = useState<firebase.app.App | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    ;(async () => {
      setFirebase(await promise)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (firebase) {
      return firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setUser({ id: user.uid, name: user.displayName })
        } else {
          setUser(null)
        }
        setInitialized(true)
      })
    }
  }, [firebase])

  return (
    <FirebaseContext.Provider
      value={{ firebase, getFirebase: () => promise, user, initialized }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}

export default FirebaseContext
export { FirebaseContextProvider }
