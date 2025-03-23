import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinanceStore, useProfile } from '@/store/finance-store';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/format';
import BudgetProgress from '@/components/BudgetProgress';
import { Check, Edit2 } from 'lucide-react-native';

export default function BudgetScreen() {
  const profile = useProfile();
  const updateProfile = useFinanceStore((state) => state.updateProfile);
  
  const [isEditing, setIsEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState(profile.monthlyBudget.toString());
  
  // Memoize expensive calculations
  const categoryTotals = useMemo(() => {
    return useFinanceStore.getState().getCategoryTotals();
  }, []);
  
  const handleSaveBudget = () => {
    const newBudget = parseFloat(budgetInput);
    if (!isNaN(newBudget) && newBudget > 0) {
      updateProfile({ monthlyBudget: newBudget });
    } else {
      setBudgetInput(profile.monthlyBudget.toString());
    }
    setIsEditing(false);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Budget</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetTitle}>Monthly Budget</Text>
            {isEditing ? (
              <Pressable onPress={handleSaveBudget}>
                <Check size={24} color={colors.primary} />
              </Pressable>
            ) : (
              <Pressable onPress={() => setIsEditing(true)}>
                <Edit2 size={20} color={colors.text} />
              </Pressable>
            )}
          </View>
          
          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.budgetInput}
                value={budgetInput}
                onChangeText={setBudgetInput}
                keyboardType="numeric"
                autoFocus
                onSubmitEditing={handleSaveBudget}
              />
            </View>
          ) : (
            <BudgetProgress />
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          
          {categoryTotals.length > 0 ? (
            <View style={styles.categoriesList}>
              {categoryTotals.map((category) => {
                const percentage = Math.min(
                  (category.amount / profile.monthlyBudget) * 100,
                  100
                );
                
                return (
                  <View key={category.categoryId} style={styles.categoryItem}>
                    <View style={styles.categoryHeader}>
                      <Text style={styles.categoryName}>{category.categoryName}</Text>
                      <Text style={styles.categoryAmount}>
                        {formatCurrency(category.amount, profile.currency)}
                      </Text>
                    </View>
                    
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBackground}>
                        <View 
                          style={[
                            styles.progressFill,
                            { 
                              width: `${percentage}%`, 
                              backgroundColor: category.color 
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {percentage.toFixed(1)}% of budget
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No expense data</Text>
              <Text style={styles.emptyStateSubtext}>
                Add some expenses to see your category breakdown
              </Text>
            </View>
          )}
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
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  editContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  budgetInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  categoriesList: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  progressContainer: {
    marginBottom: 4,
  },
  progressBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: colors.textLight,
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
});