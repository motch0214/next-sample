import React, { createContext, useContext, useEffect, useState } from "react"

import { useFirebase } from "components/FirebaseContext"

export type User = {
  id: string
  name: string | null
  photoUrl: string | null
}

const InitialUserState = {
  user: null as User | null,
  initialized: false,
}

const UserContext = createContext(InitialUserState)

export const UserContextProvider: React.FC = ({ children }) => {
  const { firebase } = useFirebase()

  const [userState, setUserState] = useState(InitialUserState)

  useEffect(() => {
    if (firebase) {
      return firebase.auth().onAuthStateChanged((user) => {
        setUserState({
          user: user
            ? { id: user.uid, name: user.displayName, photoUrl: user.photoURL }
            : null,
          initialized: true,
        })
      })
    }
  }, [firebase])

  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  )
}

const useUserState = (): { user: User | null; initialized: boolean } => {
  return useContext(UserContext)
}

export default useUserState
