import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useFinanceStore, useExpectedTransactions } from '@/store/finance-store';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/utils/i18n';
import { formatCurrency, formatDate } from '@/utils/format';
import { Calendar, DollarSign, Check, Trash2, Edit2, ArrowLeft } from 'lucide-react-native';

export default function ExpectedTransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, isRTL } = useTranslation();
  
  const expectedTransactions = useExpectedTransactions();
  const transaction = expectedTransactions.find(t => t.id === id);
  
  const updateExpectedTransaction = useFinanceStore(state => state.updateExpectedTransaction);
  const deleteExpectedTransaction = useFinanceStore(state => state.deleteExpectedTransaction);
  const markExpectedTransactionAsPaid = useFinanceStore(state => state.markExpectedTransactionAsPaid);
  
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(transaction?.description || '');
  const [amount, setAmount] = useState(transaction?.amount.toString() || '');
  const [dueDate, setDueDate] = useState(transaction?.dueDate || new Date().toISOString());
  
  if (!transaction) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: t('transactionNotFound') }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t('transactionNotFound')}</Text>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <ArrowLeft size={20} color={colors.white} />
            <Text style={styles.buttonText}>{t('goBack')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  
  const handleSave = () => {
    if (!description.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert(t('error'), t('pleaseEnterValidData'));
      return;
    }
    
    updateExpectedTransaction({
      ...transaction,
      description: description.trim(),
      amount: parseFloat(amount),
      dueDate,
    });
    
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    Alert.alert(
      t('confirmDelete'),
      t('deleteTransactionConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('delete'), 
          style: 'destructive',
          onPress: () => {
            deleteExpectedTransaction(transaction.id);
            router.back();
          }
        },
      ]
    );
  };
  
  const handleMarkAsPaid = () => {
    Alert.alert(
      t('confirmMarkAsPaid'),
      t('markAsPaidConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('markAsPaid'), 
          onPress: () => {
            markExpectedTransactionAsPaid(transaction.id);
            router.back();
          }
        },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: transaction.isPaid ? t('paidTransaction') : t('pendingTransaction'),
          headerStyle: {
            backgroundColor: transaction.isPaid ? colors.success : colors.primary,
          },
          headerTintColor: colors.white,
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[
          styles.card,
          transaction.isPaid ? styles.paidCard : styles.pendingCard
        ]}>
          {isEditing ? (
            <View style={styles.editForm}>
              <Text style={styles.label}>{t('description')}</Text>
              <TextInput
                style={[styles.input, isRTL && styles.rtlInput]}
                value={description}
                onChangeText={setDescription}
                placeholder={t('enterDescription')}
                placeholderTextColor={colors.textLight}
                textAlign={isRTL ? 'right' : 'left'}
              />
              
              <Text style={styles.label}>{t('amount')}</Text>
              <TextInput
                style={[styles.input, isRTL && styles.rtlInput]}
                value={amount}
                onChangeText={setAmount}
                placeholder={t('enterAmount')}
                keyboardType="numeric"
                placeholderTextColor={colors.textLight}
                textAlign={isRTL ? 'right' : 'left'}
              />
              
              <Text style={styles.label}>{t('dueDate')}</Text>
              <TextInput
                style={[styles.input, isRTL && styles.rtlInput]}
                value={formatDate(dueDate)}
                onChangeText={(text) => {
                  // Simple date validation could be added here
                  setDueDate(new Date(text).toISOString());
                }}
                placeholder={t('enterDueDate')}
                placeholderTextColor={colors.textLight}
                textAlign={isRTL ? 'right' : 'left'}
              />
              
              <View style={[styles.buttonRow, isRTL && styles.buttonRowRTL]}>
                <Pressable 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.buttonText}>{t('cancel')}</Text>
                </Pressable>
                
                <Pressable 
                  style={styles.button} 
                  onPress={handleSave}
                >
                  <Text style={styles.buttonText}>{t('save')}</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>{transaction.description}</Text>
                <Text style={[
                  styles.amount,
                  transaction.type === 'expense' ? styles.expense : styles.income
                ]}>
                  {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                </Text>
              </View>
              
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Calendar size={20} color={colors.textLight} />
                  <Text style={styles.detailLabel}>{t('dueDate')}:</Text>
                  <Text style={styles.detailValue}>{formatDate(transaction.dueDate)}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <DollarSign size={20} color={colors.textLight} />
                  <Text style={styles.detailLabel}>{t('category')}:</Text>
                  <Text style={styles.detailValue}>
                    {t(transaction.category as any)}
                    {transaction.subcategory && ` / ${t(transaction.subcategory as any)}`}
                  </Text>
                </View>
                
                {transaction.paymentMethod && (
                  <View style={styles.detailRow}>
                    <DollarSign size={20} color={colors.textLight} />
                    <Text style={styles.detailLabel}>{t('paymentMethod')}:</Text>
                    <Text style={styles.detailValue}>
                      {transaction.paymentMethod.name}
                    </Text>
                  </View>
                )}
                
                <View style={styles.detailRow}>
                  <Check size={20} color={transaction.isPaid ? colors.success : colors.textLight} />
                  <Text style={styles.detailLabel}>{t('status')}:</Text>
                  <Text style={[
                    styles.detailValue,
                    transaction.isPaid ? styles.paidStatus : styles.pendingStatus
                  ]}>
                    {transaction.isPaid ? t('paid') : t('pending')}
                  </Text>
                </View>
              </View>
              
              {!transaction.isPaid && (
                <View style={styles.actionButtons}>
                  <Pressable 
                    style={[styles.actionButton, styles.editButton]} 
                    onPress={() => setIsEditing(true)}
                  >
                    <Edit2 size={20} color={colors.white} />
                    <Text style={styles.actionButtonText}>{t('edit')}</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={[styles.actionButton, styles.markPaidButton]} 
                    onPress={handleMarkAsPaid}
                  >
                    <Check size={20} color={colors.white} />
                    <Text style={styles.actionButtonText}>{t('markAsPaid')}</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={[styles.actionButton, styles.deleteButton]} 
                    onPress={handleDelete}
                  >
                    <Trash2 size={20} color={colors.white} />
                    <Text style={styles.actionButtonText}>{t('delete')}</Text>
                  </Pressable>
                </View>
              )}
              
              {transaction.isPaid && (
                <View style={styles.paidMessage}>
                  <Check size={24} color={colors.success} />
                  <Text style={styles.paidMessageText}>{t('transactionPaid')}</Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pendingCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  paidCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  expense: {
    color: colors.danger,
  },
  income: {
    color: colors.success,
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
    marginRight: 8,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  paidStatus: {
    color: colors.success,
    fontWeight: '600',
  },
  pendingStatus: {
    color: colors.warning,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: 4,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  markPaidButton: {
    backgroundColor: colors.success,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  paidMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successLight,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  paidMessageText: {
    color: colors.success,
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  editForm: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rtlInput: {
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonRowRTL: {
    flexDirection: 'row-reverse',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: colors.textLight,
  },
});