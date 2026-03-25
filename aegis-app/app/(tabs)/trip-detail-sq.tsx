import { TILE_URL } from "@/apis/endpoints"
import BackBtn from "@/components/back-button"
import { InternalRoutes } from "@/constants/routes"
import { useAccessibility } from "@/contexts/AccessibilityContext"
import { region, useSafetyRoutes } from "@/contexts/RoutingContext"
import { router } from "expo-router"
import { StyleSheet, TouchableOpacity, View, Text } from "react-native"
import MapView, { UrlTile, Polyline } from "react-native-maps"
function TripDetails() {
    const { theme } = useAccessibility()
    // const { selected } = useSafetyRoutes()
    const selected = InternalRoutes[0]
    return (
        <View style={[styles.container, { backgroundColor: theme.screenBackground }]}>
            {/* <StatusBar backgroundColor={theme.screenBackground} /> */}
            <TouchableOpacity onPress={() => router.push("/profile")} style={styles.profileBtn}>
                <Text style={{ fontSize: 24, color: theme.mainTextColor }}>☰</Text>
            </TouchableOpacity>
            <BackBtn />
            <View style={[styles.mapBox, { backgroundColor: theme.boxBackground, borderColor: theme.boxBorderColor }]}>
                <MapView
                    style={{ flex: 1 }}
                    mapType="none"
                    showsPointsOfInterest={false}
                    // pitchEnabled={false}
                    // scrollEnabled={false}
                    region={selected? region([selected]) : undefined}
                >
                    <UrlTile urlTemplate={TILE_URL} shouldReplaceMapContent />

                    {selected? <Polyline 
                    key={selected.token}
                    coordinates={selected.coordinateArray} 
                        strokeWidth={4}
                        strokeColor="#2e2efc"
                    /> : null}
                </MapView>
            </View>
        </View>
    )
}

export default TripDetails

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
        marginVertical: 26
    },
    sheetBg: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    sheetContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 40,
        gap: 10,
    },
})