import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const ROUTES = [
  {
    id: "safest",
    label: "Safest Route",
    score: 92,
    time: "24 min",
    description: "Well-lit streets, busy pedestrian area",
    borderColor: "#2D7D6F",
    bgColor: "#F0FAF8",
    textColor: "#2D7D6F",
  },
  {
    id: "fastest",
    label: "Fastest Route",
    score: null,
    time: "17 min",
    description: "Lower lighting in some sections",
    borderColor: "#E5A0A0",
    bgColor: "#FFF5F5",
    textColor: "#C0392B",
  },
];

export default function JourneyScreen() {
  const { destination } = useLocalSearchParams<{ destination: string }>();
  const { highContrast, largeButtons, theme } = useAccessibility();
  const [selectedRoute, setSelectedRoute] = useState("safest");

  const snapPoints = useMemo(() => ["15%", "45%", "85%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.screenBackground }}>
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.screenBackground }]}>
        <StatusBar
          barStyle={highContrast ? "light-content" : "dark-content"}
          backgroundColor={theme.screenBackground}
        />

        <View
          style={[
            styles.mapBox,
            { backgroundColor: theme.boxBackground, borderColor: theme.boxBorderColor },
          ]}
        >
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Text style={[styles.closeBtnText, { color: theme.mainTextColor }]}>✕</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ position: "absolute", top: 14, right: 14 }}
            onPress={() => router.push("/profile")}
          >
            <Text style={{ fontSize: 24, color: theme.mainTextColor }}>☰</Text>
          </TouchableOpacity>

          <Text style={styles.mapEmoji}>🗺️</Text>
          <Text
            style={[
              styles.mapTitle,
              { color: theme.mainTextColor, fontFamily: theme.font, letterSpacing: theme.letterSpacing },
            ]}
          >
            Map...
          </Text>
          <Text
            style={[
              styles.mapSubtitle,
              {
                color: theme.smallTextColor,
                fontFamily: theme.font,
                letterSpacing: theme.letterSpacing,
                lineHeight: theme.lineH,
              },
            ]}
          >
            Live navigation will appear here
          </Text>
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          backgroundStyle={[styles.sheetBg, { backgroundColor: theme.boxBackground }]}
          handleIndicatorStyle={{
            backgroundColor: theme.boxBorderColor,
            width: 40,
            height: 4,
          }}
        >
          <BottomSheetScrollView
            contentContainerStyle={styles.sheetContent}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.destinationRow,
                { borderBottomColor: boxBorderColor },
              ]}
            >
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

            {ROUTES.map((route) => {
              const isSelected = selectedRoute === route.id;
              const routeBg = highContrast
                ? isSelected
                  ? "#333333"
                  : "#1A1A1A"
                : route.bgColor;
              const routeBorder = highContrast
                ? isSelected
                  ? "#FFFFFF"
                  : "#444444"
                : route.borderColor;
              const routeTextColor = highContrast ? "#FFFFFF" : route.textColor;
              const routeDescColor = highContrast ? "#CCCCCC" : "#4F647A";

              return (
                <TouchableOpacity
                  key={route.id}
                  style={[
                    styles.routeCard,
                    {
                      backgroundColor: routeBg,
                      borderColor: routeBorder,
                      borderWidth: isSelected ? 2 : 1,
                      padding: largeButtons ? 16 : 12,
                    },
                  ]}
                  onPress={() => {
                    setSelectedRoute(route.id);
                    router.push({
                      pathname: "/route-detail",
                      params: { routeId: route.id, destination },
                    });
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={route.label}
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
                        {route.label}
                      </Text>
                      {route.score && (
                        <Text
                          style={[
                            styles.routeScore,
                            { color: routeTextColor, fontFamily: theme.font, letterSpacing: theme.letterSpacing },
                          ]}
                        >
                          Safety score: {route.score}
                        </Text>
                      )}
                      <Text
                        style={[
                          styles.routeDesc,
                          {
                            color: routeDescColor,
                            fontFamily: theme.font,
                            letterSpacing: theme.letterSpacing,
                            lineHeight: theme.lineH,
                          },
                        ]}
                      >
                        {route.description}
                      </Text>
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
                    {route.time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </BottomSheetScrollView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  mapBox: {
    flex: 1,
    margin: 16,
    marginBottom: 0,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 24,
  },
  mapEmoji: { fontSize: 48 },
  mapTitle: { fontSize: 16, fontWeight: "700" },
  mapSubtitle: { fontSize: 12, textAlign: "center" },
  closeBtn: {
    position: "absolute",
    top: 14,
    left: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#00000015",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: { fontSize: 16, fontWeight: "700" },
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
});