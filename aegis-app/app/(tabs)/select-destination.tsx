import { router } from "expo-router";
import { useState } from "react";
// import GetLocation from "react-native-get-location"
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import BrumMap from "@/components/map";
import { Poi } from "@/apis/request-poi";
import { fetchRoutes } from "@/apis/request-route";
import { LatLng } from "react-native-maps";
import { useSafetyRoutes } from "@/contexts/RoutingContext"
import * as Location from "expo-location"
import { useAuth } from "@/contexts/AuthContext";

const selectRoute = async (destination: LatLng, token: string | null) => {
  let { status } = await Location.requestForegroundPermissionsAsync()
  if (status != 'granted') throw Error("Permission Denied.")
  if (!token) throw Error("Not logged in. How are you here?")
  // GetLocation.getCurrentPosition({
  //   enableHighAccuracy: true,
  //   timeout: 60000
  // }).then(async source => {
  //   const routes = await fetchRoutes(source, destination)
  //   const { setCandidateRoutes } = useSafetyRoutes();
  //   setCandidateRoutes(routes)
  //   router.push("/select-route")
  // })
  Location.getLastKnownPositionAsync().then(async source => {
    const routes = await fetchRoutes({ latitude: source?.coords.latitude ?? 0, longitude: source?.coords.longitude ?? 0 }, destination, token)
    const { setCandidateRoutes } = useSafetyRoutes();
    setCandidateRoutes(routes)
    router.push("/select-route")
  })
};

export default function SelectDestination() {
  const { highContrast, largeButtons, theme } = useAccessibility();
  const [destination, setDestination] = useState<Poi | null>(null);
  const { token } = useAuth()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.screenBackground }]}>
      <StatusBar
        barStyle={highContrast ? "light-content" : "dark-content"}
        backgroundColor={theme.screenBackground}
      />

      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          style={{ position: "absolute", top: 20, right: 24 }}
        >
          <Text style={{ fontSize: 24, color: theme.mainTextColor }}>☰</Text>
        </TouchableOpacity>

        {/* ── Greeting ── */}
        <View style={styles.greetingRow}>
          <View>
            <Text
              style={[
                styles.welcomeText,
                { color: theme.smallTextColor, fontFamily: theme.font, letterSpacing: theme.letterSpacing + 1, fontSize: (theme.dyslexicFontSize ?? 16) - 1 },
              ]}
            >
              Navigate safely. Travel confidently.
            </Text>
            <Text
              style={[
                // styles.headingText,
                {
                  fontWeight: 500,
                  color: theme.mainTextColor,
                  fontFamily: theme.font,
                  // fontSize: largeButtons ? 28 : 22,
                  fontSize: (theme.dyslexicFontSize ?? 16) + 3,
                  letterSpacing: theme.letterSpacing,
                },
              ]}
            >
              {/* Welcome Back ! */}
              Hold-tap on Map to Select Destination.
            </Text>
          </View>
        </View>

        {/* ── Destination input ── */}
        {/* <View
          style={[
            styles.inputBox,
            {
              backgroundColor: theme.boxBackground,
              borderColor: theme.boxBorderColor,
              paddingVertical: theme.btnPadding - 4,
            },
          ]}
        >
          <Text style={styles.pinIcon}>📍</Text>
          <TextInput
            style={[
              styles.input,
              {
                color: theme.mainTextColor,
                fontSize: inputSize,
                fontFamily: theme.font,
                letterSpacing: theme.letterSpacing,
              },
            ]}
            placeholder="Enter your destination"
            placeholderTextColor={theme.smallTextColor}
            value={destination}
            onChangeText={setDestination}
          />
          {destination.length > 0 && (
            <TouchableOpacity onPress={() => setDestination("")}>
              <Text style={{ color: theme.smallTextColor, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View> */}

        <View
          style={[
            styles.mapBox,
            { backgroundColor: theme.boxBackground, borderColor: theme.boxBorderColor },
          ]}
        >
          {/* <Text style={styles.mapEmoji}>🗺️</Text>
          <Text
            style={[
              styles.mapTitle,
              { color: theme.mainTextColor, fontFamily: theme.font, letterSpacing: theme.letterSpacing },
            ]}
          >
            Map Loading...
          </Text> */}
          <BrumMap poiSelectCallback={setDestination} />
        </View>
        {/* 
        <TouchableOpacity onPress={() => router.push("/arrived")}>
          <Text style={{ color: theme.mainTextColor, fontFamily: theme.font }}>Test Arrived</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/feedback")}>
          <Text style={{ color: theme.mainTextColor, fontFamily: theme.font }}>Test Feedback</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[
            styles.startButton,
            {
              backgroundColor: theme.buttonColor,
              paddingVertical: theme.btnPadding,
              borderRadius: theme.btnRadius,
              opacity: destination == null ? 0.5 : 1,
            },
          ]}
          // onPress={() => router.push({ pathname: "/select-route"})}
          onPress={async () => await selectRoute({ latitude: destination?.poi_lat ?? 0, longitude: destination?.poi_lng ?? 0}, token)}
          disabled={destination == null}
          accessibilityRole="button"
          accessibilityLabel="Start Journey"
        >
          <Text
            style={[
              styles.startButtonText,
              {
                color: theme.buttonTextColor,
                fontSize: theme.btnTextSize,
                fontFamily: theme.font,
                letterSpacing: theme.letterSpacing,
              },
            ]}
          >
            {destination != null ? "Start Journey" : "Select Destination"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 16,
  },

  greetingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 15,
    marginBottom: 4,
  },
  headingText: {
    fontWeight: "700",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    gap: 10,
    shadowColor: "#1E2A78",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  pinIcon: { fontSize: 18 },
  input: { flex: 1, paddingVertical: 4 },

  mapBox: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    alignItems: "stretch",
    justifyContent: "flex-start",
    // gap: 10,
    // padding: 24,
  },
  mapEmoji: { fontSize: 56 },
  mapTitle: { fontSize: 18, fontWeight: "700" },
  mapSubtitle: { fontSize: 14, textAlign: "center", lineHeight: 20 },

  startButton: {
    width: "100%",
    alignItems: "center",
    // marginBottom: 2,
  },
  startButtonText: { fontWeight: "700" },
});