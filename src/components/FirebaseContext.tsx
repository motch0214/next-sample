import React, { createContext, useContext, useEffect, useState } from "react"

import firebase from "firebase/app"

export type Firebase = typeof firebase

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

  return firebase
}
const promise = initialize()

export const getFirebase = (): Promise<Firebase | null> => promise

const FirebaseContext = createContext<Firebase | null>(null)

export const FirebaseContextProvider: React.FC = ({ children }) => {
  const [firebase, setFirebase] = useState<Firebase | null>(null)

  useEffect(() => {
    ;(async () => {
      setFirebase(await promise)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  )
}

/**
@example
```
const { firebase, getFirebase } = useFirebase()

useEffect(() => {
  if (firebase) {
    // Use the firebase
  }
}, [firebase])

const callback = async () => {
  const firebase = await getFirebase()
  // Use the firebase
}
```
*/
export const useFirebase = (): {
  firebase: Firebase | null
  getFirebase: () => Promise<Firebase>
} => {
  const firebase = useContext(FirebaseContext)
  return {
    firebase,
    getFirebase: getFirebase as () => Promise<Firebase>, // Firebase instance given only in browser
  }
}
