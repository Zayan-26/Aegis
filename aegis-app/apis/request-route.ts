import { LatLng } from "react-native-maps"
import { ROUTE_ENDPOINT } from "../constants/endpoints"

export type SafetyRoute = {
    coordinateArray: LatLng[],
    safetyScore: number
    duration: number,
    //it's in miliseconds. end me.
    distance: number,
    token: string
}

// export async function fetchRoutes(source: LatLng, destination: LatLng, token: string): Promise<SafetyRoute[]> {
//     const res = await fetch(ROUTE_ENDPOINT, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token, source, destination }),
//     })
//     if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`Could not get route: ${res.status} ${text}`);
//     }
//     return res.json()
// }
export async function fetchRoutes(source: LatLng, destination: LatLng): Promise<SafetyRoute[]> {
    // const res = await fetch(ROUTE_ENDPOINT, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ token, source, destination }),
    // })
    // if (!res.ok) {
    //     const text = await res.text();
    //     throw new Error(`Could not get route: ${res.status} ${text}`);
    // }
    // return res.json()
    const res = await fetch(`${ROUTE_ENDPOINT}?startLat=${source.latitude}&startLon=${source.longitude}&endLat=${destination.latitude}&endLon=${destination.longitude}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "applcation/json"
        }
    })
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Could not get route: ${res.status} ${text}`);
    }
    const response : SafetyRoute[] = await res.json()
    response.map(r => r.duration = Math.round(r.duration / 60000))
    return response
}
