import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import QuickAdd from '@/components/QuickAdd';
import { Repeat } from 'lucide-react-native';

export default function AddTransactionScreen() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'Add Transaction',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
        }} 
      />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Add Transaction</Text>
        <Text style={styles.subtitle}>
          Enter the details of your transaction below
        </Text>
        
        <View style={styles.formContainer}>
          <QuickAdd onComplete={() => router.back()} />
        </View>
        
        <Pressable 
          style={styles.recurringButton}
          onPress={() => router.push('/add-recurring')}
        >
          <Repeat size={20} color={colors.white} />
          <Text style={styles.recurringButtonText}>Add Recurring Transaction</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
  },
  formContainer: {
    marginBottom: 24,
  },
  recurringButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 24,
  },
  recurringButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});