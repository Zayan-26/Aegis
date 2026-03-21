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
import { useAccessibility } from "@/contexts/AccessibilityContext";

export default function FeedbackScreen() {
  const { destination, routeLabel } = useLocalSearchParams<{
    destination: string;
    distance: string;
    duration: string;
    routeLabel: string;
  }>();

  const { highContrast, theme } = useAccessibility();

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [recommend, setRecommend] = useState<"yes" | "no" | null>("yes");

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["30%", "60%", "90%"], []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.screenBackground }}>
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.screenBackground }]}>
        <StatusBar
          barStyle={highContrast ? "light-content" : "dark-content"}
          backgroundColor={theme.screenBackground}
        />

        {/* Map placeholder fills background */}
        <View style={[styles.mapBg, { backgroundColor: theme.boxBackground, borderColor: theme.boxBorderColor }]}>
          <TouchableOpacity style={{ position: "absolute", top: 14, right: 14 }} onPress={() => router.push("/profile")}>
            <Text style={{ fontSize: 24, color: theme.mainTextColor }}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.mapEmoji}>🗺️</Text>
          <Text style={[styles.mapLabel, { color: theme.smallTextColor, fontFamily: theme.font }]}>
            {routeLabel} · {destination}
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
            {/* Title */}
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.title,
                  {
                    color: theme.mainTextColor,
                    fontFamily: theme.font,
                    letterSpacing: theme.letterSpacing,
                    fontSize: theme.labelSize + 5,
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
                  <Text style={[styles.star, { opacity: star <= rating ? 1 : 0.25 }]}>⭐</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.divider, { backgroundColor: theme.boxBorderColor }]} />

            {/* Review input */}
            <TextInput
              style={[
                styles.reviewInput,
                {
                  backgroundColor: highContrast ? "#2A2A2A" : theme.screenBackground,
                  borderColor: theme.boxBorderColor,
                  color: theme.mainTextColor,
                  fontFamily: theme.font,
                  fontSize: theme.labelSize,
                  lineHeight: theme.lineH,
                  letterSpacing: theme.letterSpacing,
                },
              ]}
              placeholder="Write a brief review (optional)"
              placeholderTextColor={theme.smallTextColor}
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
                  color: theme.smallTextColor,
                  fontFamily: theme.font,
                  letterSpacing: theme.letterSpacing,
                  fontSize: theme.labelSize,
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
                    borderColor: recommend === "no" ? theme.buttonColor : theme.boxBorderColor,
                    backgroundColor: recommend === "no" ? theme.buttonColor + "20" : theme.boxBackground,
                    paddingVertical: theme.btnPadding - 4,
                    borderRadius: theme.btnRadius,
                  },
                ]}
                onPress={() => setRecommend("no")}
              >
                <Text
                  style={[
                    styles.recommendBtnText,
                    {
                      color: recommend === "no" ? theme.buttonColor : theme.mainTextColor,
                      fontFamily: theme.font,
                      letterSpacing: theme.letterSpacing,
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
                    borderColor: theme.buttonColor,
                    backgroundColor: recommend === "yes" ? theme.buttonColor : theme.boxBackground,
                    paddingVertical: theme.btnPadding - 4,
                    borderRadius: theme.btnRadius,
                  },
                ]}
                onPress={() => setRecommend("yes")}
              >
                <Text
                  style={[
                    styles.recommendBtnText,
                    {
                      color: recommend === "yes" ? theme.buttonTextColor : theme.mainTextColor,
                      fontFamily: theme.font,
                      letterSpacing: theme.letterSpacing,
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
                  backgroundColor: theme.buttonColor,
                  paddingVertical: theme.btnPadding,
                  borderRadius: theme.btnRadius,
                },
              ]}
              onPress={() => router.back()}
              accessibilityLabel="Submit feedback"
            >
              <Text
                style={[
                  styles.submitBtnText,
                  {
                    color: theme.buttonTextColor,
                    fontSize: theme.btnTextSize,
                    fontFamily: theme.font,
                    letterSpacing: theme.letterSpacing,
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