import { AUTH_ENDPOINT } from "./endpoints";

export async function createAccount(fullName: string, email: string, password: string) : Promise<Error | undefined>
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