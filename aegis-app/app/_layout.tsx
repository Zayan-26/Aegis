import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack initialRouteName="map">
      <Stack.Screen name="map" options={{ title: 'Map', headerShown: false}} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}