// app/feedback.tsx
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAccessibility } from "./AccessibilityContext";

export default function FeedbackScreen() {
  const { destination, distance, duration, routeLabel } = useLocalSearchParams<{
    destination: string;
    distance: string;
    duration: string;
    routeLabel: string;
  }>();

  const { dyslexic, colorBlind, highContrast, largeButtons } =
    useAccessibility();

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [recommend, setRecommend] = useState<"yes" | "no" | null>("yes");

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["30%", "60%", "90%"], []);

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
  const labelSize = largeButtons ? 17 : 15;

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: screenBackground }}
    >
      <SafeAreaView
        style={[styles.safe, { backgroundColor: screenBackground }]}
      >
        <StatusBar
          barStyle={highContrast ? "light-content" : "dark-content"}
          backgroundColor={screenBackground}
        />

        {/* Map placeholder fills background */}
        <View
          style={[
            styles.mapBg,
            { backgroundColor: boxBackground, borderColor: boxBorderColor },
          ]}
        >
          <TouchableOpacity
            style={{ position: "absolute", top: 14, right: 14 }}
            onPress={() => router.push("/profile")}
          >
            <Text style={{ fontSize: 24, color: mainTextColor }}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.mapEmoji}>🗺️</Text>
          <Text style={[styles.mapLabel, { color: smallTextColor }]}>
            {routeLabel} · {destination}
          </Text>
        </View>

        {/* Draggable bottom sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          backgroundStyle={{ backgroundColor: boxBackground }}
          handleIndicatorStyle={{
            backgroundColor: boxBorderColor,
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
              <Text
                style={[
                  styles.title,
                  {
                    color: mainTextColor,
                    fontFamily: font,
                    letterSpacing,
                    fontSize: largeButtons ? 22 : 20,
                  },
                ]}
              >
                How was your experience?
              </Text>
            </View>

            {/* Star rating */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Text
                    style={[
                      styles.star,
                      { opacity: star <= rating ? 1 : 0.25 },
                    ]}
                  >
                    ⭐
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View
              style={[styles.divider, { backgroundColor: boxBorderColor }]}
            />

            {/* Review input */}
            <TextInput
              style={[
                styles.reviewInput,
                {
                  backgroundColor: highContrast ? "#2A2A2A" : "#F7F8FC",
                  borderColor: boxBorderColor,
                  color: mainTextColor,
                  fontFamily: font,
                  fontSize: labelSize,
                  lineHeight: lineH,
                },
              ]}
              placeholder="Write a brief review (optional)"
              placeholderTextColor={smallTextColor}
              value={review}
              onChangeText={setReview}
              multiline
              numberOfLines={4}
            />

            {/* Recommend */}
            <Text
              style={[
                styles.recommendLabel,
                {
                  color: smallTextColor,
                  fontFamily: font,
                  letterSpacing,
                  fontSize: labelSize,
                },
              ]}
            >
              Would you recommend this app to others?
            </Text>
            <View style={styles.recommendRow}>
              <TouchableOpacity
                style={[
                  styles.recommendBtn,
                  {
                    borderColor:
                      recommend === "no" ? buttonColor : boxBorderColor,
                    backgroundColor:
                      recommend === "no" ? buttonColor + "20" : boxBackground,
                    paddingVertical: btnPadding - 4,
                    borderRadius: btnRadius,
                  },
                ]}
                onPress={() => setRecommend("no")}
              >
                <Text
                  style={[
                    styles.recommendBtnText,
                    {
                      color: recommend === "no" ? buttonColor : mainTextColor,
                      fontFamily: font,
                      letterSpacing,
                    },
                  ]}
                >
                  Nope
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.recommendBtn,
                  {
                    borderColor: buttonColor,
                    backgroundColor:
                      recommend === "yes" ? buttonColor : boxBackground,
                    paddingVertical: btnPadding - 4,
                    borderRadius: btnRadius,
                  },
                ]}
                onPress={() => setRecommend("yes")}
              >
                <Text
                  style={[
                    styles.recommendBtnText,
                    {
                      color:
                        recommend === "yes" ? buttonTextColor : mainTextColor,
                      fontFamily: font,
                      letterSpacing,
                    },
                  ]}
                >
                  ✓ Yes
                </Text>
              </TouchableOpacity>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[
                styles.submitBtn,
                {
                  backgroundColor: buttonColor,
                  paddingVertical: btnPadding,
                  borderRadius: btnRadius,
                },
              ]}
              onPress={() => router.replace("/explore")}
              accessibilityLabel="Submit feedback"
            >
              <Text
                style={[
                  styles.submitBtnText,
                  {
                    color: buttonTextColor,
                    fontSize: btnTextSize,
                    fontFamily: font,
                    letterSpacing,
                  },
                ]}
              >
                Submit
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
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  shieldEmoji: { fontSize: 28 },
  title: { fontWeight: "700", flex: 1 },
  starsRow: { flexDirection: "row", gap: 8, justifyContent: "center" },
  star: { fontSize: 36 },
  divider: { height: 1, width: "100%" },
  reviewInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
  },
  recommendLabel: { lineHeight: 22 },
  recommendRow: { flexDirection: "row", gap: 12 },
  recommendBtn: { flex: 1, alignItems: "center", borderWidth: 1.5 },
  recommendBtnText: { fontSize: 15, fontWeight: "600" },
  submitBtn: { width: "100%", alignItems: "center" },
  submitBtnText: { fontWeight: "700" },
});
