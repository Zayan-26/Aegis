// app/notifications.tsx
import { router } from "expo-router";
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAccessibility } from "./AccessibilityContext";

export default function NotificationsScreen() {
  const { dyslexic, colorBlind, highContrast, largeButtons } =
    useAccessibility();

  const screenBackground = highContrast ? "#000000" : "#F7F8FC";
  const boxBackground = highContrast ? "#1A1A1A" : "#FFFFFF";
  const mainTextColor = highContrast ? "#FFFFFF" : "#1E2A78";
  const smallTextColor = highContrast ? "#CCCCCC" : "#4F647A";
  const boxBorderColor = highContrast ? "#FFFFFF" : "#D9DDE7";
  const buttonColor = colorBlind ? "#E69F00" : "#69B7C6";
  const font = dyslexic ? "OpenDyslexic" : undefined;
  const letterSpacing = dyslexic ? 1 : 0;
  const lineH = dyslexic ? 24 : 20;
  const labelSize = largeButtons ? 17 : 15;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: screenBackground }]}>
      <StatusBar
        barStyle={highContrast ? "light-content" : "dark-content"}
        backgroundColor={screenBackground}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: boxBorderColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text
            style={[
              styles.backText,
              { color: buttonColor, fontFamily: font, letterSpacing },
            ]}
          >
            ← Back
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: mainTextColor, fontFamily: font, letterSpacing },
          ]}
        >
          Notifications
        </Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.content}>
        {/* Notification card */}
        <View
          style={[
            styles.notifCard,
            { backgroundColor: boxBackground, borderColor: buttonColor },
          ]}
        >
          <View style={styles.notifBody}>
            <Text
              style={[
                styles.notifTitle,
                {
                  color: mainTextColor,
                  fontFamily: font,
                  letterSpacing,
                  fontSize: labelSize + 1,
                },
              ]}
            >
              Companion Informed
            </Text>
            <Text
              style={[
                styles.notifMessage,
                {
                  color: smallTextColor,
                  fontFamily: font,
                  letterSpacing,
                  lineHeight: lineH,
                },
              ]}
            >
              Your companion has been informed about your journey. Stay safe!
            </Text>
          </View>
        </View>

        {/* Empty state hint */}
        <Text
          style={[
            styles.emptyText,
            { color: mainTextColor, fontFamily: font, letterSpacing },
          ]}
        >
          More notifications will appear here as you travel.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 64 },
  backText: { fontSize: 16, fontWeight: "600" },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  content: { padding: 20, gap: 16 },
  notifCard: {
    flexDirection: "row",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowColor: "#1E2A78",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  notifBody: { flex: 1, gap: 6 },
  notifTitle: { fontWeight: "700" },
  notifMessage: { fontSize: 14 },
  emptyText: { fontSize: 13, textAlign: "center", marginTop: 8 },
});
