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
type RoutingContextValue = {
    candidateRoutes: SafetyRoute[]
    setCandidateRoutes: Dispatch<SetStateAction<SafetyRoute[]>>
    destination?: string
    setDestination: Dispatch<SetStateAction<string | undefined>>
}

const RoutingContext = createContext<RoutingContextValue | undefined>(undefined);

export function RoutingProvider({ children }: { children: ReactNode }) {
    const [candidateRoutes, setCandidateRoutes] = useState<SafetyRoute[]>([])
    const [destination, setDestination] = useState<string | undefined>(undefined)
    const resetRoutes = () => setCandidateRoutes([])
    const value = useMemo<RoutingContextValue>(
        () => ({ candidateRoutes, setCandidateRoutes, destination, setDestination}), [candidateRoutes],
    )
    return <RoutingContext.Provider value={value}>{children}</RoutingContext.Provider>
}

export function useSafetyRoutes(): RoutingContextValue {
    const ctx = useContext(RoutingContext)
    if (!ctx) throw new Error("useSafetyRoutes must be used within a SafetyRoutesProvider");
    return ctx
}