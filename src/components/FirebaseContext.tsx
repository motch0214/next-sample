import React, { createContext, useContext, useEffect, useState } from "react"

import firebase from "firebase/app"

export type Firebase = firebase.app.App

export type User = { id: string; name: string | null }

const initialize = async () => {
  if (typeof window === "undefined") {
    return null
  }

  if (!process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    console.error("firebase config not found.")
    return null
  }

  // Modules
  await Promise.all([import("firebase/auth"), import("firebase/analytics")])

  const config = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG)
  const app = firebase.initializeApp(config)

  // Initialzation
  app.analytics()

  return app
}
const promise = initialize()

const getFirebase = (): Promise<Firebase> => promise

const FirebaseContext = createContext<Firebase | null>(null)

const InitialUserState = {
  user: null as User | null,
  initialized: false,
}

const UserContext = createContext(InitialUserState)

const FirebaseContextProvider: React.FC = ({ children }) => {
  const [firebase, setFirebase] = useState<Firebase | null>(null)
  const [userState, setUserState] = useState(InitialUserState)

  useEffect(() => {
    ;(async () => {
      setFirebase(await promise)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (firebase) {
      return firebase.auth().onAuthStateChanged((user) => {
        setUserState({
          user: user ? { id: user.uid, name: user.displayName } : null,
          initialized: true,
        })
      })
    }
  }, [firebase])

  return (
    <FirebaseContext.Provider value={firebase}>
      <UserContext.Provider value={userState}>{children}</UserContext.Provider>
    </FirebaseContext.Provider>
  )
}

const useFirebase = (): {
  firebase: Firebase | null
  getFirebase: () => Promise<Firebase>
} => {
  const firebase = useContext(FirebaseContext)
  return { firebase, getFirebase }
}

const useUserState = (): { user: User | null; initialized: boolean } => {
  return useContext(UserContext)
}

export { FirebaseContextProvider, useFirebase, useUserState }
