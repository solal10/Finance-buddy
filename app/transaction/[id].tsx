import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useFinanceStore, useTransactions, useCategories, useProfile } from '@/store/finance-store';
import { colors } from '@/constants/colors';
import { formatCurrency, formatDate } from '@/utils/format';
import { ArrowDownLeft, ArrowUpRight, Calendar, Edit2, Repeat, Trash2 } from 'lucide-react-native';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const transactions = useTransactions();
  const categories = useCategories();
  const profile = useProfile();
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);
  
  const transaction = transactions.find((t) => t.id === id);
  const category = transaction ? categories.find((c) => c.id === transaction.category) : null;
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            if (transaction) {
              deleteTransaction(transaction.id);
              router.back();
            }
          }
        },
      ]
    );
  };
  
  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Transaction Details' }} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Transaction not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'Transaction Details',
          headerRight: () => (
            <Pressable onPress={handleDelete} style={styles.deleteButton}>
              <Trash2 size={20} color={colors.danger} />
            </Pressable>
          ),
        }} 
      />
      
      <ScrollView>
        <View style={styles.header}>
          <View 
            style={[
              styles.iconContainer, 
              { backgroundColor: category?.color || colors.textLight }
            ]}
          >
            {transaction.isRecurring ? (
              <Repeat size={24} color={colors.white} />
            ) : transaction.type === 'expense' ? (
              <ArrowDownLeft size={24} color={colors.white} />
            ) : (
              <ArrowUpRight size={24} color={colors.white} />
            )}
          </View>
          
          <Text style={styles.description}>{transaction.description}</Text>
          
          <Text 
            style={[
              styles.amount,
              transaction.type === 'expense' ? styles.expense : styles.income
            ]}
          >
            {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount, profile.currency)}
          </Text>
        </View>
        
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <View style={styles.detailValueContainer}>
              <Calendar size={16} color={colors.textLight} style={styles.detailIcon} />
              <Text style={styles.detailValue}>{formatDate(transaction.date)}</Text>
            </View>
          </View>
          
          {transaction.type === 'expense' && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <View style={styles.categoryBadge}>
                <View 
                  style={[
                    styles.categoryDot, 
                    { backgroundColor: category?.color || colors.textLight }
                  ]} 
                />
                <Text style={styles.detailValue}>
                  {category?.name || 'Uncategorized'}
                </Text>
              </View>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text 
              style={[
                styles.detailValue,
                transaction.type === 'expense' ? styles.expenseText : styles.incomeText
              ]}
            >
              {transaction.type === 'expense' ? 'Expense' : 'Income'}
            </Text>
          </View>
          
          {transaction.isRecurring && transaction.recurringDetails && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Recurring</Text>
              <Text style={styles.detailValue}>
                {transaction.recurringDetails.frequency.charAt(0).toUpperCase() + 
                  transaction.recurringDetails.frequency.slice(1)}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.actions}>
          <Pressable 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => {
              // In a real app, navigate to edit screen
              Alert.alert('Edit Transaction', 'This feature would allow editing the transaction.');
            }}
          >
            <Edit2 size={20} color={colors.white} />
            <Text style={styles.actionButtonText}>Edit Transaction</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.actionButton, styles.deleteButtonFull]}
            onPress={handleDelete}
          >
            <Trash2 size={20} color={colors.white} />
            <Text style={styles.actionButtonText}>Delete Transaction</Text>
          </Pressable>
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
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  expense: {
    color: colors.danger,
  },
  income: {
    color: colors.success,
  },
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.text,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 6,
  },
  detailValue: {
    fontSize: 16,
    color: colors.textLight,
  },
  expenseText: {
    color: colors.danger,
  },
  incomeText: {
    color: colors.success,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  actions: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButtonFull: {
    backgroundColor: colors.danger,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    padding: 8,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: colors.textLight,
  },
});