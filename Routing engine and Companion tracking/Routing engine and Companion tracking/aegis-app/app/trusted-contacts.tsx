// app/trusted-contacts.tsx
import * as Contacts from "expo-contacts";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAccessibility } from "./AccessibilityContext";

interface Contact {
  id: string;
  name: string;
  phone: string;
  image?: string;
}

function Avatar({
  name,
  image,
  highContrast,
}: {
  name: string;
  image?: string;
  highContrast: boolean;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const colors = ["#69B7C6", "#7C6FAD", "#2D7D6F", "#E69F00", "#1E2A78"];
  const bg = highContrast
    ? "#FFFFFF"
    : colors[name.charCodeAt(0) % colors.length];
  const textColor = highContrast ? "#000000" : "#FFFFFF";
  if (image) {
    return <Image source={{ uri: image }} style={styles.avatarImg} />;
  }
  return (
    <View style={[styles.avatar, { backgroundColor: bg }]}>
      <Text style={[styles.avatarText, { color: textColor }]}>{initials}</Text>
    </View>
  );
}

export default function TrustedContactsScreen() {
  const {
    dyslexic,
    colorBlind,
    highContrast,
    largeButtons,
    setTrustedContacts,
  } = useAccessibility();

  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const { trustedContacts } = useAccessibility();
  const [trusted, setTrusted] = useState<Contact[]>(trustedContacts);
  const [search, setSearch] = useState("");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loading, setLoading] = useState(true);

  const bg = highContrast ? "#000000" : "#F7F8FC";
  const cardBg = highContrast ? "#1A1A1A" : "#FFFFFF";
  const textPrimary = highContrast ? "#FFFFFF" : "#1E2A78";
  const textSecondary = highContrast ? "#CCCCCC" : "#4F647A";
  const borderColor = highContrast ? "#FFFFFF" : "#D9DDE7";
  const primaryBtn = colorBlind ? "#E69F00" : "#69B7C6";
  const primaryBtnText = colorBlind ? "#000000" : "#FFFFFF";
  const font = dyslexic ? "OpenDyslexic" : undefined;
  const letterSpacing = dyslexic ? 1 : 0;
  const lineH = dyslexic ? 24 : 20;
  const btnPadding = largeButtons ? 22 : 16;
  const btnRadius = largeButtons ? 20 : 16;
  const titleSize = largeButtons ? 30 : 26;
  const labelSize = largeButtons ? 17 : 15;
  const btnTextSize = largeButtons ? 20 : 17;

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== "granted") {
        setPermissionDenied(true);
        setLoading(false);
        return;
      }
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Name,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Image,
        ],
      });
      const mapped: Contact[] = data
        .filter((c) => c.name && c.phoneNumbers && c.phoneNumbers.length > 0)
        .map((c) => ({
          id: c.id ?? Math.random().toString(),
          name: c.name ?? "Unknown",
          phone: c.phoneNumbers?.[0]?.number ?? "",
          image: c.imageAvailable ? c.image?.uri : undefined,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setAllContacts(mapped);
      setLoading(false);
    })();
  }, []);

  const filteredContacts = allContacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );

  const trustedIds = new Set(trusted.map((c) => c.id));

  const addContact = (contact: Contact) => {
    if (trusted.length >= 5) {
      Alert.alert("Limit reached", "You can add up to 5 trusted contacts.");
      return;
    }
    if (!trustedIds.has(contact.id)) {
      setTrusted((prev) => [...prev, contact]);
    }
  };

  const removeContact = (id: string) =>
    setTrusted((prev) => prev.filter((c) => c.id !== id));

  // ── Save contacts to global context then navigate ──────────
  const handleSave = () => {
    if (trusted.length === 0) {
      Alert.alert(
        "No contacts added",
        "Please add at least one trusted contact.",
      );
      return;
    }
    setTrustedContacts(trusted); // saves to context so route-detail can read them
    router.push("/explore");
  };

  if (permissionDenied) {
    return (
      <View
        style={[styles.container, styles.centered, { backgroundColor: bg }]}
      >
        <Text style={styles.permissionIcon}>🔒</Text>
        <Text
          style={[
            styles.permissionTitle,
            { color: textPrimary, fontFamily: font },
          ]}
        >
          Contacts Access Needed
        </Text>
        <Text
          style={[
            styles.permissionDesc,
            { color: textSecondary, fontFamily: font },
          ]}
        >
          Aegis needs access to your contacts to add trusted companions. Please
          enable it in your phone settings.
        </Text>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor: primaryBtn,
              paddingVertical: btnPadding,
              borderRadius: btnRadius,
            },
          ]}
          onPress={() => router.back()}
        >
          <Text
            style={[
              styles.primaryButtonText,
              { color: primaryBtnText, fontFamily: font },
            ]}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ alignSelf: "flex-start", marginBottom: 8 }}
      >
        <Text
          style={{
            color: textPrimary,
            fontSize: 16,
            fontWeight: "600",
            fontFamily: font,
          }}
        >
          ← Back
        </Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={[styles.logo, { color: textPrimary, fontFamily: font }]}>
          aegis
        </Text>
        <Text
          style={[
            styles.title,
            { color: textPrimary, fontSize: titleSize, fontFamily: font },
          ]}
        >
          Trusted Contacts
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: textSecondary, fontFamily: font, lineHeight: lineH },
          ]}
        >
          Add up to 5 contacts who can track your journey for your safety.
        </Text>
      </View>

      {trusted.length > 0 && (
        <View style={styles.trustedSection}>
          <Text
            style={[
              styles.sectionLabel,
              { color: textSecondary, fontFamily: font },
            ]}
          >
            Added ({trusted.length}/5)
          </Text>
          <View style={styles.trustedList}>
            {trusted.map((contact) => (
              <View
                key={contact.id}
                style={[styles.trustedChip, { borderColor: primaryBtn }]}
              >
                <Avatar
                  name={contact.name}
                  image={contact.image}
                  highContrast={highContrast}
                />
                <Text
                  style={[
                    styles.trustedChipName,
                    { color: textPrimary, fontFamily: font },
                  ]}
                  numberOfLines={1}
                >
                  {contact.name.split(" ")[0]}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.removeChipBtn,
                    { backgroundColor: primaryBtn },
                  ]}
                  onPress={() => removeContact(contact.id)}
                  accessibilityLabel={`Remove ${contact.name}`}
                >
                  <Text style={styles.removeChipBtnText}>−</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      <View
        style={[styles.searchWrap, { backgroundColor: cardBg, borderColor }]}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: textPrimary, fontFamily: font }]}
          placeholder="Search contacts"
          placeholderTextColor={textSecondary}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Text style={[styles.clearSearch, { color: textSecondary }]}>
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <Text
            style={[
              styles.loadingText,
              { color: textSecondary, fontFamily: font },
            ]}
          >
            Loading contacts...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text
              style={[
                styles.emptyText,
                { color: textSecondary, fontFamily: font },
              ]}
            >
              No contacts found
            </Text>
          }
          renderItem={({ item }) => {
            const isAdded = trustedIds.has(item.id);
            return (
              <View
                style={[
                  styles.contactRow,
                  {
                    backgroundColor: isAdded
                      ? highContrast
                        ? "#333333"
                        : "#F0FAFB"
                      : cardBg,
                    borderColor: isAdded ? primaryBtn : borderColor,
                    padding: largeButtons ? 16 : 12,
                  },
                ]}
              >
                <Avatar
                  name={item.name}
                  image={item.image}
                  highContrast={highContrast}
                />
                <View style={styles.contactInfo}>
                  <Text
                    style={[
                      styles.contactName,
                      {
                        color: textPrimary,
                        fontSize: labelSize,
                        fontFamily: font,
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.contactPhone,
                      { color: textSecondary, fontFamily: font },
                    ]}
                  >
                    {item.phone}
                  </Text>
                </View>
                {isAdded ? (
                  <TouchableOpacity
                    style={[
                      styles.minusBtn,
                      highContrast && {
                        backgroundColor: "#FFFFFF",
                        borderColor: "#FFFFFF",
                      },
                    ]}
                    onPress={() => removeContact(item.id)}
                    accessibilityLabel={`Remove ${item.name}`}
                  >
                    <Text
                      style={[
                        styles.minusBtnText,
                        highContrast && { color: "#000000" },
                      ]}
                    >
                      −
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.addBtn, { backgroundColor: primaryBtn }]}
                    onPress={() => addContact(item)}
                    accessibilityLabel={`Add ${item.name}`}
                  >
                    <Text
                      style={[styles.addBtnText, { color: primaryBtnText }]}
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />
      )}

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor: primaryBtn,
              paddingVertical: btnPadding,
              borderRadius: btnRadius,
              opacity: trusted.length === 0 ? 0.5 : 1,
            },
          ]}
          onPress={handleSave}
        >
          <Text
            style={[
              styles.primaryButtonText,
              {
                color: primaryBtnText,
                fontSize: btnTextSize,
                fontFamily: font,
              },
            ]}
          >
            Save Contacts ({trusted.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setTrustedContacts([]);
            router.push("/explore");
          }}
        >
          <Text
            style={[
              styles.skipText,
              {
                color: textSecondary,
                fontFamily: font,
                fontSize: largeButtons ? 17 : 15,
              },
            ]}
          >
            Skip for now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 16 },
  logo: {
    fontSize: 32,
    fontWeight: "800",
    textTransform: "lowercase",
    marginBottom: 8,
  },
  title: { fontWeight: "700", marginBottom: 6 },
  subtitle: { fontSize: 14, textAlign: "center", paddingHorizontal: 10 },
  trustedSection: { marginBottom: 12 },
  sectionLabel: { fontSize: 13, fontWeight: "600", marginBottom: 8 },
  trustedList: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  trustedChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 10,
    gap: 6,
    borderWidth: 1.5,
    backgroundColor: "#E8F4F7",
  },
  trustedChipName: { fontSize: 13, fontWeight: "600", maxWidth: 70 },
  removeChipBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  removeChipBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 15 },
  clearSearch: { fontSize: 14 },
  list: { flex: 1 },
  listContent: { gap: 8, paddingBottom: 16 },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    gap: 12,
    borderWidth: 1,
    shadowColor: "#1E2A78",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarImg: { width: 44, height: 44, borderRadius: 22 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 15, fontWeight: "700" },
  contactInfo: { flex: 1 },
  contactName: { fontWeight: "600", marginBottom: 2 },
  contactPhone: { fontSize: 13 },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: { fontSize: 22, fontWeight: "300", lineHeight: 34 },
  minusBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFE5E5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FF6B6B",
  },
  minusBtnText: {
    color: "#FF6B6B",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 34,
  },
  bottomSection: { width: "100%", marginBottom: 36, gap: 12, paddingTop: 10 },
  primaryButton: { width: "100%", alignItems: "center" },
  primaryButtonText: { fontWeight: "700" },
  skipText: { textAlign: "center", fontWeight: "500" },
  permissionIcon: { fontSize: 48, marginBottom: 16 },
  permissionTitle: { fontSize: 22, fontWeight: "700", marginBottom: 10 },
  permissionDesc: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  loadingText: { fontSize: 15 },
  emptyText: { textAlign: "center", fontSize: 15, marginTop: 40 },
});
