import { LatLng } from "react-native-maps"
import { ROUTE_ENDPOINT } from "./endpoints"

export type SafetyRoute = {
    coordinateArray: LatLng[],
    safetyScore: number
    duration: number,
    //it's in miliseconds. end me.
    distance: number,
    token: string
}

export async function fetchRoutes(source: LatLng, destination: LatLng, token: string): Promise<SafetyRoute[]> {
    const res = await fetch(ROUTE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, source, destination }),
    })
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Could not get route: ${res.status} ${text}`);
    }
    return res.json()
}
