import { LatLng } from "react-native-maps"
import { ROUTE_ENDPOINT } from "./endpoints"

export type Route = {
    coordinateArray: LatLng[],
    safetyScore: number
    duration: number,
    distance: number,
    UUID: number
}

export async function fetchRoutes(source: LatLng, destination: LatLng): Promise<Route[]> {
    const res = await fetch(ROUTE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, destination }),
    })
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Could not get route: ${res.status} ${text}`);
    }
    return res.json()
}
