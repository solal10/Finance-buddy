import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Switch, Platform, I18nManager, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useFinanceStore } from '@/store/finance-store';
import { ArrowRight, Plus, Minus, User, Users, DollarSign, Calendar, CreditCard, Wallet, Home, Building, Building2, Briefcase, School, Car, Baby, UserRound, Banknote, CalendarClock } from 'lucide-react-native';
import { useTranslation, setAppLanguage } from '@/utils/i18n';
import { Language, languageNames } from '@/utils/i18n';
import { HouseholdMember, PaymentMethod } from '@/types/finance';

const { height } = Dimensions.get('window');

// Define currency options with proper icon components
const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
];

// Housing types
const housingTypes = [
  { id: 'apartment', name: 'Apartment', icon: Building },
  { id: 'house', name: 'House', icon: Home },
  { id: 'other', name: 'Other', icon: Building2 },
];

// Payment methods
const paymentMethodTypes = [
  { id: 'creditCard', name: 'Credit Card', icon: CreditCard },
  { id: 'debitCard', name: 'Debit Card', icon: CreditCard },
  { id: 'bankAccount', name: 'Bank Account', icon: Wallet },
  { id: 'cash', name: 'Cash', icon: DollarSign },
];

// Card types
const cardTypes = [
  { id: 'visa', name: 'Visa' },
  { id: 'mastercard', name: 'Mastercard' },
  { id: 'other', name: 'Other' },
];

// Expense categories
const expenseCategories = [
  { 
    id: 'household', 
    name: 'Household', 
    icon: Home,
    subcategories: [
      { id: 'water', name: 'Water' },
      { id: 'gas', name: 'Gas' },
      { id: 'electricity', name: 'Electricity' },
      { id: 'taxes', name: 'Taxes' },
      { id: 'rent', name: 'Rent' },
      { id: 'internet', name: 'Internet' },
      { id: 'food', name: 'Food' },
      { id: 'phone', name: 'Phone' },
      { id: 'other', name: 'Other' },
    ]
  },
  { 
    id: 'car', 
    name: 'Car', 
    icon: Car,
    subcategories: [
      { id: 'carGas', name: 'Gas' },
      { id: 'carLoan', name: 'Car Loan' },
      { id: 'insurance', name: 'Insurance' },
      { id: 'other', name: 'Other' },
    ]
  },
  { 
    id: 'children', 
    name: 'Children', 
    icon: Baby,
    subcategories: [
      { id: 'school', name: 'School' },
      { id: 'sports', name: 'Sports' },
      { id: 'lessons', name: 'Private Lessons' },
      { id: 'pocketMoney', name: 'Pocket Money' },
      { id: 'other', name: 'Other' },
    ]
  },
  { 
    id: 'work', 
    name: 'Work', 
    icon: Briefcase,
    subcategories: [
      { id: 'commute', name: 'Commute' },
      { id: 'meals', name: 'Meals' },
      { id: 'equipment', name: 'Equipment' },
      { id: 'other', name: 'Other' },
    ]
  },
  { 
    id: 'education', 
    name: 'Education', 
    icon: School,
    subcategories: [
      { id: 'tuition', name: 'Tuition' },
      { id: 'books', name: 'Books' },
      { id: 'courses', name: 'Courses' },
      { id: 'other', name: 'Other' },
    ]
  },
];

// Maximum number of adults allowed
const MAX_ADULTS = 2;

export default function AccountSetupScreen() {
  const router = useRouter();
  const { t, language, setLanguage, isRTL } = useTranslation();
  const updateProfile = useFinanceStore((state) => state.updateProfile);
  const addHouseholdMember = useFinanceStore((state) => state.addHouseholdMember);
  const addPaymentMethod = useFinanceStore((state) => state.addPaymentMethod);
  const addExpectedTransaction = useFinanceStore((state) => state.addExpectedTransaction);
  
  // Setup steps
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;
  
  // Step 1: Language and Personal Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [currency, setCurrency] = useState('USD');
  
  // Step 2: Household Members
  const [adultCount, setAdultCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [adults, setAdults] = useState<Array<{name: string, salary: string, salaryDate: string, commissions: string}>>([
    { name: '', salary: '', salaryDate: '', commissions: '0' }
  ]);
  
  // Step 3: Housing and Regular Expenses
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [housingType, setHousingType] = useState<'apartment' | 'house' | 'other'>('apartment');
  const [rentAmount, setRentAmount] = useState('');
  
  // Regular expenses
  const [hasInternet, setHasInternet] = useState(true);
  const [internetAmount, setInternetAmount] = useState('');
  const [hasUtilities, setHasUtilities] = useState(true);
  const [utilitiesAmount, setUtilitiesAmount] = useState('');
  const [hasTransportation, setHasTransportation] = useState(true);
  const [transportationAmount, setTransportationAmount] = useState('');
  const [hasGroceries, setHasGroceries] = useState(true);
  const [groceriesAmount, setGroceriesAmount] = useState('');
  
  // Step 4: Payment Methods
  const [paymentMethods, setPaymentMethods] = useState<Array<{
    type: string, 
    name: string, 
    cardType?: string, 
    limit?: string
  }>>([
    { type: 'cash', name: 'Cash' }
  ]);
  
  // Step 5: Additional Expenses
  const [selectedCategories, setSelectedCategories] = useState<{
    [key: string]: {
      selected: boolean;
      amount: string;
      subcategories: {
        [key: string]: boolean;
      };
    };
  }>({});
  
  // Initialize selected categories
  useEffect(() => {
    const initialCategories: any = {};
    expenseCategories.forEach(category => {
      initialCategories[category.id] = {
        selected: category.id === 'household',
        amount: category.id === 'household' ? '500' : '',
        subcategories: {}
      };
      
      category.subcategories.forEach(subcategory => {
        initialCategories[category.id].subcategories[subcategory.id] = 
          subcategory.id === 'rent' || 
          subcategory.id === 'internet' || 
          subcategory.id === 'food';
      });
    });
    
    setSelectedCategories(initialCategories);
  }, []);
  
  // Suggest rent amount based on housing type
  useEffect(() => {
    if (housingType === 'apartment') {
      setRentAmount('800');
    } else if (housingType === 'house') {
      setRentAmount('1200');
    } else {
      setRentAmount('');
    }
  }, [housingType]);
  
  // Suggest other amounts based on selections
  useEffect(() => {
    if (hasInternet) {
      setInternetAmount('50');
    } else {
      setInternetAmount('');
    }
    
    if (hasUtilities) {
      setUtilitiesAmount('120');
    } else {
      setUtilitiesAmount('');
    }
    
    if (hasTransportation) {
      setTransportationAmount('150');
    } else {
      setTransportationAmount('');
    }
    
    if (hasGroceries) {
      setGroceriesAmount('400');
    } else {
      setGroceriesAmount('');
    }
  }, [hasInternet, hasUtilities, hasTransportation, hasGroceries]);
  
  // Handle language change
  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
  };
  
  // Update adult count
  const handleAdultCountChange = (count: number) => {
    if (count < 1) return;
    // Limit to maximum number of adults
    if (count > MAX_ADULTS) return;
    
    setAdultCount(count);
    
    if (count > adults.length) {
      // Add more adults
      const newAdults = [...adults];
      for (let i = adults.length; i < count; i++) {
        newAdults.push({ name: '', salary: '', salaryDate: '', commissions: '0' });
      }
      setAdults(newAdults);
    } else if (count < adults.length) {
      // Remove adults
      setAdults(adults.slice(0, count));
    }
  };
  
  // Update adult information
  const handleAdultChange = (index: number, field: string, value: string) => {
    const newAdults = [...adults];
    newAdults[index] = { ...newAdults[index], [field]: value };
    setAdults(newAdults);
  };
  
  // Add payment method
  const handleAddPaymentMethod = () => {
    setPaymentMethods([...paymentMethods, { type: 'creditCard', name: '', cardType: 'visa', limit: '' }]);
  };
  
  // Update payment method
  const handlePaymentMethodChange = (index: number, field: string, value: string) => {
    const newPaymentMethods = [...paymentMethods];
    newPaymentMethods[index] = { ...newPaymentMethods[index], [field]: value };
    setPaymentMethods(newPaymentMethods);
  };
  
  // Remove payment method
  const handleRemovePaymentMethod = (index: number) => {
    if (paymentMethods.length <= 1) return;
    const newPaymentMethods = [...paymentMethods];
    newPaymentMethods.splice(index, 1);
    setPaymentMethods(newPaymentMethods);
  };
  
  // Toggle category selection
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        selected: !prev[categoryId].selected
      }
    }));
  };
  
  // Update category amount
  const handleCategoryAmountChange = (categoryId: string, amount: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        amount
      }
    }));
  };
  
  // Toggle subcategory selection
  const handleSubcategoryToggle = (categoryId: string, subcategoryId: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        subcategories: {
          ...prev[categoryId].subcategories,
          [subcategoryId]: !prev[categoryId].subcategories[subcategoryId]
        }
      }
    }));
  };
  
  // Check if current step is valid
  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Language and Personal Info
        return firstName.trim() && lastName.trim();
      case 1: // Household Members
        return adults.every(adult => adult.name.trim());
      case 2: // Housing and Regular Expenses
        return monthlyBudget.trim() && !isNaN(parseFloat(monthlyBudget)) && 
               rentAmount.trim() && !isNaN(parseFloat(rentAmount));
      case 3: // Payment Methods
        return paymentMethods.every(method => 
          method.type === 'cash' || 
          (method.name.trim() && (method.type !== 'creditCard' || (method.limit && !isNaN(parseFloat(method.limit)))))
        );
      case 4: // Additional Expenses
        return true; // All fields are optional in this step
      default:
        return false;
    }
  };
  
  // Navigate to next step
  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  // Navigate to previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Complete setup and save all data
  const handleComplete = () => {
    // Update profile
    updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      currency,
      language: selectedLanguage,
      monthlyBudget: parseFloat(monthlyBudget),
      housingType,
      householdMembers: [],
      paymentMethods: [],
    });
    
    // Add household members
    adults.forEach((adult, index) => {
      if (adult.name.trim()) {
        addHouseholdMember({
          name: adult.name.trim(),
          type: 'adult',
          salary: adult.salary ? parseFloat(adult.salary) : undefined,
          salaryDate: adult.salaryDate ? new Date(adult.salaryDate).toISOString() : undefined,
          commissions: adult.commissions ? parseFloat(adult.commissions) : undefined,
        });
        
        // Add salary as expected income
        if (adult.salary) {
          const salaryDate = adult.salaryDate ? new Date(adult.salaryDate) : new Date(new Date().setDate(25));
          const salaryTransaction = {
            amount: parseFloat(adult.salary),
            description: `${adult.name} ${t('salary')}`,
            category: 'income',
            dueDate: salaryDate.toISOString(),
            type: 'income' as const,
            isPaid: false,
          };
          addExpectedTransaction(salaryTransaction);
        }
      }
    });
    
    // Add children
    for (let i = 0; i < childrenCount; i++) {
      addHouseholdMember({
        name: `Child ${i + 1}`,
        type: 'child',
      });
    }
    
    // Add payment methods
    paymentMethods.forEach(method => {
      if (method.name.trim() || method.type === 'cash') {
        const paymentMethod: Omit<PaymentMethod, 'id'> = {
          type: method.type as any,
          name: method.name.trim() || method.type,
        };
        
        if (method.type === 'creditCard' || method.type === 'debitCard') {
          paymentMethod.cardType = method.cardType as any;
          paymentMethod.limit = method.limit ? parseFloat(method.limit) : undefined;
          paymentMethod.currentUsage = 0;
        }
        
        addPaymentMethod(paymentMethod);
      }
    });
    
    // Add initial expected transactions
    if (rentAmount) {
      const rentTransaction = {
        amount: parseFloat(rentAmount),
        description: t('rent'),
        category: 'household',
        subcategory: 'rent',
        dueDate: new Date(new Date().setDate(1)).toISOString(), // First day of current month
        type: 'expense' as const,
        isPaid: false,
        paymentMethod: paymentMethods[0].type !== 'cash' ? {
          id: '0', // This will be replaced with the actual ID
          type: paymentMethods[0].type as any,
          name: paymentMethods[0].name,
        } : undefined,
      };
      addExpectedTransaction(rentTransaction);
    }
    
    // Add internet expense
    if (internetAmount) {
      const internetTransaction = {
        amount: parseFloat(internetAmount),
        description: t('internet'),
        category: 'household',
        subcategory: 'internet',
        dueDate: new Date(new Date().setDate(15)).toISOString(), // 15th of current month
        type: 'expense' as const,
        isPaid: false,
      };
      addExpectedTransaction(internetTransaction);
    }
    
    // Add utilities expense
    if (utilitiesAmount) {
      const utilitiesTransaction = {
        amount: parseFloat(utilitiesAmount),
        description: t('utilities'),
        category: 'household',
        subcategory: 'utilities',
        dueDate: new Date(new Date().setDate(10)).toISOString(), // 10th of current month
        type: 'expense' as const,
        isPaid: false,
      };
      addExpectedTransaction(utilitiesTransaction);
    }
    
    // Add transportation expense
    if (transportationAmount) {
      const transportationTransaction = {
        amount: parseFloat(transportationAmount),
        description: t('transportation'),
        category: 'car',
        subcategory: 'carGas',
        dueDate: new Date(new Date().setDate(5)).toISOString(), // 5th of current month
        type: 'expense' as const,
        isPaid: false,
      };
      addExpectedTransaction(transportationTransaction);
    }
    
    // Add groceries expense
    if (groceriesAmount) {
      const groceriesTransaction = {
        amount: parseFloat(groceriesAmount),
        description: t('groceries'),
        category: 'household',
        subcategory: 'food',
        dueDate: new Date(new Date().setDate(7)).toISOString(), // 7th of current month
        type: 'expense' as const,
        isPaid: false,
      };
      addExpectedTransaction(groceriesTransaction);
    }
    
    // Add additional category expenses
    Object.entries(selectedCategories).forEach(([categoryId, categoryData]) => {
      if (categoryData.selected && categoryData.amount) {
        // Find selected subcategories
        const selectedSubcategories = Object.entries(categoryData.subcategories)
          .filter(([_, isSelected]) => isSelected)
          .map(([subcategoryId]) => subcategoryId);
        
        if (selectedSubcategories.length > 0) {
          // Distribute the amount among selected subcategories
          const amountPerSubcategory = parseFloat(categoryData.amount) / selectedSubcategories.length;
          
          selectedSubcategories.forEach((subcategoryId, index) => {
            const category = expenseCategories.find(c => c.id === categoryId);
            const subcategory = category?.subcategories.find(s => s.id === subcategoryId);
            
            if (category && subcategory) {
              const transaction = {
                amount: amountPerSubcategory,
                description: `${t(category.id as any)} - ${t(subcategory.id as any)}`,
                category: categoryId,
                subcategory: subcategoryId,
                dueDate: new Date(new Date().setDate(12 + index)).toISOString(), // Distribute due dates
                type: 'expense' as const,
                isPaid: false,
              };
              
              addExpectedTransaction(transaction);
            }
          });
        }
      }
    });
    
    // Add school expenses if has children
    if (childrenCount > 0) {
      const schoolExpense = {
        amount: childrenCount * 100, // $100 per child
        description: t('schoolExpenses'),
        category: 'children',
        subcategory: 'school',
        dueDate: new Date(new Date().setDate(3)).toISOString(), // 3rd of current month
        type: 'expense' as const,
        isPaid: false,
      };
      addExpectedTransaction(schoolExpense);
    }
    
    router.replace('/(tabs)');
  };
  
  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderLanguageAndPersonalInfo();
      case 1:
        return renderHouseholdMembers();
      case 2:
        return renderHousingAndExpenses();
      case 3:
        return renderPaymentMethods();
      case 4:
        return renderAdditionalExpenses();
      default:
        return null;
    }
  };
  
  // Step 1: Language and Personal Info
  const renderLanguageAndPersonalInfo = () => {
    return (
      <View style={styles.stepContent}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>{t('languageAndPersonalInfo')}</Text>
          <Text style={styles.stepDescription}>{t('chooseLanguageAndEnterInfo')}</Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('language')}</Text>
          <View style={styles.languageList}>
            {(Object.keys(languageNames) as Language[]).map((lang) => (
              <Pressable
                key={lang}
                style={[
                  styles.languageItem,
                  selectedLanguage === lang && styles.languageItemActive,
                ]}
                onPress={() => handleLanguageChange(lang)}
              >
                <Text
                  style={[
                    styles.languageText,
                    selectedLanguage === lang && styles.languageTextActive,
                  ]}
                >
                  {languageNames[lang]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('firstName')}</Text>
          <TextInput
            style={[styles.input, isRTL && styles.rtlInput]}
            value={firstName}
            onChangeText={setFirstName}
            placeholder={t('enterYourName')}
            placeholderTextColor={colors.textLight}
            textAlign={isRTL ? 'right' : 'left'}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('lastName')}</Text>
          <TextInput
            style={[styles.input, isRTL && styles.rtlInput]}
            value={lastName}
            onChangeText={setLastName}
            placeholder={t('enterYourName')}
            placeholderTextColor={colors.textLight}
            textAlign={isRTL ? 'right' : 'left'}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('preferredCurrency')}</Text>
          <View style={styles.currencyList}>
            {currencies.map((curr) => (
              <Pressable
                key={curr.code}
                style={[
                  styles.currencyItem,
                  currency === curr.code && styles.currencyItemActive,
                ]}
                onPress={() => setCurrency(curr.code)}
              >
                <Text style={styles.currencySymbol}>
                  {curr.symbol}
                </Text>
                <Text
                  style={[
                    styles.currencyText,
                    currency === curr.code && styles.currencyTextActive,
                  ]}
                >
                  {curr.code}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    );
  };
  
  // Step 2: Household Members
  const renderHouseholdMembers = () => {
    return (
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.stepContent}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepTitle}>{t('householdMembers')}</Text>
            <Text style={styles.stepDescription}>{t('addHouseholdMembersDesc')}</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.counterContainer}>
              <Text style={styles.label}>{t('adults')}</Text>
              <View style={styles.counter}>
                <Pressable 
                  style={styles.counterButton}
                  onPress={() => handleAdultCountChange(adultCount - 1)}
                  disabled={adultCount <= 1}
                >
                  <Minus size={16} color={adultCount <= 1 ? colors.textLight : colors.text} />
                </Pressable>
                <Text style={styles.counterText}>{adultCount}</Text>
                <Pressable 
                  style={styles.counterButton}
                  onPress={() => handleAdultCountChange(adultCount + 1)}
                  disabled={adultCount >= MAX_ADULTS}
                >
                  <Plus size={16} color={adultCount >= MAX_ADULTS ? colors.textLight : colors.text} />
                </Pressable>
              </View>
            </View>
            
            {adults.map((adult, index) => (
              <View key={index} style={styles.memberCard}>
                <View style={styles.memberCardHeader}>
                  <View style={styles.memberIconContainer}>
                    <UserRound size={24} color={colors.white} />
                  </View>
                  <Text style={styles.memberCardTitle}>{t('adult')} {index + 1}</Text>
                </View>
                
                <View style={styles.memberCardContent}>
                  <View style={styles.memberField}>
                    <View style={styles.memberFieldIcon}>
                      <User size={18} color={colors.primary} />
                    </View>
                    <TextInput
                      style={[styles.memberInput, isRTL && styles.rtlInput]}
                      value={adult.name}
                      onChangeText={(value) => handleAdultChange(index, 'name', value)}
                      placeholder={t('adultName')}
                      placeholderTextColor={colors.textLight}
                      textAlign={isRTL ? 'right' : 'left'}
                    />
                  </View>
                  
                  <View style={styles.memberField}>
                    <View style={styles.memberFieldIcon}>
                      <Banknote size={18} color={colors.primary} />
                    </View>
                    <TextInput
                      style={[styles.memberInput, isRTL && styles.rtlInput]}
                      value={adult.salary}
                      onChangeText={(value) => handleAdultChange(index, 'salary', value)}
                      placeholder={t('adultSalary')}
                      keyboardType="numeric"
                      placeholderTextColor={colors.textLight}
                      textAlign={isRTL ? 'right' : 'left'}
                    />
                  </View>
                  
                  <View style={styles.memberField}>
                    <View style={styles.memberFieldIcon}>
                      <CalendarClock size={18} color={colors.primary} />
                    </View>
                    <TextInput
                      style={[styles.memberInput, isRTL && styles.rtlInput]}
                      value={adult.salaryDate}
                      onChangeText={(value) => handleAdultChange(index, 'salaryDate', value)}
                      placeholder={t('salaryDate')}
                      placeholderTextColor={colors.textLight}
                      textAlign={isRTL ? 'right' : 'left'}
                    />
                  </View>
                  
                  <View style={styles.memberField}>
                    <View style={styles.memberFieldIcon}>
                      <DollarSign size={18} color={colors.primary} />
                    </View>
                    <TextInput
                      style={[styles.memberInput, isRTL && styles.rtlInput]}
                      value={adult.commissions}
                      onChangeText={(value) => handleAdultChange(index, 'commissions', value)}
                      placeholder={t('commissions')}
                      keyboardType="numeric"
                      placeholderTextColor={colors.textLight}
                      textAlign={isRTL ? 'right' : 'left'}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.counterContainer}>
              <Text style={styles.label}>{t('children')}</Text>
              <View style={styles.counter}>
                <Pressable 
                  style={styles.counterButton}
                  onPress={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                  disabled={childrenCount <= 0}
                >
                  <Minus size={16} color={childrenCount <= 0 ? colors.textLight : colors.text} />
                </Pressable>
                <Text style={styles.counterText}>{childrenCount}</Text>
                <Pressable 
                  style={styles.counterButton}
                  onPress={() => setChildrenCount(childrenCount + 1)}
                >
                  <Plus size={16} color={colors.text} />
                </Pressable>
              </View>
            </View>
            
            {childrenCount > 0 && (
              <View style={styles.childrenSummary}>
                <Baby size={20} color={colors.primary} />
                <Text style={styles.childrenSummaryText}>
                  {childrenCount} {childrenCount === 1 ? t('child') : t('children')}
                </Text>
              </View>
            )}
          </View>
          
          {/* Add some padding at the bottom for scrolling */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    );
  };
  
  // Step 3: Housing and Regular Expenses
  const renderHousingAndExpenses = () => {
    return (
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.stepContent}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepTitle}>{t('housingAndExpenses')}</Text>
            <Text style={styles.stepDescription}>{t('setupHousingAndExpenses')}</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('monthlyBudget')}</Text>
            <TextInput
              style={[styles.input, isRTL && styles.rtlInput]}
              value={monthlyBudget}
              onChangeText={setMonthlyBudget}
              placeholder={t('enterMonthlyBudget')}
              keyboardType="numeric"
              placeholderTextColor={colors.textLight}
              textAlign={isRTL ? 'right' : 'left'}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('housingType')}</Text>
            <View style={styles.housingTypeList}>
              {housingTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Pressable
                    key={type.id}
                    style={[
                      styles.housingTypeItem,
                      housingType === type.id && styles.housingTypeItemActive,
                    ]}
                    onPress={() => setHousingType(type.id as any)}
                  >
                    <Icon 
                      size={20} 
                      color={housingType === type.id ? colors.white : colors.text} 
                      style={styles.housingTypeIcon}
                    />
                    <Text
                      style={[
                        styles.housingTypeText,
                        housingType === type.id && styles.housingTypeTextActive,
                      ]}
                    >
                      {t(type.id as any)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('rent')}</Text>
            <View style={styles.inputWithSuggestion}>
              <TextInput
                style={[styles.input, isRTL && styles.rtlInput]}
                value={rentAmount}
                onChangeText={setRentAmount}
                placeholder={t('enterAmount')}
                keyboardType="numeric"
                placeholderTextColor={colors.textLight}
                textAlign={isRTL ? 'right' : 'left'}
              />
              {housingType === 'apartment' && (
                <Text style={styles.suggestion}>
                  {t('suggestion')}: {currency === 'EUR' ? '€' : currency === 'ILS' ? '₪' : '$'}600-900
                </Text>
              )}
              {housingType === 'house' && (
                <Text style={styles.suggestion}>
                  {t('suggestion')}: {currency === 'EUR' ? '€' : currency === 'ILS' ? '₪' : '$'}1000-1500
                </Text>
              )}
            </View>
          </View>
          
          <View style={styles.compactInputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>{t('internet')}</Text>
              <Switch
                value={hasInternet}
                onValueChange={setHasInternet}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
              />
            </View>
            {hasInternet && (
              <TextInput
                style={[styles.compactInput, isRTL && styles.rtlInput]}
                value={internetAmount}
                onChangeText={setInternetAmount}
                placeholder={t('enterAmount')}
                keyboardType="numeric"
                placeholderTextColor={colors.textLight}
                textAlign={isRTL ? 'right' : 'left'}
              />
            )}
          </View>
          
          <View style={styles.compactInputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>{t('utilities')}</Text>
              <Switch
                value={hasUtilities}
                onValueChange={setHasUtilities}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
              />
            </View>
            {hasUtilities && (
              <TextInput
                style={[styles.compactInput, isRTL && styles.rtlInput]}
                value={utilitiesAmount}
                onChangeText={setUtilitiesAmount}
                placeholder={t('enterAmount')}
                keyboardType="numeric"
                placeholderTextColor={colors.textLight}
                textAlign={isRTL ? 'right' : 'left'}
              />
            )}
          </View>
          
          <View style={styles.compactInputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>{t('transportation')}</Text>
              <Switch
                value={hasTransportation}
                onValueChange={setHasTransportation}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
              />
            </View>
            {hasTransportation && (
              <TextInput
                style={[styles.compactInput, isRTL && styles.rtlInput]}
                value={transportationAmount}
                onChangeText={setTransportationAmount}
                placeholder={t('enterAmount')}
                keyboardType="numeric"
                placeholderTextColor={colors.textLight}
                textAlign={isRTL ? 'right' : 'left'}
              />
            )}
          </View>
          
          <View style={styles.compactInputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>{t('groceries')}</Text>
              <Switch
                value={hasGroceries}
                onValueChange={setHasGroceries}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
              />
            </View>
            {hasGroceries && (
              <TextInput
                style={[styles.compactInput, isRTL && styles.rtlInput]}
                value={groceriesAmount}
                onChangeText={setGroceriesAmount}
                placeholder={t('enterAmount')}
                keyboardType="numeric"
                placeholderTextColor={colors.textLight}
                textAlign={isRTL ? 'right' : 'left'}
              />
            )}
          </View>
          
          {/* Add some padding at the bottom for scrolling */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    );
  };
  
  // Step 4: Payment Methods
  const renderPaymentMethods = () => {
    return (
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.stepContent}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepTitle}>{t('paymentMethods')}</Text>
            <Text style={styles.stepDescription}>{t('setupPaymentMethodsDesc')}</Text>
          </View>
          
          {paymentMethods.map((method, index) => (
            <View key={index} style={styles.paymentMethodContainer}>
              <View style={styles.paymentMethodHeader}>
                <Text style={styles.paymentMethodTitle}>{t('paymentMethod')} {index + 1}</Text>
                {index > 0 && (
                  <Pressable 
                    style={styles.removeButton}
                    onPress={() => handleRemovePaymentMethod(index)}
                  >
                    <Minus size={16} color={colors.danger} />
                  </Pressable>
                )}
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('type')}</Text>
                <View style={styles.methodTypeList}>
                  {paymentMethodTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Pressable
                        key={type.id}
                        style={[
                          styles.methodTypeItem,
                          method.type === type.id && styles.methodTypeItemActive,
                        ]}
                        onPress={() => handlePaymentMethodChange(index, 'type', type.id)}
                      >
                        <Icon 
                          size={16} 
                          color={method.type === type.id ? colors.white : colors.text} 
                        />
                        <Text
                          style={[
                            styles.methodTypeText,
                            method.type === type.id && styles.methodTypeTextActive,
                          ]}
                        >
                          {t(type.id as any)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
              
              {method.type !== 'cash' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t('name')}</Text>
                  <TextInput
                    style={[styles.input, isRTL && styles.rtlInput]}
                    value={method.name}
                    onChangeText={(value) => handlePaymentMethodChange(index, 'name', value)}
                    placeholder={t('cardName')}
                    placeholderTextColor={colors.textLight}
                    textAlign={isRTL ? 'right' : 'left'}
                  />
                </View>
              )}
              
              {(method.type === 'creditCard' || method.type === 'debitCard') && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('cardType')}</Text>
                    <View style={styles.methodTypeList}>
                      {cardTypes.map((type) => (
                        <Pressable
                          key={type.id}
                          style={[
                            styles.methodTypeItem,
                            method.cardType === type.id && styles.methodTypeItemActive,
                          ]}
                          onPress={() => handlePaymentMethodChange(index, 'cardType', type.id)}
                        >
                          <Text
                            style={[
                              styles.methodTypeText,
                              method.cardType === type.id && styles.methodTypeTextActive,
                            ]}
                          >
                            {t(type.id as any)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('cardLimit')}</Text>
                    <TextInput
                      style={[styles.input, isRTL && styles.rtlInput]}
                      value={method.limit}
                      onChangeText={(value) => handlePaymentMethodChange(index, 'limit', value)}
                      placeholder={t('enterAmount')}
                      keyboardType="numeric"
                      placeholderTextColor={colors.textLight}
                      textAlign={isRTL ? 'right' : 'left'}
                    />
                  </View>
                </>
              )}
            </View>
          ))}
          
          <Pressable 
            style={styles.addButton}
            onPress={handleAddPaymentMethod}
          >
            <Plus size={16} color={colors.white} />
            <Text style={styles.addButtonText}>{t('addCard')}</Text>
          </Pressable>
          
          {/* Add some padding at the bottom for scrolling */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    );
  };
  
  // Step 5: Additional Expenses
  const renderAdditionalExpenses = () => {
    return (
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.stepContent}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepTitle}>{t('additionalExpenses')}</Text>
            <Text style={styles.stepDescription}>{t('setupAdditionalExpensesDesc')}</Text>
          </View>
          
          {expenseCategories.slice(0, 3).map((category) => {
            const categoryData = selectedCategories[category.id] || { selected: false, amount: '', subcategories: {} };
            const Icon = category.icon;
            
            return (
              <View key={category.id} style={styles.categoryContainer}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryTitleContainer}>
                    <Icon size={20} color={colors.primary} />
                    <Text style={styles.categoryTitle}>{t(category.id as any)}</Text>
                  </View>
                  <Switch
                    value={categoryData.selected}
                    onValueChange={() => handleCategoryToggle(category.id)}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
                  />
                </View>
                
                {categoryData.selected && (
                  <>
                    <View style={styles.compactInputGroup}>
                      <Text style={styles.compactLabel}>{t('monthlyAmount')}</Text>
                      <TextInput
                        style={[styles.compactInput, isRTL && styles.rtlInput]}
                        value={categoryData.amount}
                        onChangeText={(value) => handleCategoryAmountChange(category.id, value)}
                        placeholder={t('enterAmount')}
                        keyboardType="numeric"
                        placeholderTextColor={colors.textLight}
                        textAlign={isRTL ? 'right' : 'left'}
                      />
                    </View>
                    
                    <Text style={styles.compactLabel}>{t('subcategories')}</Text>
                    <View style={styles.subcategoriesList}>
                      {category.subcategories.slice(0, 4).map((subcategory) => (
                        <Pressable
                          key={subcategory.id}
                          style={[
                            styles.subcategoryItem,
                            categoryData.subcategories[subcategory.id] && styles.subcategoryItemActive,
                          ]}
                          onPress={() => handleSubcategoryToggle(category.id, subcategory.id)}
                        >
                          <Text
                            style={[
                              styles.subcategoryText,
                              categoryData.subcategories[subcategory.id] && styles.subcategoryTextActive,
                            ]}
                          >
                            {t(subcategory.id as any)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </>
                )}
              </View>
            );
          })}
          
          {/* Add some padding at the bottom for scrolling */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'Account Setup',
          headerShown: false,
        }} 
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('welcome')}</Text>
          <Text style={styles.subtitle}>{t('setupAccount')}</Text>
        </View>
        
        <View style={styles.form}>
          {renderStepContent()}
        </View>
        
        <View style={styles.footer}>
          {/* Progress bar at bottom of screen */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentStep + 1) / totalSteps) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {t('step')} {currentStep + 1} {t('of')} {totalSteps}
            </Text>
          </View>
          
          <View style={[
            styles.navigationButtons,
            isRTL && styles.navigationButtonsRTL
          ]}>
            {currentStep > 0 && (
              <Pressable 
                style={styles.backButton}
                onPress={handlePrevStep}
              >
                <Text style={styles.backButtonText}>{t('back')}</Text>
              </Pressable>
            )}
            
            <Pressable 
              style={[
                styles.button,
                !isStepValid() && styles.buttonDisabled,
              ]}
              onPress={handleNextStep}
              disabled={!isStepValid()}
            >
              <Text style={styles.buttonText}>
                {currentStep < totalSteps - 1 ? t('next') : t('getStarted')}
              </Text>
              <ArrowRight size={20} color={colors.white} />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textLight,
  },
  form: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  footer: {
    marginTop: 'auto',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'right',
  },
  inputGroup: {
    marginBottom: 16,
  },
  compactInputGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  compactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
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
  compactInput: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rtlInput: {
    textAlign: 'right',
  },
  languageList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
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
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
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
    marginRight: 6,
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 6,
  },
  currencyTextActive: {
    color: colors.white,
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  counterButton: {
    padding: 8,
    backgroundColor: colors.card,
  },
  counterText: {
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  // New member card styles
  memberCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  memberCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  memberIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  memberCardContent: {
    padding: 16,
  },
  memberField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberFieldIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 4,
  },
  childrenSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  childrenSummaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
  },
  paymentMethodContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentMethodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  removeButton: {
    padding: 4,
    backgroundColor: colors.card,
    borderRadius: 4,
  },
  methodTypeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  methodTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  methodTypeItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  methodTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 6,
  },
  methodTypeTextActive: {
    color: colors.white,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 16,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  housingTypeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  housingTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  housingTypeItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  housingTypeIcon: {
    marginRight: 6,
  },
  housingTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  housingTypeTextActive: {
    color: colors.white,
  },
  inputWithSuggestion: {
    position: 'relative',
  },
  suggestion: {
    position: 'absolute',
    right: 16,
    top: 12,
    fontSize: 12,
    color: colors.textLight,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  subcategoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  subcategoryItem: {
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subcategoryItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  subcategoryText: {
    fontSize: 12,
    color: colors.text,
  },
  subcategoryTextActive: {
    color: colors.white,
  },
  navigationButtons: {
    flexDirection: 'row',
  },
  navigationButtonsRTL: {
    flexDirection: 'row-reverse',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  buttonDisabled: {
    backgroundColor: colors.border,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  backButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    paddingHorizontal: 16,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});