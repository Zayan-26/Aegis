import { BASE_TILE_URL, DARK_TILE_URL } from "@/constants/endpoints"
import { fetchNavigation } from "@/apis/request-navigation"
import BackBtn from "@/components/back-button"
import { InternalRoutes } from "@/constants/routes"
import { useAccessibility } from "@/contexts/AccessibilityContext"
import { useAuth } from "@/contexts/AuthContext"
import { region, useAegisRouting } from "@/contexts/RoutingContext"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { router } from "expo-router"
import { push } from "expo-router/build/global-state/routing"
import { useMemo, useRef, useState } from "react"
import { StyleSheet, TouchableOpacity, View, Text, Switch } from "react-native"
import MapView, { UrlTile, Polyline } from "react-native-maps"

function Avatar({ name, color }: { name: string; color: string }) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    return (
        <View style={[styles.avatar, { backgroundColor: color }]}>
            <Text style={styles.avatarText}>{initials}</Text>
        </View>
    );
}


function TripDetails() {
    const { theme, highContrast, trustedContacts } = useAccessibility()
    const { setSelected } = useAegisRouting()
    const { token } = useAuth()
    // const { destination } = useSafetyRoutes()
    const selected = InternalRoutes[0]
    //PLACEHOLDER
    const destination = "Lorem Ipsum"
    const toggleContact = (id: string) => {
        setSharedContacts((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const sheetHeights = useMemo(() => ["15%", "50%", "95%"], []);
    const routeBg = highContrast ? "#2A2A2A" : "#b7c9ff47";
    const textColor = highContrast ? "#d0d003" : "#0e0efc"
    const backBtn = () => {
        setSelected(undefined)
    }
    const navigationBtn = async () => {
        if(token) await fetchNavigation(token, selected.token)
        router.push('/(tabs)/navigation')
    }
    const [sharedContacts, setSharedContacts] = useState<Record<string, boolean>>(
        Object.fromEntries(trustedContacts.map((c) => [c.id, true])),
    );
    return (

        <View style={[styles.container, { backgroundColor: theme.screenBackground }]}>
            <TouchableOpacity onPress={() => router.push("/profile")} style={styles.profileBtn}>
                <Text style={{ fontSize: 24, color: theme.mainTextColor }}>☰</Text>
            </TouchableOpacity>
            <BackBtn />
            <View style={[styles.mapBox, { backgroundColor: theme.boxBackground, borderColor: theme.boxBorderColor }]}>
                <MapView
                    style={{ flex: 1 }}
                    mapType="none"
                    showsPointsOfInterest={false}
                    region={selected ? region([selected]) : undefined}
                >
                    <UrlTile urlTemplate={highContrast ? DARK_TILE_URL : BASE_TILE_URL} shouldReplaceMapContent />

                    {selected ? <Polyline
                        key={selected.token}
                        coordinates={selected.coordinateArray}
                        strokeWidth={4}
                        strokeColor={highContrast ? "#d0d003" : "#2e2efc"}
                    /> : null}
                </MapView>
                <BottomSheet
                    index={1}
                    snapPoints={sheetHeights}
                    backgroundStyle={{ backgroundColor: theme.boxBackground }}
                    handleIndicatorStyle={{
                        backgroundColor: theme.boxBorderColor,
                        width: 40,
                        height: 4,
                    }}>
                    <BottomSheetScrollView
                        contentContainerStyle={styles.sheetContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.routeTitleRow}>
                            <Text
                                style={[
                                    styles.routeDestination,
                                    {
                                        fontFamily: theme.font,
                                        letterSpacing: theme.letterSpacing,
                                        fontSize: 24,
                                        color: textColor
                                    },
                                ]}
                            >
                                {destination}
                            </Text>
                        </View>
                        {/* ------------------------------- */}
                        <View
                            style={[
                                styles.infoCard,
                                { backgroundColor: routeBg },
                            ]}
                        >
                            <View style={styles.infoCardTop}>
                                <View style={styles.infoCardLeft}>
                                    <Text
                                        style={{
                                            fontSize: theme.labelSize,
                                            fontFamily: theme.font,
                                            letterSpacing: theme.letterSpacing,
                                            fontWeight: 700,
                                            color: textColor
                                        }}
                                    >
                                        Safety Score: {selected.safetyScore}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.infoDistance,
                                            {
                                                color: theme.smallTextColor,
                                                fontFamily: theme.font,
                                                letterSpacing: theme.letterSpacing,
                                            },
                                        ]}
                                    >
                                        📍 {selected.distance > 1000 ? `${~~(selected.distance / 1000)} km` : `${selected.distance} metres`}
                                    </Text>
                                </View>
                                <Text
                                    style={[
                                        styles.infoTime,
                                        {
                                            fontSize: theme.btnRadius + 2,
                                            fontFamily: theme.font,
                                            letterSpacing: theme.letterSpacing,
                                            color: textColor
                                        },
                                    ]}
                                >
                                    {
                                        ~~(selected.duration / 60) > 0 ? ` ${~~(selected.duration / 60)} Hr ` : ''
                                    }
                                    {
                                        selected.duration % 60 > 0 ? `${selected.duration % 60} Mins` : ''
                                    }
                                </Text>
                            </View>
                        </View>

                        <View
                            style={[
                                styles.card,
                                {
                                    backgroundColor: routeBg,
                                    borderColor: theme.boxBorderColor,
                                },
                            ]}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={{ fontSize: 20 }}>👥</Text>
                                <Text
                                    style={[
                                        styles.cardTitle,
                                        {
                                            color: theme.mainTextColor,
                                            fontSize: theme.labelSize + 1,
                                            fontFamily: theme.font,
                                            letterSpacing: theme.letterSpacing,
                                        },
                                    ]}
                                >
                                    Share journey with trusted contacts
                                </Text>
                            </View>
                            {trustedContacts.length === 0 ? (
                                <Text
                                    style={[
                                        styles.noContactsText,
                                        {
                                            color: theme.smallTextColor,
                                            fontFamily: theme.font,
                                            letterSpacing: theme.letterSpacing,
                                        },
                                    ]}
                                >
                                    No trusted contacts added. Go back and add some.
                                </Text>
                            ) : (
                                trustedContacts.map((contact) => (
                                    <View
                                        key={contact.id}
                                        style={[
                                            styles.contactRow,
                                            { borderTopColor: theme.boxBorderColor },
                                        ]}
                                    >
                                        <Avatar
                                            name={contact.name}
                                            color={highContrast ? "#FFFFFF" : theme.buttonColor}
                                        />
                                        <Text
                                            style={[
                                                styles.contactName,
                                                {
                                                    color: theme.mainTextColor,
                                                    fontSize: theme.labelSize,
                                                    fontFamily: theme.font,
                                                    letterSpacing: theme.letterSpacing,
                                                },
                                            ]}
                                        >
                                            {contact.name}
                                        </Text>
                                        <Switch
                                            value={sharedContacts[contact.id] ?? true}
                                            onValueChange={() => toggleContact(contact.id)}
                                            trackColor={{
                                                false: highContrast ? "#555555" : "#D9DDE7",
                                                true: highContrast ? "#FFFFFF" : theme.buttonColor,
                                            }}
                                            thumbColor={highContrast ? "#000000" : "#FFFFFF"}
                                            ios_backgroundColor={highContrast ? "#555555" : "#D9DDE7"}
                                        />
                                    </View>
                                ))
                            )}
                        </View>
                        {/* </View>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.boxBackground,
                  borderColor: theme.boxBorderColor,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: theme.mainTextColor,
                      fontSize: theme.labelSize + 1,
                      fontFamily: theme.font,
                      letterSpacing: theme.letterSpacing,
                    },
                  ]}
                >
                  Journey notifications
                </Text>
                <Switch
                  value={notifyOn}
                  onValueChange={setNotifyOn}
                  trackColor={{
                    false: highContrast ? "#555555" : "#D9DDE7",
                    true: highContrast ? "#FFFFFF" : theme.buttonColor,
                  }}
                  thumbColor={highContrast ? "#000000" : "#FFFFFF"}
                  ios_backgroundColor={highContrast ? "#555555" : "#D9DDE7"}
                />
              </View>
              {notifyOn && (
                <Text
                  style={[
                    styles.noContactsText,
                    {
                      color: theme.smallTextColor,
                      fontFamily: theme.font,
                      letterSpacing: theme.letterSpacing,
                      lineHeight: theme.lineH,
                    },
                  ]}
                >
                  Your companions will be notified when your journey starts.
                </Text>
              )}
                        </View>
                        {*/}

                        <TouchableOpacity
                        //TODO
                            onPress={() => navigationBtn()}
                            style={[
                                styles.startBtn,
                                {
                                    backgroundColor: theme.buttonColor,
                                    paddingVertical: theme.btnPadding,
                                    borderRadius: theme.btnRadius,
                                },
                            ]}
                            accessibilityRole="button"
                            accessibilityLabel="Start Navigation"
                        >
                            <Text
                                style={[
                                    styles.startBtnText,
                                    {
                                        color: theme.buttonTextColor,
                                        fontSize: theme.btnTextSize,
                                        fontFamily: theme.font,
                                        letterSpacing: theme.letterSpacing,
                                    },
                                ]}
                            >
                                Start Navigation
                            </Text>
                        </TouchableOpacity>
                        {/* ------------------------- */}
                    </BottomSheetScrollView>

                </BottomSheet>
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
    routeDestination: {
        fontWeight: "500",
        flex: 1,
        textAlign: "center",
    },
    routeTitleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    infoCard: { borderRadius: 16, borderWidth: 1.5, padding: 14 },
    infoCardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    infoCardLeft: { flex: 1, gap: 4 },
    infoScore: { fontWeight: "700" },
    infoDistance: { fontSize: 13 },
    infoDesc: { fontSize: 13 },
    infoTime: { fontWeight: "700", marginLeft: 12 },
    card: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 10 },
    cardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
    cardTitle: { fontWeight: "700", flex: 1 },
    contactRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingTop: 10,
        borderTopWidth: 1,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
    contactName: { flex: 1, fontWeight: "500" },
    noContactsText: { fontSize: 14, textAlign: "center", paddingVertical: 8 },
    startBtn: { width: "100%", alignItems: "center", marginTop: 4 },
    startBtnText: { fontWeight: "700" },
})