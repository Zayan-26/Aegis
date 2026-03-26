import React, {
    createContext,
    useContext,
    useMemo,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from "react";

import type { SafetyRoute } from "@/apis/request-route";
import { NavNode } from "@/apis/request-navigation";
type RoutingContextValue = {
    candidateRoutes: SafetyRoute[]
    setCandidateRoutes: Dispatch<SetStateAction<SafetyRoute[]>>
    destination?: string
    setDestination: Dispatch<SetStateAction<string | undefined>>
    navigation: NavNode[]
    setNavigation: Dispatch<SetStateAction<NavNode[]>>
    selected?: SafetyRoute
    setSelected: Dispatch<SetStateAction<SafetyRoute | undefined>>
}

const RoutingContext = createContext<RoutingContextValue | undefined>(undefined);

export function region(candidateRoutes? : SafetyRoute[]) {
    if(!candidateRoutes) return
    const allCoords = candidateRoutes.flatMap(route => route.coordinateArray);

    const lats = allCoords.map(c => c.latitude);
    const lngs = allCoords.map(c => c.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    return {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: (maxLat - minLat) + 0.01,
        longitudeDelta: (maxLng - minLng) + 0.01,
    };
}

export function RoutingProvider({ children }: { children: ReactNode }) {
    const [candidateRoutes, setCandidateRoutes] = useState<SafetyRoute[]>([])
    const [destination, setDestination] = useState<string | undefined>(undefined)
    const [navigation, setNavigation] = useState<NavNode[]>([])
    const [selected, setSelected] = useState<SafetyRoute | undefined>(undefined)
    const resetRoutes = () => setCandidateRoutes([])
    const value = useMemo<RoutingContextValue>(
        () => ({ candidateRoutes, setCandidateRoutes, destination, setDestination, navigation, setNavigation, selected, setSelected }), [candidateRoutes],
    )
    return <RoutingContext.Provider value={value}>{children}</RoutingContext.Provider>
}

export function useAegisRouting(): RoutingContextValue {
    const ctx = useContext(RoutingContext)
    if (!ctx) throw new Error("useSafetyRoutes must be used within a SafetyRoutesProvider");
    return ctx
}