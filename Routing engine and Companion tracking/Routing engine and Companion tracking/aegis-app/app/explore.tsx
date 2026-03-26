// app/explore.tsx
import { router } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAccessibility } from "./AccessibilityContext";

export default function ExploreScreen() {
  const { dyslexic, colorBlind, highContrast, largeButtons } =
    useAccessibility();
  const [destination, setDestination] = useState("");

  const screenBackground = highContrast ? "#000000" : "#F7F8FC";
  const boxBackground = highContrast ? "#1A1A1A" : "#FFFFFF";
  const mainTextColor = highContrast ? "#FFFFFF" : "#1E2A78";
  const smallTextColor = highContrast ? "#CCCCCC" : "#4F647A";
  const boxBorderColor = highContrast ? "#FFFFFF" : "#D9DDE7";
  const buttonColor = colorBlind ? "#E69F00" : "#69B7C6";
  const buttonTextColor = colorBlind ? "#000000" : "#FFFFFF";
  const font = dyslexic ? "OpenDyslexic" : undefined;
  const letterSpacing = dyslexic ? 1 : 0;
  const lineH = dyslexic ? 24 : 20;
  const btnPadding = largeButtons ? 22 : 16;
  const btnRadius = largeButtons ? 20 : 16;
  const btnTextSize = largeButtons ? 20 : 17;
  const inputSize = largeButtons ? 18 : 16;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: screenBackground }]}>
      <StatusBar
        barStyle={highContrast ? "light-content" : "dark-content"}
        backgroundColor={screenBackground}
      />

      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          style={{ position: "absolute", top: 20, right: 24 }}
        >
          <Text style={{ fontSize: 24, color: mainTextColor }}>☰</Text>
        </TouchableOpacity>
        {/* ── Greeting ── */}
        <View style={styles.greetingRow}>
          <View>
            <Text
              style={[
                styles.welcomeText,
                { color: smallTextColor, fontFamily: font },
              ]}
            >
              Navigate safely. Travel confidently.
            </Text>
            <Text
              style={[
                styles.headingText,
                {
                  color: mainTextColor,
                  fontFamily: font,
                  fontSize: largeButtons ? 28 : 22,
                },
              ]}
            >
              Welcome Back !
            </Text>
          </View>
        </View>

        {/* ── Destination input ── */}
        <View
          style={[
            styles.inputBox,
            {
              backgroundColor: boxBackground,
              borderColor: boxBorderColor,
              paddingVertical: btnPadding - 4,
            },
          ]}
        >
          <Text style={styles.pinIcon}>📍</Text>
          <TextInput
            style={[
              styles.input,
              { color: mainTextColor, fontSize: inputSize, fontFamily: font },
            ]}
            placeholder="Enter your destination"
            placeholderTextColor={smallTextColor}
            value={destination}
            onChangeText={setDestination}
          />
          {destination.length > 0 && (
            <TouchableOpacity onPress={() => setDestination("")}>
              <Text style={{ color: smallTextColor, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <View
          style={[
            styles.mapBox,
            { backgroundColor: boxBackground, borderColor: boxBorderColor },
          ]}
        >
          <Text style={styles.mapEmoji}>🗺️</Text>
          <Text
            style={[
              styles.mapTitle,
              { color: mainTextColor, fontFamily: font },
            ]}
          >
            Map Loading...
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/arrived")}>
          <Text>Test Arrived</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/feedback")}>
          <Text>Test Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.startButton,
            {
              backgroundColor: buttonColor,
              paddingVertical: btnPadding,
              borderRadius: btnRadius,
              opacity: destination.length === 0 ? 0.5 : 1,
            },
          ]}
          onPress={() =>
            router.push({ pathname: "/journey", params: { destination } })
          }
          disabled={destination.length === 0}
          accessibilityRole="button"
          accessibilityLabel="Start Journey"
        >
          <Text
            style={[
              styles.startButtonText,
              {
                color: buttonTextColor,
                fontSize: btnTextSize,
                fontFamily: font,
              },
            ]}
          >
            Start Journey
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
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 24,
  },
  mapEmoji: { fontSize: 56 },
  mapTitle: { fontSize: 18, fontWeight: "700" },
  mapSubtitle: { fontSize: 14, textAlign: "center", lineHeight: 20 },

  startButton: {
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  startButtonText: { fontWeight: "700" },
});
