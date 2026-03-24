import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react"
import * as SecureStore from "expo-secure-store"

type AuthContextValue = {
    token: string | null,
    setToken: Dispatch<SetStateAction<string | null>>
    displayName: string | null,
    setDisplayName: Dispatch<SetStateAction<string | null>>
    loggedIn: () => boolean
}

const AuthContext = createContext<AuthContextValue | undefined> (undefined)

export function AuthProvider({children}: {children: ReactNode}){
    const [token, setToken] = useState<string | null> (null)
    const [displayName, setDisplayName] = useState<string | null> (null)
    useEffect(() => {
        (async () =>{
            setToken(await SecureStore.getItemAsync("token"))
            setDisplayName(await SecureStore.getItemAsync("fullName"))
        })
    }, [])

    return (
        <AuthContext.Provider value={{token, setToken, displayName, setDisplayName, loggedIn: () => token !== null && displayName !== null}}>
            {children}    
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextValue{
    const ctx = useContext(AuthContext)
    if(!ctx) throw new Error("useAuth must be used inside AuthProvider")
    return ctx
}