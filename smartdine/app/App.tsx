// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './navigation';
import { useStore } from './services/store';

export default function App() {
  const isDark = useStore(s => s.isDarkMode);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Navigation />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}