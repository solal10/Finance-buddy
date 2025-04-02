import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useFinanceStore, useProfile, useProjects, useExpectedTransactions } from '@/store/finance-store';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/format';
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react-native';
import { useTranslation } from '@/utils/i18n';
import ExpectedTransactionsList from '@/components/ExpectedTransactionsList';

export default function BalanceDetailsScreen() {
  const { t } = useTranslation();
  const profile = useProfile();
  const projects = useProjects();
  const expectedTransactions = useExpectedTransactions();
  
  // Calculate total balance
  const totalBalance = useMemo(() => {
    return useFinanceStore.getState().transactions.reduce((sum, t) => {
      return sum + (t.type === 'income' ? t.amount : -t.amount);
    }, 0);
  }, [useFinanceStore.getState().transactions]);
  
  // Calculate money allocated to projects
  const allocatedToProjects = useMemo(() => {
    return projects.reduce((sum, p) => sum + p.currentAmount, 0);
  }, [projects]);
  
  // Calculate expected expenses and income
  const expectedExpenses = useMemo(() => {
    return expectedTransactions
      .filter(t => !t.isPaid && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [expectedTransactions]);
  
  const expectedIncome = useMemo(() => {
    return expectedTransactions
      .filter(t => !t.isPaid && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [expectedTransactions]);
  
  // Calculate available balance
  const availableBalance = useMemo(() => {
    return totalBalance - allocatedToProjects - expectedExpenses + expectedIncome;
  }, [totalBalance, allocatedToProjects, expectedExpenses, expectedIncome]);
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: t('balanceDetails'),
          headerShadowVisible: false,
        }} 
      />
      
      <ScrollView>
        <View style={styles.header}>
          <Wallet size={40} color={colors.primary} />
          <Text style={styles.title}>{t('balanceDetails')}</Text>
        </View>
        
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{t('availableBalance')}</Text>
          <Text style={[
            styles.balanceValue,
            availableBalance > 0 ? styles.positiveBalance : styles.negativeBalance
          ]}>
            {formatCurrency(availableBalance, profile.currency)}
          </Text>
        </View>
        
        <View style={styles.detailsCard}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t('totalBalance')}</Text>
            <Text style={[
              styles.detailValue,
              totalBalance > 0 ? styles.positiveAmount : styles.negativeAmount
            ]}>
              {formatCurrency(totalBalance, profile.currency)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t('allocatedToProjects')}</Text>
            <Text style={styles.detailValue}>
              - {formatCurrency(allocatedToProjects, profile.currency)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <View style={styles.detailLabelWithIcon}>
              <ArrowDownLeft size={16} color={colors.danger} />
              <Text style={styles.detailLabel}>{t('expectedExpenses')}</Text>
            </View>
            <Text style={styles.negativeAmount}>
              - {formatCurrency(expectedExpenses, profile.currency)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <View style={styles.detailLabelWithIcon}>
              <ArrowUpRight size={16} color={colors.success} />
              <Text style={styles.detailLabel}>{t('expectedIncome')}</Text>
            </View>
            <Text style={styles.positiveAmount}>
              + {formatCurrency(expectedIncome, profile.currency)}
            </Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t('availableBalance')}</Text>
            <Text style={[
              styles.totalValue,
              availableBalance > 0 ? styles.positiveBalance : styles.negativeBalance
            ]}>
              {formatCurrency(availableBalance, profile.currency)}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('upcomingTransactions')}</Text>
          <ExpectedTransactionsList />
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
    alignItems: 'center',
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
  },
  balanceCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  positiveBalance: {
    color: colors.success,
  },
  negativeBalance: {
    color: colors.danger,
  },
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  positiveAmount: {
    color: colors.success,
    fontWeight: '500',
  },
  negativeAmount: {
    color: colors.danger,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 12,
  },
});