import { BASE_TILE_URL, DARK_TILE_URL } from "@/apis/endpoints"
import { NavNode } from "@/apis/request-navigation"
import BackBtn from "@/components/back-button"
import { InternalRoutes } from "@/constants/routes"
import { useAccessibility } from "@/contexts/AccessibilityContext"
import { region, useAegisRouting } from "@/contexts/RoutingContext"
import { router } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { TouchableOpacity, View } from "react-native"
import { StyleSheet, Text } from "react-native"
import MapView, { Polyline, UrlTile } from "react-native-maps"
import Ionicons from "@expo/vector-icons/Ionicons"
import getDistance from 'geolib/es/getDistance';
import * as Location from "expo-location"
import { InternalNav } from "@/constants/nav"
import { createSocket, endTrip, locationUpdate, startTrip } from "@/apis/websocket-trip"
import { useAuth } from "@/contexts/AuthContext"

const Icons = {
    forward: 'arrow-up',
    right: 'arrow-forwad',
    left: 'arrow-back'
}
const getIcon: (instruction: string) => string | null = (instruction: string) => {
    try {
        const l = instruction.split(' ')
        if (l[0] === 'Continue' || l[0] === 'Keep') return Icons.forward
        else if (l[0] === 'Turn') {
            switch (l[1]) {
                case 'Left':
                    return Icons.left
                case 'Right':
                    return Icons.right
                default:
                    return null
            }
        }
    } finally { return null }
}

function Navigation() {
    // TODO: once the endpoints are set up again change this back from the internal placeholder
    // const { navigation, selected } = useAegisRouting()
    const navigation = InternalNav
    const selected = InternalRoutes[0]
    const socket = createSocket()
    const { token } = useAuth()

    if (token && selected) startTrip(token, selected?.token, socket)
    else throw Error("Token or selected route missing. You're not supposed to be here.")

    var StepNum = 0
    const { theme, highContrast } = useAccessibility()
    const [currentNN, setNN] = useState<NavNode | undefined>(undefined)

    async function Poll() {
        const location = await Location.getLastKnownPositionAsync()
        if (!location || !currentNN) return
        if (getDistance({ longitude: location?.coords.longitude, latitude: location?.coords.latitude }, { longitude: currentNN.coordinates.longitude, latitude: currentNN.coordinates.latitude }) < 10) {
            Step()
        }
        if (token) if (location) locationUpdate(token, location.coords, socket)
            else throw Error("Location not found.")
        else throw Error("User Token doesn't exist.")
    }
    async function Step() {
        if (StepNum < navigation.length - 2) {
            StepNum++
            setNN(navigation[StepNum])
        }
        else if (currentNN === navigation.at(-1)) {
            if (token) if (selected) { endTrip(token, selected.token, socket); Cleanup() }
                else throw Error("We're all out of nodes (I got hungry")
            else throw Error("User token doesn't exist.")
        }
    }
    function Cleanup() {

    }
    useEffect(() => {

    }, [currentNN])

    //TODO
    return (
        <View style={[styles.container, { backgroundColor: theme.screenBackground }]}>
            <TouchableOpacity onPress={() => router.push("/profile")} style={styles.profileBtn}>
                <Text style={{ fontSize: 24, color: theme.mainTextColor }}>☰</Text>
            </TouchableOpacity>
            <BackBtn />
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    paddingTop: 16,
                    paddingBottom: 16,
                    backgroundColor: theme.boxBackground
                }}
            >
                <Ionicons name='arrow-back' size={64} style={{ paddingHorizontal: 28 }} />
                <Text style={{ paddingHorizontal: 28, flex: 1, fontSize: (theme.dyslexicFontSize ?? 13) + 30 }}>
                    HI
                </Text>
            </View>
            <View style={[styles.mapBox, { backgroundColor: theme.boxBackground, borderColor: theme.boxBorderColor }]}>
                <MapView
                    style={{ flex: 1 }}
                    mapType="none"
                    showsPointsOfInterest={false}
                    // region={selected ? region([selected]) : undefined}
                    followsUserLocation={true}
                    showsUserLocation={true}
                    region={{ longitude: selected.coordinateArray[0].longitude, latitude: selected.coordinateArray[0].latitude, latitudeDelta: 0.001, longitudeDelta: 0.001 }}
                >
                    <UrlTile urlTemplate={highContrast ? DARK_TILE_URL : BASE_TILE_URL} shouldReplaceMapContent />
                </MapView>
            </View>
        </View>
    )
}
export default Navigation
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
        gap: 16,
    },
    profileBtn: {
        position: "absolute",
        top: 20,
        right: 24
    },
    mapBox: {
        flex: 1,
        borderRadius: 20,
        borderWidth: 1,
        overflow: "hidden",
        alignItems: "stretch",
        justifyContent: "flex-start",
        marginTop: 6,
        marginBottom: 26
    }
})