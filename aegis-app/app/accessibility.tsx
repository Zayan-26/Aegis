import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import BackBtn from "@/components/back-button";

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
    theme
  } = useAccessibility();

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
    <View style={[styles.container, { backgroundColor: theme.screenBackground }]}>
      {/* Back button */}
      {/* <TouchableOpacity
        onPress={() => router.back()}
        style={{ alignSelf: "flex-start", marginBottom: 8 }}
      >
        <Text
          style={{
            color: theme.mainTextColor,
            fontSize: 16,
            fontWeight: "500",
            fontFamily: theme.font,
            letterSpacing: theme.letterSpacing,
          }}
        >
          ← Back
        </Text>
      </TouchableOpacity> */}
      <BackBtn/>

      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.logo,
            {
              color: theme.mainTextColor,
              fontFamily: theme.font,
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
              color: theme.mainTextColor,
              fontSize: theme.titleSize,
              fontFamily: theme.font,
              letterSpacing: theme.letterSpacing,
            },
          ]}
        >
          Accessibility
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.smallTextColor,
              fontFamily: theme.font,
              lineHeight: theme.lineH,
              letterSpacing: theme.letterSpacing,
              fontSize: theme.dyslexicFontSize ?? 15,
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
                backgroundColor: theme.boxBackground,
                padding: theme.cardPadding,
                borderColor: feature.value
                  ? feature.activeColor
                  : theme.boxBorderColor,
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
                    color: feature.value ? feature.activeColor : theme.mainTextColor,
                    fontSize: theme.dyslexicFontSize ?? theme.labelSize,
                    fontFamily: theme.font,
                    letterSpacing: theme.letterSpacing,
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
                    color: theme.smallTextColor,
                    fontSize: theme.dyslexicFontSize
                      ? theme.dyslexicFontSize - 2
                      : theme.descSize,
                    fontFamily: theme.font,
                    lineHeight: theme.lineH,
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
              borderColor: theme.boxBorderColor,
              paddingVertical: theme.btnPadding - 4,
              borderRadius: theme.btnRadius,
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
                color: theme.mainTextColor,
                fontFamily: theme.font,
                fontSize: theme.labelSize - 1,
                letterSpacing: theme.letterSpacing,
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
              backgroundColor: theme.buttonColor,
              paddingVertical: theme.btnPadding,
              borderRadius: theme.btnRadius,
            },
          ]}
          onPress={() => router.push("/trusted-contacts")}
        >
          <Text
            style={[
              styles.primaryButtonText,
              {
                color: theme.buttonTextColor,
                fontSize: theme.btnTextSize,
                fontFamily: theme.font,
                letterSpacing: theme.letterSpacing,
              },
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => router.back()}>
          <Text
            style={[
              styles.backText,
              {
                color: theme.mainTextColor,
                fontFamily: theme.font,
                fontSize: largeButtons ? 17 : 15,
                letterSpacing: theme.letterSpacing,
              },
            ]}
          >
            Back
          </Text>
        </TouchableOpacity> */}
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
