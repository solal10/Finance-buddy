import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useFinanceStore, useProfile } from '@/store/finance-store';
import { ChevronRight } from 'lucide-react-native';
import { useTranslation } from '@/utils/i18n';

export default function BalanceHeader() {
  const router = useRouter();
  const { t } = useTranslation();
  const profile = useProfile();
  const availableBalance = useFinanceStore((state) => state.getAvailableBalance());
  const expectedIncome = useFinanceStore((state) => state.getExpectedIncome());
  const expectedExpenses = useFinanceStore((state) => state.getExpectedExpenses());
  
  // Determine balance color based on amount
  const getBalanceColor = (balance: number) => {
    if (balance > 500) return colors.success;
    if (balance > 100) return colors.warning;
    return colors.danger;
  };
  
  const balanceColor = getBalanceColor(availableBalance);
  
  const currencySymbol = profile.currency === 'EUR' ? '€' : 
                         profile.currency === 'ILS' ? '₪' : '$';
  
  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>{t('availableBalance')}</Text>
        <Text style={[styles.balanceAmount, { color: balanceColor }]}>
          {currencySymbol}{availableBalance.toFixed(2)}
        </Text>
        
        <Pressable 
          style={styles.detailsButton}
          onPress={() => router.push('/balance-details')}
        >
          <Text style={styles.detailsButtonText}>{t('viewDetails')}</Text>
          <ChevronRight size={16} color={colors.primary} />
        </Pressable>
      </View>
      
      <View style={styles.expectedContainer}>
        <View style={styles.expectedItem}>
          <Text style={styles.expectedLabel}>{t('expectedIncome')}</Text>
          <Text style={styles.expectedAmount}>
            {currencySymbol}{expectedIncome.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.expectedItem}>
          <Text style={styles.expectedLabel}>{t('expectedExpenses')}</Text>
          <Text style={styles.expectedAmount}>
            {currencySymbol}{expectedExpenses.toFixed(2)}
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
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  expectedContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  expectedItem: {
    flex: 1,
    alignItems: 'center',
  },
  expectedLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  expectedAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
});