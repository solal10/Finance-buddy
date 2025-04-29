import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinanceStore, useProfile } from '@/store/finance-store';
import { colors } from '@/constants/colors';
import { ChevronRight, X, Plus, CreditCard, Wallet, DollarSign } from 'lucide-react-native';
import { useTranslation, setAppLanguage } from '@/utils/i18n';
import { Language, languageNames } from '@/utils/i18n';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { t, isRTL } = useTranslation();
  const profile = useProfile();
  const updateProfile = useFinanceStore((state) => state.updateProfile);
  const addPaymentMethod = useFinanceStore((state) => state.addPaymentMethod);
  
  const [isEditingFirstName, setIsEditingFirstName] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState(profile.firstName);
  
  const [isEditingLastName, setIsEditingLastName] = useState(false);
  const [lastNameInput, setLastNameInput] = useState(profile.lastName);
  
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    type: 'creditCard',
    name: '',
    cardType: 'visa',
    limit: ''
  });
  
  const handleSaveFirstName = () => {
    if (firstNameInput.trim()) {
      updateProfile({ firstName: firstNameInput.trim() });
    } else {
      setFirstNameInput(profile.firstName);
    }
    setIsEditingFirstName(false);
  };
  
  const handleSaveLastName = () => {
    if (lastNameInput.trim()) {
      updateProfile({ lastName: lastNameInput.trim() });
    } else {
      setLastNameInput(profile.lastName);
    }
    setIsEditingLastName(false);
  };
  
  const handleSelectCurrency = (currencyCode: string) => {
    updateProfile({ currency: currencyCode });
  };
  
  const handleSelectLanguage = (language: Language) => {
    setAppLanguage(language);
  };
  
  const handleAddCard = () => {
    if (!newCard.name.trim() || (newCard.type === 'creditCard' && !newCard.limit)) {
      return;
    }

    const paymentMethod = {
      type: newCard.type as 'creditCard' | 'debitCard' | 'bankAccount' | 'cash',
      name: newCard.name.trim(),
      cardType: newCard.type === 'creditCard' ? newCard.cardType as 'visa' | 'mastercard' : undefined,
      limit: newCard.limit ? parseFloat(newCard.limit) : undefined,
      currentUsage: 0,
    };

    addPaymentMethod(paymentMethod);
    setShowAddCard(false);
    setNewCard({
      type: 'creditCard',
      name: '',
      cardType: 'visa',
      limit: ''
    });
  };
  
  const resetAllData = async () => {
    Alert.alert(
      t('resetAllData'),
      t('resetWarning'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('reset'), 
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear AsyncStorage
              await AsyncStorage.clear();
              
              // Reset the store
              useFinanceStore.getState().resetAllData();
              
              // Navigate to account setup
              router.replace('/account-setup');
              
              Alert.alert(t('dataReset'), t('allDataReset'));
            } catch (error) {
              console.error('Error resetting data:', error);
              Alert.alert(t('error'), t('resetError'));
            }
          }
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('settings')}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile')}</Text>
          
          <View style={styles.card}>
            <Pressable 
              style={styles.settingItem}
              onPress={() => setIsEditingFirstName(true)}
            >
              <Text style={styles.settingLabel}>{t('firstName')}</Text>
              {isEditingFirstName ? (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, isRTL && styles.rtlInput]}
                    value={firstNameInput}
                    onChangeText={setFirstNameInput}
                    autoFocus
                    onSubmitEditing={handleSaveFirstName}
                    onBlur={handleSaveFirstName}
                    textAlign={isRTL ? 'right' : 'left'}
                  />
                </View>
              ) : (
                <View style={styles.settingValueContainer}>
                  <Text style={styles.settingValue}>{profile.firstName}</Text>
                  <ChevronRight size={20} color={colors.textLight} />
                </View>
              )}
            </Pressable>
            
            <View style={styles.settingDivider} />
            
            <Pressable 
              style={styles.settingItem}
              onPress={() => setIsEditingLastName(true)}
            >
              <Text style={styles.settingLabel}>{t('lastName')}</Text>
              {isEditingLastName ? (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, isRTL && styles.rtlInput]}
                    value={lastNameInput}
                    onChangeText={setLastNameInput}
                    autoFocus
                    onSubmitEditing={handleSaveLastName}
                    onBlur={handleSaveLastName}
                    textAlign={isRTL ? 'right' : 'left'}
                  />
                </View>
              ) : (
                <View style={styles.settingValueContainer}>
                  <Text style={styles.settingValue}>{profile.lastName}</Text>
                  <ChevronRight size={20} color={colors.textLight} />
                </View>
              )}
            </Pressable>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('preferences')}</Text>
          
          <View style={styles.card}>
            <Text style={styles.settingLabel}>{t('language')}</Text>
            
            <View style={styles.languageList}>
              {(Object.keys(languageNames) as Language[]).map((lang) => (
                <Pressable
                  key={lang}
                  style={[
                    styles.languageItem,
                    profile.language === lang && styles.languageItemActive,
                  ]}
                  onPress={() => handleSelectLanguage(lang)}
                >
                  <Text
                    style={[
                      styles.languageText,
                      profile.language === lang && styles.languageTextActive,
                    ]}
                  >
                    {languageNames[lang]}
                  </Text>
                </Pressable>
              ))}
            </View>
            
            <View style={styles.settingDivider} />
            
            <Text style={styles.settingLabel}>{t('preferredCurrency')}</Text>
            
            <View style={styles.currencyList}>
              {currencies.map((currency) => (
                <Pressable
                  key={currency.code}
                  style={[
                    styles.currencyItem,
                    profile.currency === currency.code && styles.currencyItemActive,
                  ]}
                  onPress={() => handleSelectCurrency(currency.code)}
                >
                  <Text 
                    style={[
                      styles.currencySymbol,
                      profile.currency === currency.code && styles.currencyTextActive,
                    ]}
                  >
                    {currency.symbol}
                  </Text>
                  <Text
                    style={[
                      styles.currencyText,
                      profile.currency === currency.code && styles.currencyTextActive,
                    ]}
                  >
                    {currency.code}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('cards')}</Text>
            <Pressable 
              style={styles.addCardButton}
              onPress={() => setShowAddCard(!showAddCard)}
            >
              {showAddCard ? (
                <X size={20} color={colors.primary} />
              ) : (
                <Plus size={20} color={colors.primary} />
              )}
            </Pressable>
          </View>
          
          {showAddCard && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t('addCard')}</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('type')}</Text>
                <View style={styles.cardTypeList}>
                  <Pressable
                    style={[
                      styles.cardTypeItem,
                      newCard.type === 'creditCard' && styles.cardTypeItemActive,
                    ]}
                    onPress={() => setNewCard({...newCard, type: 'creditCard'})}
                  >
                    <CreditCard size={16} color={newCard.type === 'creditCard' ? colors.white : colors.text} />
                    <Text
                      style={[
                        styles.cardTypeText,
                        newCard.type === 'creditCard' && styles.cardTypeTextActive,
                      ]}
                    >
                      {t('creditCard')}
                    </Text>
                  </Pressable>
                  
                  <Pressable
                    style={[
                      styles.cardTypeItem,
                      newCard.type === 'debitCard' && styles.cardTypeItemActive,
                    ]}
                    onPress={() => setNewCard({...newCard, type: 'debitCard'})}
                  >
                    <CreditCard size={16} color={newCard.type === 'debitCard' ? colors.white : colors.text} />
                    <Text
                      style={[
                        styles.cardTypeText,
                        newCard.type === 'debitCard' && styles.cardTypeTextActive,
                      ]}
                    >
                      {t('debitCard')}
                    </Text>
                  </Pressable>
                  
                  <Pressable
                    style={[
                      styles.cardTypeItem,
                      newCard.type === 'bankAccount' && styles.cardTypeItemActive,
                    ]}
                    onPress={() => setNewCard({...newCard, type: 'bankAccount'})}
                  >
                    <Wallet size={16} color={newCard.type === 'bankAccount' ? colors.white : colors.text} />
                    <Text
                      style={[
                        styles.cardTypeText,
                        newCard.type === 'bankAccount' && styles.cardTypeTextActive,
                      ]}
                    >
                      {t('bankAccount')}
                    </Text>
                  </Pressable>
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('name')}</Text>
                <TextInput
                  style={[styles.input, isRTL && styles.rtlInput]}
                  value={newCard.name}
                  onChangeText={(text) => setNewCard({...newCard, name: text})}
                  placeholder={t('cardName')}
                  placeholderTextColor={colors.textLight}
                  textAlign={isRTL ? 'right' : 'left'}
                />
              </View>
              
              {newCard.type === 'creditCard' && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('cardType')}</Text>
                    <View style={styles.cardTypeList}>
                      <Pressable
                        style={[
                          styles.cardTypeItem,
                          newCard.cardType === 'visa' && styles.cardTypeItemActive,
                        ]}
                        onPress={() => setNewCard({...newCard, cardType: 'visa'})}
                      >
                        <Text
                          style={[
                            styles.cardTypeText,
                            newCard.cardType === 'visa' && styles.cardTypeTextActive,
                          ]}
                        >
                          {t('visa')}
                        </Text>
                      </Pressable>
                      
                      <Pressable
                        style={[
                          styles.cardTypeItem,
                          newCard.cardType === 'mastercard' && styles.cardTypeItemActive,
                        ]}
                        onPress={() => setNewCard({...newCard, cardType: 'mastercard'})}
                      >
                        <Text
                          style={[
                            styles.cardTypeText,
                            newCard.cardType === 'mastercard' && styles.cardTypeTextActive,
                          ]}
                        >
                          {t('mastercard')}
                        </Text>
                      </Pressable>
                      
                      <Pressable
                        style={[
                          styles.cardTypeItem,
                          newCard.cardType === 'other' && styles.cardTypeItemActive,
                        ]}
                        onPress={() => setNewCard({...newCard, cardType: 'other'})}
                      >
                        <Text
                          style={[
                            styles.cardTypeText,
                            newCard.cardType === 'other' && styles.cardTypeTextActive,
                          ]}
                        >
                          {t('other')}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('cardLimit')}</Text>
                    <TextInput
                      style={[styles.input, isRTL && styles.rtlInput]}
                      value={newCard.limit}
                      onChangeText={(text) => setNewCard({...newCard, limit: text})}
                      placeholder={t('enterAmount')}
                      keyboardType="numeric"
                      placeholderTextColor={colors.textLight}
                      textAlign={isRTL ? 'right' : 'left'}
                    />
                  </View>
                </>
              )}
              
              <Pressable 
                style={[
                  styles.addCardActionButton,
                  (!newCard.name.trim() || (newCard.type === 'creditCard' && !newCard.limit)) && 
                    styles.addCardActionButtonDisabled,
                ]}
                onPress={handleAddCard}
                disabled={!newCard.name.trim() || (newCard.type === 'creditCard' && !newCard.limit)}
              >
                <Text style={styles.addCardActionButtonText}>{t('addCard')}</Text>
              </Pressable>
            </View>
          )}
          
          <View style={styles.card}>
            {profile.paymentMethods.map((method, index) => (
              <View key={index}>
                {index > 0 && <View style={styles.settingDivider} />}
                <View style={styles.cardItem}>
                  {method.type === 'creditCard' || method.type === 'debitCard' ? (
                    <CreditCard size={24} color={colors.primary} />
                  ) : method.type === 'bankAccount' ? (
                    <Wallet size={24} color={colors.primary} />
                  ) : (
                    <DollarSign size={24} color={colors.primary} />
                  )}
                  
                  <View style={styles.cardDetails}>
                    <Text style={styles.cardName}>{method.name}</Text>
                    <Text style={styles.cardType}>
                      {t(method.type as 'creditCard' | 'debitCard' | 'bankAccount' | 'cash')}
                      {method.cardType && ` - ${t(method.cardType as 'visa' | 'mastercard')}`}
                    </Text>
                    
                    {method.limit && (
                      <View style={styles.limitContainer}>
                        <Text style={styles.limitLabel}>{t('cardLimit')}:</Text>
                        <Text style={styles.limitValue}>
                          {profile.currency === 'EUR' ? '€' : '$'}{method.limit.toFixed(2)}
                        </Text>
                      </View>
                    )}
                    
                    {method.currentUsage !== undefined && method.limit && (
                      <View style={styles.limitContainer}>
                        <Text style={styles.limitLabel}>{t('remainingLimit')}:</Text>
                        <Text 
                          style={[
                            styles.limitValue,
                            method.currentUsage / method.limit > 0.8 && styles.limitWarning,
                            method.currentUsage / method.limit > 0.95 && styles.limitDanger,
                          ]}
                        >
                          {profile.currency === 'EUR' ? '€' : '$'}{(method.limit - method.currentUsage).toFixed(2)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('data')}</Text>
          
          <View style={styles.card}>
            <Pressable 
              style={styles.dangerButton}
              onPress={resetAllData}
            >
              <Text style={styles.dangerButtonText}>{t('resetAllData')}</Text>
            </Pressable>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('appVersion')}</Text>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: colors.textLight,
    marginRight: 8,
  },
  inputContainer: {
    flex: 1,
    maxWidth: '60%',
  },
  input: {
    fontSize: 16,
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingVertical: 4,
    textAlign: 'right',
  },
  rtlInput: {
    textAlign: 'right',
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  languageList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  languageItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  languageTextActive: {
    color: colors.white,
  },
  currencyList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currencyItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 4,
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 2,
  },
  currencyTextActive: {
    color: colors.white,
  },
  addCardButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
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
  cardTypeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTypeItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cardTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 4,
  },
  cardTypeTextActive: {
    color: colors.white,
  },
  addCardActionButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addCardActionButtonDisabled: {
    backgroundColor: colors.border,
  },
  addCardActionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardDetails: {
    marginLeft: 12,
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  cardType: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  limitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  limitLabel: {
    fontSize: 14,
    color: colors.text,
    marginRight: 8,
  },
  limitValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  limitWarning: {
    color: colors.warning,
  },
  limitDanger: {
    color: colors.danger,
  },
  dangerButton: {
    backgroundColor: colors.danger,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.textLight,
  },
});