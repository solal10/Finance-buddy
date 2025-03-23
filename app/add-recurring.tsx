import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import RecurringTransactionForm from '@/components/RecurringTransactionForm';
import { useTranslation } from '@/utils/i18n';

export default function AddRecurringScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const handleComplete = () => {
    // Navigate back to home page after successful transaction creation
    router.replace('/(tabs)');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: t('addRecurringTransaction'),
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
        <Text style={styles.title}>{t('addRecurringTransaction')}</Text>
        <Text style={styles.subtitle}>
          {t('setupRecurring')}
        </Text>
        
        <View style={styles.formContainer}>
          <RecurringTransactionForm onComplete={handleComplete} />
        </View>
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
});