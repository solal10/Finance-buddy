import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { ArrowDownLeft, ArrowUpRight, Plus, Repeat, Target } from 'lucide-react-native';
import { useTranslation } from '@/utils/i18n';

export default function WidgetScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: t('quickActions'),
          headerShadowVisible: false,
          presentation: 'modal',
        }} 
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>{t('quickActions')}</Text>
        <Text style={styles.subtitle}>
          {t('chooseAction')}
        </Text>
        
        <View style={styles.actions}>
          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.danger }]}
            onPress={() => {
              router.push('/add-transaction');
            }}
          >
            <ArrowDownLeft size={24} color={colors.white} />
            <Text style={styles.actionButtonText}>{t('addExpense')}</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.success }]}
            onPress={() => {
              router.push('/quick-add');
            }}
          >
            <ArrowUpRight size={24} color={colors.white} />
            <Text style={styles.actionButtonText}>{t('addIncome')}</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              router.push('/add-recurring');
            }}
          >
            <Repeat size={24} color={colors.white} />
            <Text style={styles.actionButtonText}>{t('addRecurring')}</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.secondary }]}
            onPress={() => {
              router.push('/add-project');
            }}
          >
            <Target size={24} color={colors.white} />
            <Text style={styles.actionButtonText}>{t('addProject')}</Text>
          </Pressable>
        </View>
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
    padding: 24,
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
    marginBottom: 32,
  },
  actions: {
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
  },
});