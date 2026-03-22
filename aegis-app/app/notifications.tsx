import { router } from "expo-router";
import {
  // SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { SafeAreaView } from 'react-native-safe-area-context'
import BackBtn from "@/components/back-button";

export default function NotificationsScreen() {
  const { highContrast, theme } = useAccessibility();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.screenBackground }]}>
      <StatusBar
        barStyle={highContrast ? "light-content" : "dark-content"}
        backgroundColor={theme.screenBackground}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.boxBorderColor }]}>
        {/* <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text
            style={[
              styles.backText,
              { color: theme.buttonColor, fontFamily: theme.font, letterSpacing: theme.letterSpacing },
            ]}
          >
            ← Back
          </Text>
        </TouchableOpacity> */}
        <BackBtn/>
        <Text
          style={[
            styles.headerTitle,
            { color: theme.mainTextColor, fontFamily: theme.font, letterSpacing: theme.letterSpacing },
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
            { backgroundColor: theme.boxBackground, borderColor: theme.buttonColor },
          ]}
        >
          <View style={styles.notifBody}>
            <Text
              style={[
                styles.notifTitle,
                {
                  color: theme.mainTextColor,
                  fontFamily: theme.font,
                  letterSpacing: theme.letterSpacing,
                  fontSize: theme.labelSize + 1,
                },
              ]}
            >
              Companion Informed
            </Text>
            <Text
              style={[
                styles.notifMessage,
                {
                  color: theme.smallTextColor,
                  fontFamily: theme.font,
                  letterSpacing: theme.letterSpacing,
                  lineHeight: theme.lineH,
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
            { color: theme.mainTextColor, fontFamily: theme.font, letterSpacing: theme.letterSpacing },
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