import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useFinanceStore, useCategories } from '@/store/finance-store';
import { ExpectedTransaction } from '@/types/finance';
import { ArrowDownLeft, ArrowUpRight, Calendar, Check } from 'lucide-react-native';
import { useTranslation } from '@/utils/i18n';

export default function AddExpectedTransactionScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const categories = useCategories();
  const addExpectedTransaction = useFinanceStore((state) => state.addExpectedTransaction);
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  
  const handleAddTransaction = () => {
    if (!amount || parseFloat(amount) <= 0 || !description) {
      return;
    }
    
    // For income, if no category is selected, use a default one
    const categoryToUse = type === 'income' ? 'other' : selectedCategory;
    
    // Validate that we have a category for expenses
    if (type === 'expense' && !categoryToUse) {
      return;
    }
    
    const newTransaction: Omit<ExpectedTransaction, 'id'> = {
      amount: parseFloat(amount),
      description,
      category: categoryToUse,
      dueDate: dueDate.toISOString(),
      type,
      isPaid: false,
    };
    
    addExpectedTransaction(newTransaction);
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: t('addExpectedTransaction'),
          headerShadowVisible: false,
        }} 
      />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{t('addExpectedTransaction')}</Text>
        <Text style={styles.subtitle}>
          {t('trackUpcomingTransactions')}
        </Text>
        
        <View style={styles.form}>
          <View style={styles.typeSelector}>
            <Pressable
              style={[
                styles.typeButton,
                type === 'expense' && styles.typeButtonActive,
              ]}
              onPress={() => setType('expense')}
            >
              <ArrowDownLeft size={18} color={type === 'expense' ? colors.white : colors.text} />
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'expense' && styles.typeButtonTextActive,
                ]}
              >
                {t('expense')}
              </Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.typeButton,
                type === 'income' && styles.typeButtonActive,
                type === 'income' && { backgroundColor: colors.success },
              ]}
              onPress={() => setType('income')}
            >
              <ArrowUpRight size={18} color={type === 'income' ? colors.white : colors.text} />
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'income' && styles.typeButtonTextActive,
                ]}
              >
                {t('income')}
              </Text>
            </Pressable>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('amount')}</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor={colors.textLight}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('description')}</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder={t('whatIsThisFor')}
              placeholderTextColor={colors.textLight}
            />
          </View>
          
          {type === 'expense' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('category')}</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
              >
                {categories.map((category) => (
                  <Pressable
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.id && {
                        backgroundColor: category.color,
                        borderColor: category.color,
                      },
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === category.id && styles.categoryButtonTextActive,
                      ]}
                    >
                      {t(category.id as any)}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('dueDate')}</Text>
            <Pressable 
              style={styles.dateButton}
              onPress={() => {
                // In a real app, show a date picker here
                // For this demo, we'll just add 1 month to the current date
                const newDate = new Date();
                newDate.setMonth(newDate.getMonth() + 1);
                setDueDate(newDate);
              }}
            >
              <Calendar size={20} color={colors.textLight} />
              <Text style={styles.dateButtonText}>
                {dueDate.toLocaleDateString()}
              </Text>
            </Pressable>
          </View>
        </View>
        
        <Pressable
          style={[
            styles.addButton,
            (!amount || parseFloat(amount) <= 0 || !description || (type === 'expense' && !selectedCategory)) && 
              styles.addButtonDisabled,
          ]}
          onPress={handleAddTransaction}
          disabled={!amount || parseFloat(amount) <= 0 || !description || (type === 'expense' && !selectedCategory)}
        >
          <Check size={20} color={colors.white} />
          <Text style={styles.addButtonText}>{t('addExpectedTransaction')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.card,
    marginHorizontal: 4,
  },
  typeButtonActive: {
    backgroundColor: colors.danger,
  },
  typeButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  typeButtonTextActive: {
    color: colors.white,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoriesContainer: {
    paddingVertical: 4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  categoryButtonTextActive: {
    color: colors.white,
    fontWeight: '500',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  addButtonDisabled: {
    backgroundColor: colors.border,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});