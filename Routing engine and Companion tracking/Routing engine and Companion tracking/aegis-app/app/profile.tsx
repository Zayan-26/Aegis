// app/profile.tsx
import { router } from "expo-router";
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAccessibility } from "./AccessibilityContext";

export default function ProfileScreen() {
  const {
    dyslexic,
    colorBlind,
    highContrast,
    largeButtons,
    setDyslexic,
    setColorBlind,
    setHighContrast,
    setLargeButtons,
    setTrustedContacts,
  } = useAccessibility();

  const screenBackground = highContrast ? "#000000" : "#F7F8FC";
  const boxBackground = highContrast ? "#1A1A1A" : "#FFFFFF";
  const mainTextColor = highContrast ? "#FFFFFF" : "#1E2A78";
  const smallTextColor = highContrast ? "#CCCCCC" : "#4F647A";
  const boxBorderColor = highContrast ? "#FFFFFF" : "#D9DDE7";
  const buttonColor = colorBlind ? "#E69F00" : "#69B7C6";
  const font = dyslexic ? "OpenDyslexic" : undefined;
  const letterSpacing = dyslexic ? 1 : 0;
  const labelSize = largeButtons ? 17 : 15;
  const btnPadding = largeButtons ? 18 : 14;

  const resetAll = () => {
    setDyslexic(false);
    setColorBlind(false);
    setHighContrast(false);
    setLargeButtons(false);
    setTrustedContacts([]);
  };

  const handleLogOut = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => {
          resetAll();
          router.replace("/");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert("Delete Account", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          resetAll();
          router.replace("/");
        },
      },
    ]);
  };

  const SectionTitle = ({ title }: { title: string }) => (
    <Text
      style={[
        styles.sectionTitle,
        { color: smallTextColor, fontFamily: font, letterSpacing },
      ]}
    >
      {title}
    </Text>
  );

  const MenuItem = ({
    icon,
    label,
    onPress,
    danger = false,
    right,
  }: {
    icon: string;
    label: string;
    onPress?: () => void;
    danger?: boolean;
    right?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={[
        styles.menuItem,
        { paddingVertical: btnPadding, borderBottomColor: boxBorderColor },
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {icon ? (
        <View
          style={[
            styles.menuIconWrap,
            { backgroundColor: danger ? "#FFE5E5" : buttonColor + "20" },
          ]}
        >
          <Text style={styles.menuIcon}>{icon}</Text>
        </View>
      ) : null}
      <Text
        style={[
          styles.menuLabel,
          {
            color: danger ? "#C0392B" : mainTextColor,
            fontFamily: font,
            fontSize: labelSize,
            letterSpacing,
          },
        ]}
      >
        {label}
      </Text>
      {right ?? (
        <Text style={[styles.chevron, { color: smallTextColor }]}>{"›"}</Text>
      )}
    </TouchableOpacity>
  );

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
            {"← Back"}
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: mainTextColor, fontFamily: font, letterSpacing },
          ]}
        >
          Profile
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Profile card */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: boxBackground, borderColor: boxBorderColor },
          ]}
        >
          <View style={[styles.avatarCircle, { backgroundColor: buttonColor }]}>
            <Text style={styles.avatarEmoji}>{"👤"}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text
              style={[
                styles.profileName,
                {
                  color: mainTextColor,
                  fontFamily: font,
                  fontSize: largeButtons ? 22 : 18,
                  letterSpacing,
                },
              ]}
            >
              Grace
            </Text>
            <Text
              style={[
                styles.profileSub,
                { color: smallTextColor, fontFamily: font, letterSpacing },
              ]}
            >
              +44 7700 900123
            </Text>
          </View>
        </View>

        {/* Settings */}
        <SectionTitle title="SETTINGS" />
        <View
          style={[
            styles.card,
            { backgroundColor: boxBackground, borderColor: boxBorderColor },
          ]}
        >
          <MenuItem
            icon="👥"
            label="Trusted Contacts"
            onPress={() => router.push("/trusted-contacts")}
          />
          <MenuItem
            icon="♿"
            label="Accessibility Features"
            onPress={() => router.push("/accessibility")}
          />
        </View>

        {/* Notifications */}
        <SectionTitle title="NOTIFICATIONS" />
        <View
          style={[
            styles.card,
            { backgroundColor: boxBackground, borderColor: boxBorderColor },
          ]}
        >
          <MenuItem
            icon="🔔"
            label="Notifications"
            onPress={() => router.push("/notifications")}
          />
        </View>

        {/* Help & Support */}
        <SectionTitle title="HELP & SUPPORT" />
        <View
          style={[
            styles.card,
            { backgroundColor: boxBackground, borderColor: boxBorderColor },
          ]}
        >
          <MenuItem
            icon="📞"
            label="Call Support"
            onPress={() =>
              Linking.openURL("tel:+448001234567").catch(() =>
                Alert.alert("Call Support", "Please dial +44 800 123 4567"),
              )
            }
          />
          <MenuItem
            icon="✉️"
            label="Email Us"
            onPress={() =>
              Linking.openURL("mailto:support@aegis.co.uk").catch(() =>
                Alert.alert(
                  "Email Support",
                  "Please email support@aegis.co.uk",
                ),
              )
            }
          />
        </View>

        {/* Log Out */}
        <SectionTitle title="" />
        <View
          style={[
            styles.card,
            { backgroundColor: boxBackground, borderColor: boxBorderColor },
          ]}
        >
          <MenuItem icon="" label="Log Out" onPress={handleLogOut} danger />
        </View>

        {/* Delete Account */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDeleteAccount}
        >
          <Text style={[styles.deleteBtnText, { fontFamily: font }]}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  scroll: { padding: 16, gap: 6, paddingBottom: 48 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
    marginBottom: 10,
    shadowColor: "#1E2A78",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: { fontSize: 28 },
  profileInfo: { flex: 1 },
  profileName: { fontWeight: "700", marginBottom: 4 },
  profileSub: { fontSize: 13 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 4,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#1E2A78",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 14,
    borderBottomWidth: 1,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: { fontSize: 18 },
  menuLabel: { flex: 1, fontWeight: "500" },
  chevron: { fontSize: 20 },
  deleteBtn: { alignItems: "center", paddingVertical: 16 },
  deleteBtnText: { color: "#C0392B", fontSize: 14, fontWeight: "500" },
});
