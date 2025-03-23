import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFinanceStore, useProfile } from '@/store/finance-store';
import { colors } from '@/constants/colors';
import { formatCurrency, formatDate } from '@/utils/format';
import { useTranslation } from '@/utils/i18n';
import { Calendar, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function UpcomingTransactions() {
  const { t } = useTranslation();
  const router = useRouter();
  const profile = useProfile();
  
  // Get upcoming transactions for the next 7 days
  const upcomingTransactions = useFinanceStore((state) => state.getUpcomingExpectedTransactions(7));
  const markAsPaid = useFinanceStore((state) => state.markExpectedTransactionAsPaid);
  
  const handleAddExpected = () => {
    router.push('/add-expected');
  };
  
  const handleMarkAsPaid = (id: string) => {
    markAsPaid(id);
  };
  
  if (upcomingTransactions.length === 0) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('upcomingTransactions')}</Text>
        <Pressable onPress={handleAddExpected}>
          <Text style={styles.addButton}>{t('addNew')}</Text>
        </Pressable>
      </View>
      
      <View style={styles.transactionsContainer}>
        {upcomingTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionDetails}>
              <View style={styles.dateContainer}>
                <Calendar size={16} color={colors.textLight} style={styles.icon} />
                <Text style={styles.date}>{formatDate(transaction.dueDate, profile.language)}</Text>
              </View>
              
              <Text style={styles.description}>{transaction.description}</Text>
              
              <Text 
                style={[
                  styles.amount,
                  transaction.type === 'expense' ? styles.expense : styles.income
                ]}
              >
                {transaction.type === 'expense' ? '-' : '+'}
                {formatCurrency(transaction.amount, profile.currency)}
              </Text>
            </View>
            
            <Pressable 
              style={styles.markPaidButton}
              onPress={() => handleMarkAsPaid(transaction.id)}
            >
              <Check size={16} color={colors.white} />
              <Text style={styles.markPaidText}>{t('markAsPaid')}</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  transactionsContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },
  transactionItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 16,
  },
  transactionDetails: {
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    marginRight: 4,
  },
  date: {
    fontSize: 12,
    color: colors.textLight,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  expense: {
    color: colors.danger,
  },
  income: {
    color: colors.success,
  },
  markPaidButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: 8,
    borderRadius: 8,
  },
  markPaidText: {
    color: colors.white,
    fontWeight: '500',
    marginLeft: 4,
  },
});