import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useFinanceStore, useExpectedTransactions, useProfile } from '@/store/finance-store';
import { colors } from '@/constants/colors';
import { formatCurrency, formatDate } from '@/utils/format';
import { ArrowDownLeft, ArrowUpRight, Check, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/utils/i18n';

export default function ExpectedTransactionsList() {
  const router = useRouter();
  const { t } = useTranslation();
  const expectedTransactions = useExpectedTransactions();
  const profile = useProfile();
  const markExpectedTransactionAsPaid = useFinanceStore((state) => state.markExpectedTransactionAsPaid);
  
  // Filter to show only unpaid transactions
  const unpaidTransactions = expectedTransactions.filter(t => !t.isPaid);
  
  // Sort by due date (closest first)
  const sortedTransactions = [...unpaidTransactions].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
  
  if (sortedTransactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('noExpectedTransactions')}</Text>
        <Text style={styles.emptySubtext}>{t('addExpectedTransactionsToTrack')}</Text>
        <Pressable 
          style={styles.addButton}
          onPress={() => router.push('/add-expected')}
        >
          <Plus size={18} color={colors.white} />
          <Text style={styles.addButtonText}>{t('addExpectedTransaction')}</Text>
        </Pressable>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={sortedTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isOverdue = new Date(item.dueDate) < new Date();
          
          return (
            <View style={styles.transactionItem}>
              <View style={styles.transactionContent}>
                <View 
                  style={[
                    styles.iconContainer,
                    { backgroundColor: item.type === 'expense' ? colors.danger : colors.success }
                  ]}
                >
                  {item.type === 'expense' ? (
                    <ArrowDownLeft size={18} color={colors.white} />
                  ) : (
                    <ArrowUpRight size={18} color={colors.white} />
                  )}
                </View>
                
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDescription}>{item.description}</Text>
                  <Text style={styles.transactionDate}>
                    {t('dueDate')}: {formatDate(item.dueDate, profile.language)}
                    {isOverdue && (
                      <Text style={styles.overdueText}> ({t('overdue')})</Text>
                    )}
                  </Text>
                </View>
                
                <Text 
                  style={[
                    styles.transactionAmount,
                    item.type === 'expense' ? styles.expenseText : styles.incomeText
                  ]}
                >
                  {item.type === 'expense' ? '-' : '+'}{formatCurrency(item.amount, profile.currency)}
                </Text>
              </View>
              
              <View style={styles.actionButtons}>
                <Pressable 
                  style={styles.markPaidButton}
                  onPress={() => markExpectedTransactionAsPaid(item.id)}
                >
                  <Check size={16} color={colors.white} />
                  <Text style={styles.markPaidText}>{t('markAsPaid')}</Text>
                </Pressable>
                
                <Pressable 
                  style={styles.editButton}
                  onPress={() => router.push(`/expected/${item.id}`)}
                >
                  <Text style={styles.editButtonText}>{t('details')}</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          <Pressable 
            style={styles.addMoreButton}
            onPress={() => router.push('/add-expected')}
          >
            <Plus size={18} color={colors.primary} />
            <Text style={styles.addMoreText}>{t('addMore')}</Text>
          </Pressable>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  transactionItem: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: colors.textLight,
  },
  overdueText: {
    color: colors.danger,
    fontWeight: '500',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  expenseText: {
    color: colors.danger,
  },
  incomeText: {
    color: colors.success,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  markPaidButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  markPaidText: {
    color: colors.white,
    fontWeight: '500',
    marginLeft: 6,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editButtonText: {
    color: colors.text,
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  addMoreText: {
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 6,
  },
  emptyContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    margin: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: 8,
  },
});