import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, I18nManager, View, Text, StyleSheet } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { useFinanceStore } from "@/store/finance-store";
import { useTranslation } from "@/utils/i18n";
import { colors } from "@/constants/colors";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(err => {
        console.warn("Error hiding splash screen:", err);
      });
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading app...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const profile = useFinanceStore((state) => state.profile);
  const { isRTL } = useTranslation();
  
  // Check if the user has completed account setup
  useEffect(() => {
    if (!profile) return; // Skip if profile is not loaded yet
    
    const inAuthGroup = segments[0] === '(tabs)';
    
    // If the user hasn't set their name (first time user), redirect to account setup
    if (inAuthGroup && (!profile.firstName || profile.firstName === '')) {
      router.replace('/account-setup');
    }
  }, [profile, segments, router]);
  
  // Apply RTL layout if needed
  useEffect(() => {
    // This is just for demonstration - in a real app, we would need to restart the app
    // to fully apply RTL changes
    if (I18nManager.isRTL !== isRTL) {
      console.log(`RTL setting mismatch: I18nManager.isRTL=${I18nManager.isRTL}, isRTL=${isRTL}`);
    }
  }, [isRTL]);
  
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="account-setup" options={{ headerShown: false }} />
      <Stack.Screen 
        name="add-transaction" 
        options={{ 
          presentation: "card",
          headerTitle: "Add Transaction"
        }} 
      />
      <Stack.Screen 
        name="add-recurring" 
        options={{ 
          presentation: "card",
          headerTitle: "Add Recurring Transaction"
        }} 
      />
      <Stack.Screen 
        name="quick-add" 
        options={{ 
          presentation: "modal",
          headerTitle: "Quick Add"
        }} 
      />
      <Stack.Screen 
        name="transaction/[id]" 
        options={{ 
          headerTitle: "Transaction Details"
        }} 
      />
      <Stack.Screen 
        name="widget" 
        options={{ 
          presentation: "modal",
          headerTitle: "Widget"
        }} 
      />
      <Stack.Screen 
        name="add-project" 
        options={{ 
          presentation: "card",
          headerTitle: "Add Project"
        }} 
      />
      <Stack.Screen 
        name="project/[id]" 
        options={{ 
          headerTitle: "Project Details"
        }} 
      />
      <Stack.Screen 
        name="projects" 
        options={{ 
          headerTitle: "Projects"
        }} 
      />
      <Stack.Screen 
        name="add-expected" 
        options={{ 
          presentation: "card",
          headerTitle: "Add Expected Transaction"
        }} 
      />
      <Stack.Screen 
        name="expected/[id]" 
        options={{ 
          headerTitle: "Expected Transaction"
        }} 
      />
      <Stack.Screen 
        name="balance-details" 
        options={{ 
          headerTitle: "Balance Details"
        }} 
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
  },
});