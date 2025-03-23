import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Transaction } from '@/types/finance';
import { formatCurrency, formatDate } from '@/utils/format';
import { useCategories, useProfile } from '@/store/finance-store';
import { colors } from '@/constants/colors';
import { ArrowDownLeft, ArrowUpRight, Repeat } from 'lucide-react-native';
import { useTranslation } from '@/utils/i18n';

interface TransactionItemProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
}

export default function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const { t } = useTranslation();
  const categories = useCategories();
  const profile = useProfile();
  
  const category = categories.find((c) => c.id === transaction.category);
  
  return (
    <Pressable 
      style={styles.container}
      onPress={() => onPress(transaction)}
      android_ripple={{ color: colors.border }}
    >
      <View style={[styles.iconContainer, { backgroundColor: category?.color || colors.textLight }]}>
        {transaction.isRecurring ? (
          <Repeat size={18} color={colors.white} />
        ) : transaction.type === 'expense' ? (
          <ArrowDownLeft size={18} color={colors.white} />
        ) : (
          <ArrowUpRight size={18} color={colors.white} />
        )}
      </View>
      
      <View style={styles.details}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={styles.category}>
          {t(category?.id as any) || t('uncategorized')} • {formatDate(transaction.date, profile.language)}
        </Text>
      </View>
      
      <Text style={[
        styles.amount,
        transaction.type === 'expense' ? styles.expense : styles.income
      ]}>
        {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount, profile.currency)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: colors.textLight,
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
});