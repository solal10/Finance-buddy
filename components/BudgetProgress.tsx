import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/format';
import { useFinanceStore } from '@/store/finance-store';
import { useTranslation } from '@/utils/i18n';

export default function BudgetProgress() {
  const { t } = useTranslation();
  const profile = useFinanceStore((state) => state.profile);
  
  // Memoize expensive calculations to prevent re-renders
  const expenses = useMemo(() => {
    return useFinanceStore.getState().getCurrentMonthExpenses();
  }, [useFinanceStore.getState().transactions]);
  
  const remaining = useMemo(() => {
    return profile.monthlyBudget - expenses;
  }, [profile.monthlyBudget, expenses]);
  
  // Calculate percentage safely
  const percentage = useMemo(() => {
    return profile.monthlyBudget > 0 ? Math.min(expenses / profile.monthlyBudget, 1) : 0;
  }, [profile.monthlyBudget, expenses]);
  
  const progressColor = useMemo(() => {
    return percentage > 0.9 
      ? colors.danger 
      : percentage > 0.7 
        ? colors.warning 
        : colors.success;
  }, [percentage]);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('monthlyBudget')}</Text>
        <Text style={styles.budget}>
          {formatCurrency(profile.monthlyBudget, profile.currency)}
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressFill,
              { width: `${percentage * 100}%`, backgroundColor: progressColor }
            ]} 
          />
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>{t('spent')}</Text>
          <Text style={[styles.detailValue, { color: colors.danger }]}>
            {formatCurrency(expenses, profile.currency)}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>{t('remaining')}</Text>
          <Text style={[styles.detailValue, { color: remaining >= 0 ? colors.success : colors.danger }]}>
            {formatCurrency(remaining, profile.currency)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  budget: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});