import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinanceStore } from '@/store/finance-store';
import { colors } from '@/constants/colors';
import CategoryPieChart from '@/components/CategoryPieChart';
import MonthlyChart from '@/components/MonthlyChart';
import { useTranslation } from '@/utils/i18n';

export default function ReportsScreen() {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const transactions = useFinanceStore((state) => state.transactions);
  const { t } = useTranslation();
  
  // Get start and end dates based on selected time range
  const today = new Date();
  let startDate = new Date();
  
  if (timeRange === 'month') {
    startDate.setMonth(today.getMonth() - 1);
  } else if (timeRange === 'quarter') {
    startDate.setMonth(today.getMonth() - 3);
  } else {
    startDate.setFullYear(today.getFullYear() - 1);
  }
  
  // Memoize expensive calculations
  const monthlyTotals = useMemo(() => {
    return useFinanceStore.getState().getMonthlyTotals(
      timeRange === 'month' ? 1 : timeRange === 'quarter' ? 3 : 12
    );
  }, [timeRange, transactions]);
  
  const categoryTotals = useMemo(() => {
    return useFinanceStore.getState().getCategoryTotals(
      startDate.toISOString(), today.toISOString()
    );
  }, [startDate, today, timeRange, transactions]);
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Reports</Text>
        </View>
        
        <View style={styles.timeRangeSelector}>
          <Pressable
            style={[
              styles.timeRangeButton,
              timeRange === 'month' && styles.timeRangeButtonActive,
            ]}
            onPress={() => setTimeRange('month')}
          >
            <Text
              style={[
                styles.timeRangeButtonText,
                timeRange === 'month' && styles.timeRangeButtonTextActive,
              ]}
            >
              Month
            </Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.timeRangeButton,
              timeRange === 'quarter' && styles.timeRangeButtonActive,
            ]}
            onPress={() => setTimeRange('quarter')}
          >
            <Text
              style={[
                styles.timeRangeButtonText,
                timeRange === 'quarter' && styles.timeRangeButtonTextActive,
              ]}
            >
              Quarter
            </Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.timeRangeButton,
              timeRange === 'year' && styles.timeRangeButtonActive,
            ]}
            onPress={() => setTimeRange('year')}
          >
            <Text
              style={[
                styles.timeRangeButtonText,
                timeRange === 'year' && styles.timeRangeButtonTextActive,
              ]}
            >
              Year
            </Text>
          </Pressable>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('spendingByCategory')}</Text>
          </View>
          
          <View style={styles.card}>
            {categoryTotals.length > 0 ? (
              <CategoryPieChart data={categoryTotals} />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>{t('noExpenseData')}</Text>
                <Text style={styles.emptyStateSubtext}>
                  {t('addExpensesToSeeBreakdown')}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('incomeVsExpenses')}</Text>
          </View>
          
          <View style={styles.card}>
            {monthlyTotals.length > 0 && (monthlyTotals.some(m => m.expenses > 0) || monthlyTotals.some(m => m.income > 0)) ? (
              <MonthlyChart data={monthlyTotals} />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>{t('noTransactionData')}</Text>
                <Text style={styles.emptyStateSubtext}>
                  {t('addTransactionsToSeeTrends')}
                </Text>
              </View>
            )}
          </View>
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.card,
    marginHorizontal: 4,
  },
  timeRangeButtonActive: {
    backgroundColor: colors.primary,
  },
  timeRangeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  timeRangeButtonTextActive: {
    color: colors.white,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});