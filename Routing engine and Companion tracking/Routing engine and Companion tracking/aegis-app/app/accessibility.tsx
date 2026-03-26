import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAccessibility } from "./AccessibilityContext";

export default function AccessibilityScreen() {
  const {
    dyslexic,
    setDyslexic,
    colorBlind,
    setColorBlind,
    highContrast,
    setHighContrast,
    largeButtons,
    setLargeButtons,
  } = useAccessibility();

  const screenBg = highContrast ? "#000000" : "#F7F8FC";
  const boxBg = highContrast ? "#1A1A1A" : "#FFFFFF";
  const mainTextColor = highContrast ? "#FFFFFF" : "#1E2A78";
  const smallTextColor = highContrast ? "#CCCCCC" : "#4F647A";
  const boxBorderColor = highContrast ? "#FFFFFF" : "#D9DDE7";
  const buttonColor = colorBlind ? "#E69F00" : "#69B7C6";
  const buttonTextColor = colorBlind ? "#000000" : "#FFFFFF";

  // ── Dyslexic mode — very noticeable changes ────────────────
  const font = dyslexic ? "OpenDyslexic" : undefined;
  const letterSpacing = dyslexic ? 1 : 0;
  const lineH = dyslexic ? 24 : 20;
  const dyslexicFontSize = dyslexic ? 15 : undefined;

  const btnPadding = largeButtons ? 22 : 16;
  const btnRadius = largeButtons ? 20 : 16;
  const titleSize = largeButtons ? 32 : 28;
  const labelSize = largeButtons ? 18 : 16;
  const descSize = largeButtons ? 15 : 13;
  const btnTextSize = largeButtons ? 20 : 18;
  const cardPadding = largeButtons ? 20 : 16;

  const features = [
    {
      key: "dyslexic" as const,
      label: "Dyslexia Support",
      description:
        "Makes text easier to read with wider spacing between letters and lines.",
      activeColor: colorBlind ? "#0072B2" : "#7C6FAD",
      value: dyslexic,
      setter: setDyslexic,
    },
    {
      key: "colorBlind" as const,
      label: "Color Blind Friendly",
      description:
        "Uses a clearer color palette, safe for red-green color blindness.",
      activeColor: "#E69F00",
      value: colorBlind,
      setter: setColorBlind,
    },
    {
      key: "highContrast" as const,
      label: "High Contrast Mode",
      description: "Black background with white text for maximum visibility.",
      activeColor: highContrast ? "#FFFFFF" : "#1A1A1A",
      value: highContrast,
      setter: setHighContrast,
    },
    {
      key: "largeButtons" as const,
      label: "Larger Buttons",
      description: "Increases button and font size for easier tapping.",
      activeColor: colorBlind ? "#0072B2" : "#2D7D6F",
      value: largeButtons,
      setter: setLargeButtons,
    },
  ];

  const anyActive = dyslexic || colorBlind || highContrast || largeButtons;

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      {/* Back button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ alignSelf: "flex-start", marginBottom: 8 }}
      >
        <Text
          style={{
            color: mainTextColor,
            fontSize: 16,
            fontWeight: "600",
            fontFamily: font,
            letterSpacing,
          }}
        >
          ← Back
        </Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.logo,
            {
              color: mainTextColor,
              fontFamily: font,
              letterSpacing: dyslexic ? 4 : 1,
            },
          ]}
        >
          aegis
        </Text>
        <Text
          style={[
            styles.title,
            {
              color: mainTextColor,
              fontSize: titleSize,
              fontFamily: font,
              letterSpacing,
            },
          ]}
        >
          Accessibility
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: smallTextColor,
              fontFamily: font,
              lineHeight: lineH,
              letterSpacing,
              fontSize: dyslexicFontSize ?? 15,
            },
          ]}
        >
          Choose the settings that make Aegis easier for you to use
        </Text>
      </View>

      {/* Cards */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.key}
            style={[
              styles.card,
              {
                backgroundColor: boxBg,
                padding: cardPadding,
                borderColor: feature.value
                  ? feature.activeColor
                  : boxBorderColor,
                borderWidth: feature.value ? 2 : 1,
              },
            ]}
            onPress={() => feature.setter(!feature.value)}
            activeOpacity={0.85}
            accessibilityRole="switch"
            accessibilityLabel={feature.label}
            accessibilityState={{ checked: feature.value }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.featureLabel,
                  {
                    color: feature.value ? feature.activeColor : mainTextColor,
                    fontSize: dyslexicFontSize ?? labelSize,
                    fontFamily: font,
                    letterSpacing,
                    lineHeight: dyslexic ? 32 : undefined,
                  },
                ]}
              >
                {feature.label}
              </Text>
              <Text
                style={[
                  styles.featureDesc,
                  {
                    color: smallTextColor,
                    fontSize: dyslexicFontSize
                      ? dyslexicFontSize - 2
                      : descSize,
                    fontFamily: font,
                    lineHeight: lineH,
                    letterSpacing: dyslexic ? 1.5 : 0,
                    marginTop: dyslexic ? 6 : 2,
                  },
                ]}
              >
                {feature.description}
              </Text>
            </View>

            <Switch
              value={feature.value}
              onValueChange={feature.setter}
              trackColor={{
                false: highContrast ? "#555555" : "#D9DDE7",
                true: feature.activeColor,
              }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={highContrast ? "#555555" : "#D9DDE7"}
            />
          </TouchableOpacity>
        ))}

        {/* Reset button */}
        <TouchableOpacity
          style={[
            styles.resetButton,
            {
              borderColor: boxBorderColor,
              paddingVertical: btnPadding - 4,
              borderRadius: btnRadius,
              opacity: anyActive ? 1 : 0.35,
            },
          ]}
          onPress={() => {
            setDyslexic(false);
            setColorBlind(false);
            setHighContrast(false);
            setLargeButtons(false);
          }}
          disabled={!anyActive}
        >
          <Text
            style={[
              styles.resetText,
              {
                color: mainTextColor,
                fontFamily: font,
                fontSize: labelSize - 1,
                letterSpacing,
              },
            ]}
          >
            Reset All Settings
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom buttons */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: buttonColor,
              paddingVertical: btnPadding,
              borderRadius: btnRadius,
            },
          ]}
          onPress={() => router.push("/trusted-contacts")}
        >
          <Text
            style={[
              styles.primaryButtonText,
              {
                color: buttonTextColor,
                fontSize: btnTextSize,
                fontFamily: font,
                letterSpacing,
              },
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text
            style={[
              styles.backText,
              {
                color: mainTextColor,
                fontFamily: font,
                fontSize: largeButtons ? 17 : 15,
                letterSpacing,
              },
            ]}
          >
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60 },
  header: { alignItems: "center", marginBottom: 24 },
  logo: {
    fontSize: 36,
    fontWeight: "800",
    textTransform: "lowercase",
    marginBottom: 10,
  },
  title: { fontWeight: "700", marginBottom: 8 },
  subtitle: { textAlign: "center", paddingHorizontal: 10 },
  scroll: { flex: 1 },
  scrollContent: { gap: 12, paddingBottom: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    gap: 12,
  },
  featureLabel: { fontWeight: "700", marginBottom: 3 },
  featureDesc: {},
  resetButton: { borderWidth: 1, alignItems: "center", marginTop: 4 },
  resetText: { fontWeight: "600" },
  bottomSection: { width: "100%", marginBottom: 36, gap: 14 },
  button: { width: "100%", alignItems: "center" },
  primaryButtonText: { textAlign: "center", fontWeight: "700" },
  backText: { textAlign: "center", fontWeight: "600" },
});
