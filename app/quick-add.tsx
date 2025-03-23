import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import QuickAdd from '@/components/QuickAdd';

export default function QuickAddScreen() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'Quick Add',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
        }} 
      />
      
      <View style={styles.content}>
        <QuickAdd onComplete={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
});