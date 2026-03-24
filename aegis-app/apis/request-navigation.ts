import { LatLng } from "react-native-maps"
import { NAV_URL } from "./endpoints";

export type NavNode = {
    coordinates: LatLng,
    directions: string
}
export async function fetchNavigation(userToken: string, routeToken: string) : Promise<NavNode[]> {
    const res = await fetch(NAV_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({userToken, routeToken}),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`nearby_pois failed: ${res.status} ${text}`);
    }

    return res.json();
}