import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Modal } from 'react-native';
import { colors } from '@/constants/colors';
import { useFinanceStore, useCategories } from '@/store/finance-store';
import { Transaction, RecurringDetails } from '@/types/finance';
import { ArrowDownLeft, ArrowUpRight, Check, Calendar, ChevronUp, ChevronDown, X } from 'lucide-react-native';
import { useTranslation } from '@/utils/i18n';
import { useRouter } from 'expo-router';

interface RecurringTransactionFormProps {
  onComplete?: () => void;
}

// Simple date picker component
const SimpleDatePicker = ({ 
  value, 
  onChange,
  onClose
}: { 
  value: Date | null, 
  onChange: (date: Date) => void,
  onClose: () => void
}) => {
  const { t } = useTranslation();
  const initialDate = value || new Date();
  const [year, setYear] = useState(initialDate.getFullYear());
  const [month, setMonth] = useState(initialDate.getMonth() + 1);
  const [day, setDay] = useState(initialDate.getDate());

  const incrementYear = () => setYear(prev => prev + 1);
  const decrementYear = () => setYear(prev => prev - 1);
  
  const incrementMonth = () => {
    if (month === 12) {
      setMonth(1);
      incrementYear();
    } else {
      setMonth(prev => prev + 1);
    }
  };
  
  const decrementMonth = () => {
    if (month === 1) {
      setMonth(12);
      decrementYear();
    } else {
      setMonth(prev => prev - 1);
    }
  };
  
  const incrementDay = () => {
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day === daysInMonth) {
      setDay(1);
      incrementMonth();
    } else {
      setDay(prev => prev + 1);
    }
  };
  
  const decrementDay = () => {
    if (day === 1) {
      const prevMonthDays = new Date(year, month - 1, 0).getDate();
      setDay(prevMonthDays);
      decrementMonth();
    } else {
      setDay(prev => prev - 1);
    }
  };

  const handleConfirm = () => {
    const newDate = new Date(year, month - 1, day);
    onChange(newDate);
    onClose();
  };

  return (
    <View style={datePickerStyles.container}>
      <View style={datePickerStyles.header}>
        <Text style={datePickerStyles.title}>{t('selectDate')}</Text>
        <Pressable onPress={onClose} style={datePickerStyles.closeButton}>
          <X size={24} color={colors.text} />
        </Pressable>
      </View>
      
      <View style={datePickerStyles.pickerContainer}>
        <View style={datePickerStyles.pickerColumn}>
          <Text style={datePickerStyles.pickerLabel}>{t('month')}</Text>
          <Pressable onPress={incrementMonth} style={datePickerStyles.pickerButton}>
            <ChevronUp size={24} color={colors.primary} />
          </Pressable>
          <Text style={datePickerStyles.pickerValue}>
            {new Date(year, month - 1).toLocaleString('default', { month: 'short' })}
          </Text>
          <Pressable onPress={decrementMonth} style={datePickerStyles.pickerButton}>
            <ChevronDown size={24} color={colors.primary} />
          </Pressable>
        </View>
        
        <View style={datePickerStyles.pickerColumn}>
          <Text style={datePickerStyles.pickerLabel}>{t('day')}</Text>
          <Pressable onPress={incrementDay} style={datePickerStyles.pickerButton}>
            <ChevronUp size={24} color={colors.primary} />
          </Pressable>
          <Text style={datePickerStyles.pickerValue}>{day}</Text>
          <Pressable onPress={decrementDay} style={datePickerStyles.pickerButton}>
            <ChevronDown size={24} color={colors.primary} />
          </Pressable>
        </View>
        
        <View style={datePickerStyles.pickerColumn}>
          <Text style={datePickerStyles.pickerLabel}>{t('year')}</Text>
          <Pressable onPress={incrementYear} style={datePickerStyles.pickerButton}>
            <ChevronUp size={24} color={colors.primary} />
          </Pressable>
          <Text style={datePickerStyles.pickerValue}>{year}</Text>
          <Pressable onPress={decrementYear} style={datePickerStyles.pickerButton}>
            <ChevronDown size={24} color={colors.primary} />
          </Pressable>
        </View>
      </View>
      
      <Pressable style={datePickerStyles.confirmButton} onPress={handleConfirm}>
        <Text style={datePickerStyles.confirmButtonText}>{t('confirm')}</Text>
      </Pressable>
    </View>
  );
};

const datePickerStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  pickerColumn: {
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  pickerButton: {
    padding: 8,
  },
  pickerValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginVertical: 8,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function RecurringTransactionForm({ onComplete }: RecurringTransactionFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  const categories = useCategories();
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  
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
    
    const recurringDetails: RecurringDetails = {
      frequency,
      endDate: endDate ? endDate.toISOString() : undefined,
    };
    
    const newTransaction: Omit<Transaction, 'id'> = {
      amount: parseFloat(amount),
      description,
      category: categoryToUse,
      date: new Date().toISOString(),
      type,
      isRecurring: true,
      recurringDetails,
    };
    
    addTransaction(newTransaction);
    
    // Reset form
    setAmount('');
    setDescription('');
    setSelectedCategory('');
    setEndDate(null);
    
    // Navigate back to home
    router.replace('/(tabs)');
    
    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete();
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
            placeholder={t('whatWasThisFor')}
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
                    {t(category.id as any) || category.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('frequency')}</Text>
          <View style={styles.frequencyContainer}>
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((freq) => (
              <Pressable
                key={freq}
                style={[
                  styles.frequencyButton,
                  frequency === freq && styles.frequencyButtonActive,
                ]}
                onPress={() => setFrequency(freq)}
              >
                <Text
                  style={[
                    styles.frequencyButtonText,
                    frequency === freq && styles.frequencyButtonTextActive,
                  ]}
                >
                  {t(freq)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('endDate')}</Text>
          <Pressable 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color={colors.textLight} />
            <Text style={styles.dateButtonText}>
              {endDate ? endDate.toLocaleDateString() : t('selectEndDate')}
            </Text>
          </Pressable>
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
          <Text style={styles.addButtonText}>{t('addRecurringTransaction')}</Text>
        </Pressable>
      </ScrollView>
      
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <SimpleDatePicker
              value={endDate}
              onChange={setEndDate}
              onClose={() => setShowDatePicker(false)}
            />
          </View>
        </View>
      </Modal>
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
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  frequencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  frequencyButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  frequencyButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  frequencyButtonTextActive: {
    color: colors.white,
    fontWeight: '500',
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
    color: colors.textLight,
    marginLeft: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
  },
});