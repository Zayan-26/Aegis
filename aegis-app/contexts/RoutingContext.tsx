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
}

const RoutingContext = createContext<RoutingContextValue | undefined>(undefined);

export function RoutingProvider({ children }: { children: ReactNode }) {
    const [candidateRoutes, setCandidateRoutes] = useState<SafetyRoute[]>([])
    const [destination, setDestination] = useState<string | undefined>(undefined)
    const [navigation, setNavigation] = useState<NavNode[]>([])
    const resetRoutes = () => setCandidateRoutes([])
    const value = useMemo<RoutingContextValue>(
        () => ({ candidateRoutes, setCandidateRoutes, destination, setDestination, navigation, setNavigation}), [candidateRoutes],
    )
    return <RoutingContext.Provider value={value}>{children}</RoutingContext.Provider>
}

export function useSafetyRoutes(): RoutingContextValue {
    const ctx = useContext(RoutingContext)
    if (!ctx) throw new Error("useSafetyRoutes must be used within a SafetyRoutesProvider");
    return ctx
}