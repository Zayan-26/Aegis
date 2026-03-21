import { Stack, Tabs } from 'expo-router';
import React from 'react';

import { AccessibilityProvider } from '@/contexts/AccessibilityContext';

export default function TabLayout() {
  return (
    <AccessibilityProvider children={<Stack screenOptions={{headerShown : false}}/>} />
  );
}
