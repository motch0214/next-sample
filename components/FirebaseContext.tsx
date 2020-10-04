import React, { createContext, useEffect, useState } from "react"

import firebase from "firebase/app"

const FirebaseContext = createContext<{
  firebase: firebase.app.App | null
  getFirebase: () => Promise<firebase.app.App | null>
}>({
  firebase: null,
  getFirebase: async () => null,
})

const initialize = async () => {
  if (typeof window === "undefined") {
    return
  }

  if (!process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    console.error("firebase config not found.")
    return null
  }

  await Promise.all([import("firebase/analytics")])

  const config = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG)
  const app = firebase.initializeApp(config)

  // Initialzation
  app.analytics()

  return app
}
const promise = initialize()

const FirebaseContextProvider: React.FC = ({ children }) => {
  const [firebase, setFirebase] = useState<firebase.app.App | null>(null)

  useEffect(() => {
    ;(async () => {
      setFirebase(await promise)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FirebaseContext.Provider value={{ firebase, getFirebase: () => promise }}>
      {children}
    </FirebaseContext.Provider>
  )
}

export default FirebaseContext
export { FirebaseContextProvider }
