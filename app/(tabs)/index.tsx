import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinanceStore } from '@/store/finance-store';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/format';
import BudgetProgress from '@/components/BudgetProgress';
import MonthlyChart from '@/components/MonthlyChart';
import TransactionItem from '@/components/TransactionItem';
import BalanceHeader from '@/components/BalanceHeader';
import ProjectsList from '@/components/ProjectsList';
import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/utils/i18n';

export default function DashboardScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const profile = useFinanceStore((state) => state.profile);
  const transactions = useFinanceStore((state) => state.transactions);
  
  // Use memoized values to prevent infinite loops
  const monthlyTotals = useMemo(() => {
    return useFinanceStore.getState().getMonthlyTotals(6);
  }, [transactions]);
  
  const currentMonthExpenses = useMemo(() => {
    return useFinanceStore.getState().getCurrentMonthExpenses();
  }, [transactions]);
  
  const currentMonthIncome = useMemo(() => {
    return useFinanceStore.getState().getCurrentMonthIncome();
  }, [transactions]);
  
  // Get recent transactions (last 5)
  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 5);
  }, [transactions]);
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{t('hello')}, {profile.firstName} {profile.lastName}</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString(profile.language === 'fr' ? 'fr-FR' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>
        
        <BalanceHeader />
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('projects')}</Text>
            <Pressable onPress={() => router.push('/projects')}>
              <Text style={styles.seeAllButton}>{t('seeAll')}</Text>
            </Pressable>
          </View>
          
          <ProjectsList />
        </View>
        
        <View style={styles.section}>
          <BudgetProgress />
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('financialOverview')}</Text>
          </View>
          <View style={styles.chartCard}>
            <MonthlyChart data={monthlyTotals} />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('recentActivity')}</Text>
            <Pressable onPress={() => router.push('/transactions')}>
              <Text style={styles.seeAllButton}>{t('seeAll')}</Text>
            </Pressable>
          </View>
          
          {recentTransactions.length > 0 ? (
            <View style={styles.transactionsList}>
              {recentTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onPress={(transaction) => router.push(`/transaction/${transaction.id}`)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>{t('noTransactions')}</Text>
              <Text style={styles.emptyStateSubtext}>
                {t('addFirstTransaction')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      <Pressable 
        style={styles.addButton}
        onPress={() => router.push('/add-transaction')}
      >
        <Plus size={24} color={colors.white} />
      </Pressable>
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
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: colors.textLight,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  seeAllButton: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },
  transactionsList: {
    marginTop: 8,
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: 16,
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
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});