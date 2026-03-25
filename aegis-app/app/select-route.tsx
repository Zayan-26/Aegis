import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import BackBtn from "@/components/back-button";
import MapView, { Polyline, UrlTile } from "react-native-maps";
import { BASE_TILE_URL, DARK_TILE_URL } from "@/apis/endpoints";
import { region, useAegisRouting } from "@/contexts/RoutingContext";
import { InternalRoutes } from "@/constants/routes";
import { SafetyRoute } from "@/apis/request-route";

const RouteConstants = {
  safest: {
    label: "Safest Route",
    borderColor: "#2D7D6F",
    bgColor: "#F0FAF8",
    baseStrokeColor: "#2D7D6F",
    darkStrokeColor: "#d28391",
    i: 1
  },
  fastest: {
    label: "Fastest Route",
    borderColor: "#E5A0A0",
    bgColor: "#FFF5F5",
    baseStrokeColor: "#C0392B",
    darkStrokeColor: "#40c6d4",
    i: 0
  }
}
function RouteSelection() {
  const { theme, highContrast } = useAccessibility();
  const { destination, setSelected, setCandidateRoutes, setDestination} = useAegisRouting()
  //Internal Routes are placeholders, just uncomment the next line and comment the next one out / delete the next one.
  const candidateRoutes = InternalRoutes
  //Hook this on once we stop using internal routes.
  const backBtnPressed = () => {
    setSelected(undefined)
    setCandidateRoutes([])
    setDestination(undefined)
  }
  type ThemeRoutePair = {
    theme: {
      label: string
      borderColor: string,
      bgColor: string,
      baseStrokeColor: string,
      darkStrokeColor: string
      i : number
    },
    route: SafetyRoute
  }
  const safest: ThemeRoutePair = {
    theme: RouteConstants.safest,
    route: candidateRoutes.sort((a, b) => b.safetyScore - a.safetyScore)[0],
  }

  const fastest: ThemeRoutePair = {
    theme: RouteConstants.fastest,
    route: candidateRoutes.sort((a, b) => a.duration - b.duration)[0],
  }


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
          region={region(candidateRoutes)}
        >
          <UrlTile urlTemplate={highContrast? DARK_TILE_URL: BASE_TILE_URL} shouldReplaceMapContent />
          {[safest, fastest].map(({ theme, route }, _) => (
            <Polyline
              key={route.token}
              coordinates={route.coordinateArray}
              strokeWidth={4}
              strokeColor={highContrast? theme.darkStrokeColor: theme.baseStrokeColor}
              zIndex={theme.i}
            />
          ))}
        </MapView>
        <BottomSheet
          index={1}
          snapPoints={["20%", "70%"]}
          backgroundStyle={[styles.sheetBg, { backgroundColor: theme.boxBackground }]}
          handleIndicatorStyle={{
            backgroundColor: theme.boxBorderColor,
            width: 40,
            height: 4,
          }}
        >
          <BottomSheetScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
            <View style={[styles.destinationRow, { borderBottomColor: theme.boxBorderColor }]}>
              <Text style={{ fontSize: 16 }}>🔍</Text>
              <Text style={{ color: theme.smallTextColor, fontSize: 11 }}>Heading to</Text>
              <Text
                style={[
                  styles.destinationText,
                  {
                    color: theme.mainTextColor,
                    fontFamily: theme.font,
                    fontSize: theme.labelSize,
                    letterSpacing: theme.letterSpacing,
                  },
                ]}
              >
                {destination}
              </Text>
            </View>
            {
              [safest, fastest].map(({ theme: routeTheme, route }, _) => {
                const routeBg = highContrast
                  ? "#1A1A1A"
                  : routeTheme.bgColor;
                const routeBorder = highContrast
                  ? "#444444"
                  : routeTheme.borderColor;
                const routeTextColor = highContrast ? "#FFFFFF" : routeTheme.baseStrokeColor;
                return (
                  <TouchableOpacity
                    key={route.token}
                    style={[
                      styles.routeCard,
                      {
                        backgroundColor: routeBg,
                        borderColor: routeBorder,
                        borderWidth: 2,
                        padding: theme.btnRadius - 4
                      },
                    ]}
                    onPress={() => {
                      setSelected(route)
                      router.push('/trip-detail')
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={routeTheme.label}
                  >
                    <View style={styles.routeLeft}>
                      <View style={styles.routeInfo}>
                        <Text
                          style={[
                            styles.routeLabel,
                            {
                              color: routeTextColor,
                              fontFamily: theme.font,
                              fontSize: theme.labelSize,
                              letterSpacing: theme.letterSpacing,
                            },
                          ]}
                        >
                          {routeTheme.label}
                        </Text>
                        {route.safetyScore && (
                          <Text
                            style={[
                              styles.routeScore,
                              { color: routeTextColor, fontFamily: theme.font, letterSpacing: theme.letterSpacing },
                            ]}
                          >
                            Safety score: {route.safetyScore}
                          </Text>
                        )}
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.routeTime,
                        {
                          color: routeTextColor,
                          fontFamily: theme.font,
                          fontSize: theme.labelSize + 2,
                          letterSpacing: theme.letterSpacing,
                        },
                      ]}
                    >
                      {
                        ~~(route.duration / 60) > 0 ? ` ${~~(route.duration / 60)} Hr ` : ''
                      }
                      {
                        route.duration % 60 > 0 ? `${route.duration % 60} Mins` : ''
                      }
                    </Text>
                  </TouchableOpacity>
                );
              })
            }
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </View>
  )
}

export default RouteSelection

const styles = StyleSheet.create({
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
  destinationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  destinationText: { fontWeight: "600", flex: 1 },
  routeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    marginBottom: 8,
  },
  routeLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  routeInfo: { flex: 1, gap: 2 },
  routeLabel: { fontWeight: "700" },
  routeScore: { fontSize: 12 },
  routeDesc: { fontSize: 12 },
  routeTime: { fontWeight: "700", marginLeft: 8 },

  //Manually doing this because I can
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
    // gap: 10,
    // padding: 24,
  },
});