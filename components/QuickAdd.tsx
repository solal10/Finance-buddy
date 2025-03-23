import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { useFinanceStore, useCategories, usePaymentMethods } from '@/store/finance-store';
import { Transaction } from '@/types/finance';
import { ArrowDownLeft, ArrowUpRight, Check, CreditCard, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/utils/i18n';

export default function QuickAdd({ onComplete }: { onComplete?: () => void }) {
  const router = useRouter();
  const { t, isRTL } = useTranslation();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isCreditPurchase, setIsCreditPurchase] = useState(false);
  const [totalMonths, setTotalMonths] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  const categories = useCategories();
  const paymentMethods = usePaymentMethods();
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const addCreditPurchase = useFinanceStore((state) => state.addCreditPurchase);
  
  // Get subcategories for the selected category
  const subcategories = selectedCategory ? 
    categories.find(c => c.id === selectedCategory)?.subcategories || [] : [];
  
  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategory('');
  }, [selectedCategory]);
  
  // Reset credit purchase fields when type changes
  useEffect(() => {
    if (type === 'income') {
      setIsCreditPurchase(false);
    }
  }, [type]);
  
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
    
    // Find the selected payment method
    const paymentMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
    
    if (isCreditPurchase && type === 'expense') {
      // Add as credit purchase
      if (!totalMonths || parseInt(totalMonths) <= 0) {
        return;
      }
      
      const transaction: Omit<Transaction, 'id'> = {
        amount: parseFloat(amount),
        description,
        category: categoryToUse,
        subcategory: selectedSubcategory || undefined,
        date: new Date().toISOString(),
        type,
        isRecurring: false,
        paymentMethod: paymentMethod,
        isCreditPurchase: true,
      };
      
      addCreditPurchase(transaction, {
        totalAmount: parseFloat(amount),
        totalMonths: parseInt(totalMonths),
        startDate: startDate || new Date().toISOString(),
        monthlyPayment: parseFloat(amount) / parseInt(totalMonths),
      });
    } else {
      // Add as regular transaction
      const newTransaction: Omit<Transaction, 'id'> = {
        amount: parseFloat(amount),
        description,
        category: categoryToUse,
        subcategory: selectedSubcategory || undefined,
        date: new Date().toISOString(),
        type,
        isRecurring: false,
        paymentMethod: paymentMethod,
      };
      
      addTransaction(newTransaction);
    }
    
    // Reset form
    setAmount('');
    setDescription('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedPaymentMethod('');
    setIsCreditPurchase(false);
    setTotalMonths('');
    
    if (onComplete) {
      onComplete();
    }
  };
  
  const handleMakeRecurring = () => {
    // Navigate to recurring transaction screen
    router.push('/add-recurring');
  };
  
  return (
    <View style={styles.container}>
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
          style={[styles.input, isRTL && styles.rtlInput]}
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="numeric"
          placeholderTextColor={colors.textLight}
          textAlign={isRTL ? 'right' : 'left'}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t('description')}</Text>
        <TextInput
          style={[styles.input, isRTL && styles.rtlInput]}
          value={description}
          onChangeText={setDescription}
          placeholder={t('whatWasThisFor')}
          placeholderTextColor={colors.textLight}
          textAlign={isRTL ? 'right' : 'left'}
        />
      </View>
      
      {type === 'expense' && (
        <>
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
          
          {selectedCategory && subcategories.length > 0 && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('subcategory')}</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
              >
                {subcategories.map((subcategory) => (
                  <Pressable
                    key={subcategory.id}
                    style={[
                      styles.categoryButton,
                      selectedSubcategory === subcategory.id && {
                        backgroundColor: categories.find(c => c.id === selectedCategory)?.color,
                        borderColor: categories.find(c => c.id === selectedCategory)?.color,
                      },
                    ]}
                    onPress={() => setSelectedSubcategory(subcategory.id)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedSubcategory === subcategory.id && styles.categoryButtonTextActive,
                      ]}
                    >
                      {t(subcategory.id as any)}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('paymentMethod')}</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {paymentMethods.map((method) => (
                <Pressable
                  key={method.id}
                  style={[
                    styles.paymentMethodButton,
                    selectedPaymentMethod === method.id && styles.paymentMethodButtonActive,
                  ]}
                  onPress={() => setSelectedPaymentMethod(method.id)}
                >
                  <CreditCard size={16} color={selectedPaymentMethod === method.id ? colors.white : colors.text} />
                  <Text
                    style={[
                      styles.paymentMethodButtonText,
                      selectedPaymentMethod === method.id && styles.paymentMethodButtonTextActive,
                    ]}
                  >
                    {method.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.creditPurchaseContainer}>
            <Pressable
              style={[
                styles.creditPurchaseToggle,
                isCreditPurchase && styles.creditPurchaseToggleActive,
              ]}
              onPress={() => setIsCreditPurchase(!isCreditPurchase)}
            >
              <Text
                style={[
                  styles.creditPurchaseToggleText,
                  isCreditPurchase && styles.creditPurchaseToggleTextActive,
                ]}
              >
                {t('creditPurchase')}
              </Text>
            </Pressable>
          </View>
          
          {isCreditPurchase && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('remainingMonths')}</Text>
                <TextInput
                  style={[styles.input, isRTL && styles.rtlInput]}
                  value={totalMonths}
                  onChangeText={setTotalMonths}
                  placeholder="6"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textLight}
                  textAlign={isRTL ? 'right' : 'left'}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('startDate')}</Text>
                <Pressable 
                  style={styles.dateButton}
                  onPress={() => {
                    // In a real app, show a date picker here
                  }}
                >
                  <Calendar size={20} color={colors.textLight} />
                  <Text style={styles.dateButtonText}>
                    {new Date(startDate).toLocaleDateString()}
                  </Text>
                </Pressable>
              </View>
              
              {amount && totalMonths && !isNaN(parseFloat(amount)) && !isNaN(parseInt(totalMonths)) && (
                <View style={styles.monthlyPaymentContainer}>
                  <Text style={styles.monthlyPaymentLabel}>{t('monthlyPayment')}:</Text>
                  <Text style={styles.monthlyPaymentValue}>
                    {(parseFloat(amount) / parseInt(totalMonths)).toFixed(2)}
                  </Text>
                </View>
              )}
            </>
          )}
        </>
      )}
      
      <View style={styles.buttonContainer}>
        <Pressable 
          style={[
            styles.addButton,
            (!amount || parseFloat(amount) <= 0 || !description || 
             (type === 'expense' && !selectedCategory) ||
             (isCreditPurchase && (!totalMonths || parseInt(totalMonths) <= 0))) && 
              styles.addButtonDisabled,
          ]}
          onPress={handleAddTransaction}
          disabled={!amount || parseFloat(amount) <= 0 || !description || 
                   (type === 'expense' && !selectedCategory) ||
                   (isCreditPurchase && (!totalMonths || parseInt(totalMonths) <= 0))}
        >
          <Check size={20} color={colors.white} />
          <Text style={styles.addButtonText}>{t('add')} {t(type)}</Text>
        </Pressable>
        
        <Pressable
          style={styles.recurringButton}
          onPress={handleMakeRecurring}
        >
          <Text style={styles.recurringButtonText}>{t('makeItRecurring')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
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
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  rtlInput: {
    textAlign: 'right',
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
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentMethodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  paymentMethodButtonText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 6,
  },
  paymentMethodButtonTextActive: {
    color: colors.white,
  },
  creditPurchaseContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  creditPurchaseToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  creditPurchaseToggleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  creditPurchaseToggleText: {
    fontSize: 14,
    color: colors.text,
  },
  creditPurchaseToggleTextActive: {
    color: colors.white,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  monthlyPaymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  monthlyPaymentLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginRight: 8,
  },
  monthlyPaymentValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  buttonContainer: {
    gap: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
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
  recurringButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  recurringButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});