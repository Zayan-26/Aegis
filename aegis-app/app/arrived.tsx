import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useRef } from "react";
import {
    // SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAegisRouting } from "@/contexts/RoutingContext";

export default function ArrivedScreen() {
  const { destination, distance, duration, routeLabel } = useLocalSearchParams<{
    destination: string;
    distance: string;
    duration: string;
    routeLabel: string;
  }>();

  const { highContrast, largeButtons, notifyOn, theme } =
    useAccessibility();
  const {selected } = useAegisRouting()

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["30%", "55%", "85%"], []);

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: theme.screenBackground }}
    >
      <SafeAreaView
        style={[styles.safe, { backgroundColor: theme.screenBackground }]}
      >
        <StatusBar
          barStyle={highContrast ? "light-content" : "dark-content"}
          backgroundColor={theme.screenBackground}
        />

        {/* Map placeholder fills background */}
        <View
          style={[
            styles.mapBg,
            { backgroundColor: theme.boxBackground, borderColor: theme.boxBorderColor },
          ]}
        >
          <TouchableOpacity
            style={{ position: "absolute", top: 14, right: 14 }}
            onPress={() => router.push("/profile")}
          >
            <Text style={{ fontSize: 24, color: theme.mainTextColor }}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.mapEmoji}>🗺️</Text>
          <Text style={[styles.mapLabel, { color: theme.smallTextColor }]}>
            Journey complete
          </Text>
        </View>

        {/* Draggable bottom sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          backgroundStyle={{ backgroundColor: theme.boxBackground }}
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
            {/* Title */}
            <View style={styles.titleRow}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.title,
                    {
                      color: theme.mainTextColor,
                      fontFamily: theme.font,
                      letterSpacing: theme.letterSpacing,
                      fontSize: largeButtons ? 22 : 20,
                    },
                  ]}
                >
                  You've arrived safely
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    { color: theme.smallTextColor, fontFamily: theme.font, letterSpacing: theme.letterSpacing },
                  ]}
                >
                  {routeLabel} · {destination}
                </Text>
              </View>
            </View>

            <View
              style={[styles.divider, { backgroundColor: theme.boxBorderColor }]}
            />

            {/* Journey stats */}
            <View
              style={[
                styles.statsCard,
                {
                  backgroundColor: highContrast ? "#2A2A2A" : "#F0FAF8",
                  borderColor: theme.buttonColor,
                },
              ]}
            >
              <View style={styles.statRow}>
                <Text
                  style={[
                    styles.statLabel,
                    {
                      color: theme.smallTextColor,
                      fontFamily: theme.font,
                      fontSize: theme.labelSize,
                    },
                  ]}
                >
                  📍 Distance
                </Text>
                <Text
                  style={[
                    styles.statValue,
                    {
                      color: theme.mainTextColor,
                      fontFamily: theme.font,
                      fontSize: theme.labelSize,
                    },
                  ]}
                >
                  {selected?.distance}
                </Text>
              </View>
              <View
                style={[
                  styles.statDivider,
                  { backgroundColor: theme.boxBorderColor },
                ]}
              />
              <View style={styles.statRow}>
                <Text
                  style={[
                    styles.statLabel,
                    {
                      color: theme.smallTextColor,
                      fontFamily: theme.font,
                      fontSize: theme.labelSize,
                    },
                  ]}
                >
                  🕐 Duration
                </Text>
                <Text
                  style={[
                    styles.statValue,
                    {
                      color: theme.mainTextColor,
                      fontFamily: theme.font,
                      fontSize: theme.labelSize,
                    },
                  ]}
                >
                  {selected?.duration}
                </Text>
              </View>
            </View>

            {/* Companions notified */}
            {notifyOn && (
              <Text
                style={[
                  styles.companionText,
                  {
                    color: theme.smallTextColor,
                    fontFamily: theme.font,
                    letterSpacing: theme.letterSpacing,
                    fontSize: theme.labelSize,
                  },
                ]}
              >
                Your companions have been notified.
              </Text>
            )}

            {/* Action buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  {
                    borderColor: theme.boxBorderColor,
                    backgroundColor: theme.boxBackground,
                    paddingVertical: theme.btnPadding - 4,
                  },
                ]}
                accessibilityLabel="Save journey"
              >
                <Text
                  style={[
                    styles.actionLabel,
                    {
                      color: theme.mainTextColor,
                      fontFamily: theme.font,
                      letterSpacing: theme.letterSpacing,
                      fontSize: theme.labelSize,
                    },
                  ]}
                >
                  Save
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  {
                    borderColor: theme.boxBorderColor,
                    backgroundColor: theme.boxBackground,
                    paddingVertical: theme.btnPadding - 4,
                  },
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/feedback",
                    params: { destination, distance, duration, routeLabel },
                  })
                }
                accessibilityLabel="Give feedback"
              >
                <Text
                  style={[
                    styles.actionLabel,
                    {
                      color: theme.mainTextColor,
                      fontFamily: theme.font,
                      letterSpacing: theme.letterSpacing,
                      fontSize: theme.labelSize,
                    },
                  ]}
                >
                  Feedback
                </Text>
              </TouchableOpacity>
            </View>

            {/* Return to Home */}
            <TouchableOpacity
              style={[
                styles.homeBtn,
                {
                  backgroundColor: theme.buttonColor,
                  paddingVertical: theme.btnPadding,
                  borderRadius: theme.btnRadius,
                },
              ]}
              onPress={() => router.replace("/select-destination")}
              accessibilityLabel="Return to Home"
            >
              <Text
                style={[
                  styles.homeBtnText,
                  {
                    color: theme.buttonTextColor,
                    fontSize: theme.btnTextSize,
                    fontFamily: theme.font,
                    letterSpacing: theme.letterSpacing,
                  },
                ]}
              >
                Return to Home
              </Text>
            </TouchableOpacity>
          </BottomSheetScrollView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  mapBg: {
    flex: 1,
    margin: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  mapEmoji: { fontSize: 48, opacity: 0.3 },
  mapLabel: { fontSize: 13, opacity: 0.5 },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 48,
    gap: 14,
  },
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  shieldEmoji: { fontSize: 28, marginTop: 2 },
  title: { fontWeight: "700" },
  subtitle: { fontSize: 13, marginTop: 3 },
  divider: { height: 1, width: "100%" },
  statsCard: { borderRadius: 14, borderWidth: 1.5, padding: 14, gap: 10 },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: { fontWeight: "500" },
  statValue: { fontWeight: "700" },
  statDivider: { height: 1 },
  companionText: { lineHeight: 22 },
  actionsRow: { flexDirection: "row", gap: 12 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  actionIcon: { fontSize: 18 },
  actionLabel: { fontWeight: "600" },
  homeBtn: { width: "100%", alignItems: "center" },
  homeBtnText: { fontWeight: "700" },
});
