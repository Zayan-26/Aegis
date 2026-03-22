import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
//!font
import { useFonts } from "expo-font"
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { RoutingProvider } from "@/contexts/RoutingContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'OpenDyslexic': require("@/assets/fonts/OpenDyslexic-Regular.otf")
  })
  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync()
  }, [loaded, error])

  if(!loaded && !error) return null

  return (
    <RoutingProvider>
      <AccessibilityProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
        </GestureHandlerRootView>
      </AccessibilityProvider>
    </RoutingProvider>
  );
}