import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const ROUTE_DATA: Record<
  string,
  {
    label: string;
    score: number | null;
    time: string;
    distance: string;
    description: string;
    color: string;
    bgColor: string;
  }
> = {
  safest: {
    label: "Safest Route",
    score: 92,
    time: "24 min",
    distance: "1.8 km",
    description: "Well-lit streets, busy pedestrian area",
    color: "#2D7D6F",
    bgColor: "#F0FAF8",
  },
  fastest: {
    label: "Fastest Route",
    score: null,
    time: "17 min",
    distance: "1.2 km",
    description: "Lower lighting in some sections",
    color: "#C0392B",
    bgColor: "#FFF5F5",
  },
};

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

export default function RouteDetailScreen() {
  const { routeId, destination } = useLocalSearchParams<{
    routeId: string;
    destination: string;
  }>();

  const { highContrast, largeButtons, trustedContacts, notifyOn, setNotifyOn, theme } = useAccessibility();
  const route = ROUTE_DATA[routeId ?? "safest"];

  const [sharedContacts, setSharedContacts] = useState<Record<string, boolean>>(
    Object.fromEntries(trustedContacts.map((c) => [c.id, true])),
  );

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["15%", "50%", "88%"], []);

  const routeColor = highContrast ? "#FFFFFF" : route.color;
  const routeBg = highContrast ? "#2A2A2A" : route.bgColor;

  const toggleContact = (id: string) => {
    setSharedContacts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.screenBackground }}>
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.screenBackground }]}>
        <StatusBar
          barStyle={highContrast ? "light-content" : "dark-content"}
          backgroundColor={theme.screenBackground}
        />

        {/* Top bar */}
        <View style={[styles.topBar, { borderBottomColor: theme.boxBorderColor }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: theme.buttonColor,
                fontFamily: theme.font,
                letterSpacing: theme.letterSpacing,
              }}
            >
              ← Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Text style={{ fontSize: 24, color: theme.mainTextColor }}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Map placeholder */}
        <View style={[styles.mapBox, { backgroundColor: theme.boxBackground, borderColor: theme.boxBorderColor }]}>
          <Text style={styles.mapEmoji}>🗺️</Text>
          <Text
            style={[
              styles.mapSubtitle,
              { color: theme.smallTextColor, fontFamily: theme.font, letterSpacing: theme.letterSpacing },
            ]}
          >
            Live route will appear here
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
          <BottomSheetScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
            {/* Route title + destination */}
            <View style={styles.routeTitleRow}>
              <Text
                style={[
                  styles.routeTitle,
                  {
                    color: routeColor,
                    fontSize: largeButtons ? 24 : 20,
                    fontFamily: theme.font,
                    letterSpacing: theme.letterSpacing,
                  },
                ]}
              >
                {route.label}
              </Text>
              <Text
                style={[
                  styles.routeDestination,
                  { color: routeColor, fontFamily: theme.font, letterSpacing: theme.letterSpacing },
                ]}
              >
                {destination}
              </Text>
            </View>

            {/* Route info card */}
            <View style={[styles.infoCard, { backgroundColor: routeBg, borderColor: routeColor }]}>
              <View style={styles.infoCardTop}>
                <View style={styles.infoCardLeft}>
                  <Text
                    style={[
                      styles.infoScore,
                      {
                        color: routeColor,
                        fontSize: theme.labelSize,
                        fontFamily: theme.font,
                        letterSpacing: theme.letterSpacing,
                      },
                    ]}
                  >
                    {route.score ? `Safety Score: ${route.score}` : "⚠️ Lower safety score"}
                  </Text>
                  <Text
                    style={[
                      styles.infoDistance,
                      { color: theme.smallTextColor, fontFamily: theme.font, letterSpacing: theme.letterSpacing },
                    ]}
                  >
                    📍 {route.distance}
                  </Text>
                  <Text
                    style={[
                      styles.infoDesc,
                      {
                        color: theme.smallTextColor,
                        fontFamily: theme.font,
                        letterSpacing: theme.letterSpacing,
                        lineHeight: theme.lineH,
                      },
                    ]}
                  >
                    {route.description}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.infoTime,
                    {
                      color: routeColor,
                      fontSize: largeButtons ? 22 : 18,
                      fontFamily: theme.font,
                      letterSpacing: theme.letterSpacing,
                    },
                  ]}
                >
                  {route.time}
                </Text>
              </View>
            </View>

            {/* Share with trusted contacts */}
            <View style={[styles.card, { backgroundColor: theme.boxBackground, borderColor: theme.boxBorderColor }]}>
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
                    { color: theme.smallTextColor, fontFamily: theme.font, letterSpacing: theme.letterSpacing },
                  ]}
                >
                  No trusted contacts added. Go back and add some.
                </Text>
              ) : (
                trustedContacts.map((contact) => (
                  <View key={contact.id} style={[styles.contactRow, { borderTopColor: theme.boxBorderColor }]}>
                    <Avatar name={contact.name} color={highContrast ? "#FFFFFF" : theme.buttonColor} />
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

            {/* Notification toggle */}
            <View style={[styles.card, { backgroundColor: theme.boxBackground, borderColor: theme.boxBorderColor }]}>
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

            {/* Start Navigation */}
            <TouchableOpacity
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
          </BottomSheetScrollView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
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
  mapSubtitle: { fontSize: 12, textAlign: "center" },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 48,
    gap: 12,
  },
  routeTitleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  routeTitle: { fontWeight: "700" },
  routeDestination: {
    fontSize: 13,
    fontWeight: "500",
    opacity: 0.7,
    flex: 1,
    textAlign: "right",
  },
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
});