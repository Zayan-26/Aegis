import { AUTH_ENDPOINT } from "../constants/endpoints";
// import { setItemAsync } from "expo-secure-store";
import * as SecureStore from "expo-secure-store"
import * as Noitifications from 'expo-notifications'

export async function create(fullName: string, email: string, password: string, phoneNo: string) : Promise<Error | undefined>
{
    const res = await fetch(`${AUTH_ENDPOINT}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify({
           fullName,
           email,
           password,
           phoneNo
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
        await SecureStore.setItemAsync("aegis.app.token", token)
        await SecureStore.setItemAsync("aegis.app.email", email)
        await SecureStore.setItemAsync("aegis.app.fullName", fullName)
        return fullName
    }
}

export async function logout(token: string | null) : Promise<Error | undefined>{
    const res = await fetch(`${AUTH_ENDPOINT}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify({
            token
        })
    })
    if(!res.ok){
        const text = await res.text()
        return new Error(`Logout Failed: ${res.status} ${text}`)
    }
    else{
        if(token === SecureStore.getItem("aegis.app.token")){
            await SecureStore.deleteItemAsync("aegis.app.token")
            await SecureStore.deleteItemAsync("aegis.app.email")
            await SecureStore.deleteItemAsync("aegis.app.fullName")
        }
        else return
        //If you set the token and get a different one somehow then whatever bro
    }
}