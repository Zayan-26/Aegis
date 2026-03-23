import { AUTH_ENDPOINT } from "./endpoints";
// import { setItemAsync } from "expo-secure-store";
import * as SecureStore from "expo-secure-store"

export async function create(fullName: string, email: string, password: string) : Promise<Error | undefined>
{
    const res = await fetch(`${AUTH_ENDPOINT}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify({
           fullName,
           email,
           password
        })
    })
    if(!res.ok){
        const text = await res.text()
        return new Error(`Registration Failed: ${res.status} ${text}`)
    }
}
export async function login(email: string, password: string) : Promise<Error | string>{
    const res = await fetch(`${AUTH_ENDPOINT}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify({
            email,
            password
        })
    })
    if(!res.ok){
        const text = await res.text()
        return new Error(`Login Failed: ${res.status} ${text}`)
    }
    else{
        const {token, email, fullName} = await res.json()
        await SecureStore.setItemAsync("token", token)
        await SecureStore.setItemAsync("email", email)
        await SecureStore.setItemAsync("fullName", fullName)
        return fullName
    }
}