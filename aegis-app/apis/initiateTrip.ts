import { TRIP_ENDPOINT } from "/constants/endpoints";
import SecureStore from "expo-secure-store"

export async function initiateTrip(routeID: number, companions: number[]){
    const getKey = await SecureStore.getItemAsync("userGetKey");
    const res = await fetch(TRIP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify({
           getKey,
           routeID,
           companions
        })
    })
    if (!res.ok){
        const text = await res.text();
        throw new Error(`Could not start trip: ${res.status} ${text}`);
    }
}