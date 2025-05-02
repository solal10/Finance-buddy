import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  Switch, 
  Platform, 
  I18nManager, 
  Dimensions, 
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useFinanceStore } from '@/store/finance-store';
import { 
  ArrowRight, 
  Plus, 
  Minus, 
  User, 
  Users, 
  DollarSign, 
  Calendar, 
  CreditCard, 
  Wallet, 
  Home, 
  Building, 
  Building2, 
  Briefcase, 
  School, 
  Car, 
  Baby, 
  UserRound, 
  Banknote, 
  CalendarClock,
  Globe,
  Landmark,
  ShieldCheck,
  Utensils,
  Droplet,
  Flame,
  Zap,
  Receipt,
  Wifi,
  Phone,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  ChevronRight
} from 'lucide-react-native';
import { useTranslation } from '@/utils/i18n';
import { languageNames, Language } from '@/translations';
import { HouseholdMember, PaymentMethod, BankAccount, InsuranceType } from '@/types/finance';
import { styles } from './styles/account-setup-styles';
import { Picker } from '@react-native-picker/picker';

const { height, width } = Dimensions.get('window');

// Define currency options with proper icon components
const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
];

// Define country options
const countries = [
  { code: 'US', name: 'United States' },
  { code: 'FR', name: 'France' },
  { code: 'IL', name: 'Israel' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
];

// Payment methods
const paymentMethodTypes = [
  { id: 'creditCard', name: 'Credit Card', icon: CreditCard },
  { id: 'debitCard', name: 'Debit Card', icon: CreditCard },
  { id: 'bankAccountType', name: 'Bank Account', icon: Wallet },
  { id: 'cash', name: 'Cash', icon: DollarSign },
];

// Card types
const cardTypes = [
  { id: 'visa', name: 'Visa' },
  { id: 'mastercard', name: 'Mastercard' },
  { id: 'other', name: 'Other' },
];

// Insurance types
const insuranceTypes = [
  { id: 'vehicle', name: 'Vehicle', icon: Car },
  { id: 'home', name: 'Home', icon: Home },
  { id: 'health', name: 'Health', icon: ShieldCheck },
  { id: 'other', name: 'Other', icon: ShieldCheck },
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
    id: 'childrenCategory', 
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

// Date format helper
const formatDate = (date: string) => {
  if (!date) return '';
  
  // Try to parse the date
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    // If not a valid date, return as is
    return date;
  }
  
  // Format as DD/MM/YYYY
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}/${month}/${year}`;
};

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

// Define the type for monthly expense items
type MonthlyExpenseItem = {
  enabled: boolean;
  amount: string;
  description?: string;
};

interface Loan {
  id: string;
  name: string;
  amount: string;
}

interface AdditionalExpense {
  id: string;
  name: string;
  amount: string;
  paymentMethod: string;
}

export default function AccountSetupScreen() {
  const router = useRouter();
  const { t, isRTL } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;
  const scrollViewRef = useRef<ScrollView>(null);

  // Personal Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [currency, setCurrency] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [childrenCount, setChildrenCount] = useState(0);

  // Modal visibility states
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  // Options for pickers
  const countryOptions = [
    { value: 'US', label: 'United States' },
    { value: 'FR', label: 'France' },
    { value: 'IL', label: 'Israel' },
    { value: 'GB', label: 'United Kingdom' },
  ];

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'ILS', label: 'Israeli Shekel (₪)' },
    { value: 'GBP', label: 'British Pound (£)' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'he', label: 'עברית' },
  ];

  const updateProfile = useFinanceStore((state) => state.updateProfile);
  const addHouseholdMember = useFinanceStore((state) => state.addHouseholdMember);
  const addPaymentMethod = useFinanceStore((state) => state.addPaymentMethod);
  const addBankAccount = useFinanceStore((state) => state.addBankAccount);
  const addExpectedTransaction = useFinanceStore((state) => state.addExpectedTransaction);
  
  // Step 1: Household Members
  const [adultCount, setAdultCount] = useState(1);
  const [adults, setAdults] = useState<Array<{
    name: string, 
    salary: string, 
    salaryDate: string, 
    financialAid: string
  }>>([
    { name: '', salary: '', salaryDate: '', financialAid: '0' }
  ]);
  
  interface Child {
    name: string;
    birthDate: string;
  }

  const [children, setChildren] = useState<Child[]>([]);
  
  // Step 2: Budget and Loans
  const [calculatedBudget, setCalculatedBudget] = useState('0');
  const [rentAmount, setRentAmount] = useState('');
  const [carLoanAmount, setCarLoanAmount] = useState('');
  const [otherLoansName, setOtherLoansName] = useState('');
  const [otherLoansAmount, setOtherLoansAmount] = useState('');
  const [foodAmount, setFoodAmount] = useState('');
  const [otherLoans, setOtherLoans] = useState<Loan[]>([]);
  
  // Insurance
  const [insuranceAmounts, setInsuranceAmounts] = useState<{[key: string]: string}>({
    vehicle: '',
    home: '',
    health: '',
    other: ''
  });
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  
  // Step 3: Bank Accounts and Payment Methods
  const [bankAccounts, setBankAccounts] = useState<Array<{
    name: string,
    balance: string,
    overdraftLimit: string
  }>>([
    { name: '', balance: '0', overdraftLimit: '0' }
  ]);
  
  const [paymentMethods, setPaymentMethods] = useState<Array<{
    id: string;
    type: string, 
    name: string, 
    cardType?: string, 
    limit?: string,
    deductionDate?: string,
    linkedBankAccount?: number
  }>>([
    { id: 'cash-1', type: 'cash', name: 'Cash' }
  ]);
  
  // Step 4: Recurring Monthly Expenses
  const [monthlyExpenses, setMonthlyExpenses] = useState<{
    water: MonthlyExpenseItem,
    gas: MonthlyExpenseItem,
    electricity: MonthlyExpenseItem,
    taxes: MonthlyExpenseItem,
    internet: MonthlyExpenseItem,
    phone: MonthlyExpenseItem,
    other: MonthlyExpenseItem
  }>({
    water: { enabled: true, amount: '50' },
    gas: { enabled: true, amount: '40' },
    electricity: { enabled: true, amount: '80' },
    taxes: { enabled: true, amount: '100' },
    internet: { enabled: true, amount: '50' },
    phone: { enabled: true, amount: '40' },
    other: { enabled: false, amount: '', description: '' }
  });
  
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
  
  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState<{
    type: 'adult' | 'card',
    index: number
  } | null>(null);
  
  // Additional expenses state
  const [additionalExpenses, setAdditionalExpenses] = useState<AdditionalExpense[]>([]);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpensePaymentMethod, setNewExpensePaymentMethod] = useState('');
  
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
  
  // Calculate budget based on income
  useEffect(() => {
    let totalIncome = 0;
    
    // Add all adult salaries
    adults.forEach(adult => {
      if (adult.salary) {
        totalIncome += parseFloat(adult.salary) || 0;
      }
      
      if (adult.financialAid) {
        totalIncome += parseFloat(adult.financialAid) || 0;
      }
    });
    
    // Set the calculated budget
    setCalculatedBudget(totalIncome.toString());
  }, [adults]);
  
  // Initialize children array when count changes
  useEffect(() => {
    if (childrenCount > children.length) {
      // Add more children
      const newChildren = [...children];
      for (let i = children.length; i < childrenCount; i++) {
        newChildren.push({ name: '', birthDate: '' });
      }
      setChildren(newChildren);
    } else if (childrenCount < children.length) {
      // Remove children
      setChildren(children.slice(0, childrenCount));
    }
  }, [childrenCount]);
  
  // Handle language change
  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
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
        newAdults.push({ name: '', salary: '', salaryDate: '', financialAid: '0' });
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
  
  // Update child information
  const handleChildChange = (index: number, field: keyof Child, value: string) => {
    const newChildren = [...children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setChildren(newChildren);
  };
  
  // Handle date selection
  const [selectedChildIndex, setSelectedChildIndex] = useState<number | null>(null);

  const handleDateSelect = (date: Date) => {
    if (selectedChildIndex !== null) {
      handleChildChange(selectedChildIndex, 'birthDate', date.toISOString());
      setSelectedChildIndex(null);
      setShowDatePicker(false);
    }
  };
  
  // Add bank account
  const handleAddBankAccount = () => {
    setBankAccounts([...bankAccounts, { name: '', balance: '0', overdraftLimit: '0' }]);
  };
  
  // Update bank account
  const handleBankAccountChange = (index: number, field: string, value: string) => {
    const newBankAccounts = [...bankAccounts];
    newBankAccounts[index] = { ...newBankAccounts[index], [field]: value };
    setBankAccounts(newBankAccounts);
  };
  
  // Remove bank account
  const handleRemoveBankAccount = (index: number) => {
    if (bankAccounts.length <= 1) return;
    const newBankAccounts = [...bankAccounts];
    newBankAccounts.splice(index, 1);
    setBankAccounts(newBankAccounts);
    
    // Update linked bank accounts in payment methods
    const newPaymentMethods = paymentMethods.map(method => {
      if (method.linkedBankAccount === index) {
        return { ...method, linkedBankAccount: undefined };
      } else if (method.linkedBankAccount !== undefined && method.linkedBankAccount > index) {
        return { ...method, linkedBankAccount: method.linkedBankAccount - 1 };
      }
      return method;
    });
    
    setPaymentMethods(newPaymentMethods);
  };
  
  // Generate payment method ID
  const generatePaymentMethodId = (type: string) => {
    const count = paymentMethods.filter(m => m.type === type).length + 1;
    return `${type}-${count}`;
  };

  // Add payment method
  const handleAddPaymentMethod = () => {
    setPaymentMethods([...paymentMethods, { 
      id: generatePaymentMethodId('creditCard'),
      type: 'creditCard', 
      name: '', 
      cardType: 'visa', 
      limit: '',
      deductionDate: '1',
      linkedBankAccount: bankAccounts.length > 0 ? 0 : undefined
    }]);
  };
  
  // Update payment method
  const handlePaymentMethodChange = (index: number, field: string, value: string | number) => {
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
  
  // Update insurance amount
  const handleInsuranceChange = (type: string, amount: string) => {
    setInsuranceAmounts(prev => ({
      ...prev,
      [type]: amount
    }));
  };
  
  // Update monthly expense
  const handleMonthlyExpenseChange = (
    type: keyof typeof monthlyExpenses, 
    field: 'enabled' | 'amount' | 'description', 
    value: boolean | string
  ) => {
    setMonthlyExpenses(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
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
      case 0: // Country, Language and Personal Info
        return firstName.trim() && lastName.trim() && country && currency && selectedLanguage;
      case 1: // Budget and Loans
        return calculatedBudget && parseFloat(calculatedBudget) > 0 &&
               rentAmount.trim() && !isNaN(parseFloat(rentAmount));
      case 2: // Bank Accounts and Payment Methods
        return bankAccounts.every(account => account.name.trim()) &&
               paymentMethods.every(method => 
                 method.type === 'cash' || 
                 (method.name.trim() && (method.type !== 'creditCard' || (method.limit && !isNaN(parseFloat(method.limit)))))
               );
      case 3: // Recurring Monthly Expenses
        return true; // All fields are optional in this step
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
      // Scroll to top when changing steps
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    } else {
      handleComplete();
    }
  };
  
  // Navigate to previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top when changing steps
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }
  };
  
  // Complete setup and save all data
  const handleComplete = () => {
    // Update profile
    updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      currency,
      country,
      language: selectedLanguage,
      monthlyBudget: parseFloat(calculatedBudget),
      householdMembers: [],
      paymentMethods: [],
      bankAccounts: [],
    });
    
    // Add household members
    adults.forEach((adult, index) => {
      if (adult.name.trim()) {
        // Parse the date from DD/MM/YYYY format
        let salaryDate: string | undefined;
        if (adult.salaryDate) {
          const [day, month, year] = adult.salaryDate.split('/').map(Number);
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            salaryDate = new Date(year, month - 1, day).toISOString();
          } else {
            // If not in expected format, try to parse directly
            const dateObj = new Date(adult.salaryDate);
            if (!isNaN(dateObj.getTime())) {
              salaryDate = dateObj.toISOString();
            }
          }
        }
        
        addHouseholdMember({
          name: adult.name.trim(),
          type: 'adult',
          salary: adult.salary ? parseFloat(adult.salary) : undefined,
          salaryDate,
          financialAid: adult.financialAid ? parseFloat(adult.financialAid) : undefined,
        });
        
        // Add salary as expected income
        if (adult.salary) {
          const salaryDay = adult.salaryDate ? parseInt(adult.salaryDate) : 25;
          const currentDate = new Date();
          const salaryDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), salaryDay);
          
          const salaryTransaction = {
            amount: parseFloat(adult.salary),
            description: `${adult.name} ${t('salary')}`,
            category: 'income',
            dueDate: salaryDateObj.toISOString(),
            type: 'income' as const,
            isPaid: false,
          };
          addExpectedTransaction(salaryTransaction);
        }
        
        // Add financial aid as expected income if present
        if (adult.financialAid && parseFloat(adult.financialAid) > 0) {
          const aidDay = 15; // Assume mid-month for aid payments
          const currentDate = new Date();
          const aidDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), aidDay);
          
          const aidTransaction = {
            amount: parseFloat(adult.financialAid),
            description: `${adult.name} ${t('financialAid')}`,
            category: 'income',
            dueDate: aidDateObj.toISOString(),
            type: 'income' as const,
            isPaid: false,
          };
          addExpectedTransaction(aidTransaction);
        }
      }
    });
    
    // Add children
    children.forEach(child => {
      if (child.name.trim()) {
        addHouseholdMember({
          name: child.name.trim(),
          type: 'child',
          birthDate: child.birthDate,
        });
      }
    });
    
    // Add bank accounts
    bankAccounts.forEach((account, index) => {
      if (account.name.trim()) {
        addBankAccount({
          name: account.name.trim(),
          balance: parseFloat(account.balance) || 0,
          overdraftLimit: parseFloat(account.overdraftLimit) || 0,
        });
      }
    });
    
    // Add payment methods
    paymentMethods.forEach((method, index) => {
      if (method.name.trim() || method.type === 'cash') {
        const paymentMethod: any = {
          id: method.id,
          type: method.type,
          name: method.name.trim() || method.type,
        };
        
        if (method.type === 'creditCard' || method.type === 'debitCard') {
          paymentMethod.cardType = method.cardType;
          paymentMethod.limit = method.limit ? parseFloat(method.limit) : undefined;
          paymentMethod.currentUsage = 0;
          paymentMethod.deductionDate = method.deductionDate ? parseInt(method.deductionDate) : undefined;
          
          // Link to bank account if specified
          if (method.linkedBankAccount !== undefined) {
            paymentMethod.linkedBankAccount = method.linkedBankAccount;
          }
        }
        
        addPaymentMethod(paymentMethod);
      }
    });
    
    // Add initial expected transactions
    
    // Rent/Mortgage
    if (rentAmount) {
      const rentTransaction = {
        amount: parseFloat(rentAmount),
        description: t('rentOrMortgage'),
        category: 'household',
        subcategory: 'rent' as any,
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
    
    // Car loan
    if (carLoanAmount && parseFloat(carLoanAmount) > 0) {
      const carLoanTransaction = {
        amount: parseFloat(carLoanAmount),
        description: t('carLoan'),
        category: 'car',
        subcategory: 'carLoan',
        dueDate: new Date(new Date().setDate(5)).toISOString(), // 5th of current month
        type: 'expense' as const,
        isPaid: false,
      };
      addExpectedTransaction(carLoanTransaction);
    }
    
    // Other loans
    if (otherLoansAmount && parseFloat(otherLoansAmount) > 0) {
      const otherLoanTransaction = {
        amount: parseFloat(otherLoansAmount),
        description: t('otherLoans'),
        category: 'other',
        dueDate: new Date(new Date().setDate(10)).toISOString(), // 10th of current month
        type: 'expense' as const,
        isPaid: false,
      };
      addExpectedTransaction(otherLoanTransaction);
    }
    
    // Food
    if (foodAmount && parseFloat(foodAmount) > 0) {
      const foodTransaction = {
        amount: parseFloat(foodAmount),
        description: t('food'),
        category: 'household',
        subcategory: 'food',
        dueDate: new Date(new Date().setDate(7)).toISOString(), // 7th of current month
        type: 'expense' as const,
        isPaid: false,
      };
      addExpectedTransaction(foodTransaction);
    }
    
    // Insurance expenses
    Object.entries(insuranceAmounts).forEach(([type, amount], index) => {
      if (amount && parseFloat(amount) > 0) {
        const insuranceTransaction = {
          amount: parseFloat(amount),
          description: `${t('insurance')} - ${t(type as any)}`,
          category: type === 'vehicle' ? 'car' : 'household',
          subcategory: 'insurance',
          dueDate: new Date(new Date().setDate(15 + index)).toISOString(), // Distribute due dates
          type: 'expense' as const,
          isPaid: false,
        };
        addExpectedTransaction(insuranceTransaction);
      }
    });
    
    // Monthly expenses
    Object.entries(monthlyExpenses).forEach(([type, data], index) => {
      if (data.enabled && data.amount && parseFloat(data.amount) > 0) {
        const description = type === 'other' && 'description' in data && data.description ? data.description : t(type as any);
        
        const expenseTransaction = {
          amount: parseFloat(data.amount),
          description,
          category: 'household',
          subcategory: type,
          dueDate: new Date(new Date().setDate(12 + index)).toISOString(), // Distribute due dates
          type: 'expense' as const,
          isPaid: false,
        };
        addExpectedTransaction(expenseTransaction);
      }
    });
    
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
                dueDate: new Date(new Date().setDate(20 + index)).toISOString(), // Distribute due dates
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
    if (children.length > 0) {
      const schoolExpense = {
        amount: children.length * 100, // $100 per child
        description: t('schoolExpenses'),
        category: 'childrenCategory',
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
        return renderCountryAndPersonalInfo();
      case 1:
        return renderBudgetAndLoans();
      case 2:
        return renderBankAccountsAndCards();
      case 3:
        return renderMonthlyExpenses();
      case 4:
        return renderAdditionalExpenses();
      default:
        return null;
    }
  };
  
  // Step 1: Country, Language and Personal Info + Household Members
  const renderCountryAndPersonalInfo = () => {
    return (
      <View style={styles.stepContent}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>{t('personalInfo')}</Text>
          <Text style={styles.stepDescription}>{t('setupPersonalInfo')}</Text>
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
          <Text style={styles.label}>{t('country')}</Text>
          <Pressable 
            style={styles.button}
            onPress={() => setShowCountryPicker(true)}
          >
            <Text style={styles.buttonText}>
              {country ? countryOptions.find(c => c.value === country)?.label : t('country')}
            </Text>
          </Pressable>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('preferredCurrency')}</Text>
          <Pressable 
            style={styles.button}
            onPress={() => setShowCurrencyPicker(true)}
          >
            <Text style={styles.buttonText}>
              {currency ? currencyOptions.find(c => c.value === currency)?.label : t('preferredCurrency')}
            </Text>
          </Pressable>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('language')}</Text>
          <Pressable 
            style={styles.button}
            onPress={() => setShowLanguagePicker(true)}
          >
            <Text style={styles.buttonText}>
              {selectedLanguage ? languageOptions.find(l => l.value === selectedLanguage)?.label : t('language')}
            </Text>
          </Pressable>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('numberOfChildren')}</Text>
          <View style={styles.counterContainer}>
            <Pressable
              style={[styles.counterButton, childrenCount <= 0 && styles.counterButtonDisabled]}
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

        {/* Country Picker Modal */}
        <Modal
          visible={showCountryPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCountryPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('country')}</Text>
                <Pressable onPress={() => setShowCountryPicker(false)}>
                  <X size={24} color={colors.text} />
                </Pressable>
              </View>
              <ScrollView style={styles.modalList}>
                {countryOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    style={styles.modalItem}
                    onPress={() => {
                      setCountry(option.value);
                      setShowCountryPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.modalItemText,
                      country === option.value && styles.modalItemTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Currency Picker Modal */}
        <Modal
          visible={showCurrencyPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCurrencyPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('preferredCurrency')}</Text>
                <Pressable onPress={() => setShowCurrencyPicker(false)}>
                  <X size={24} color={colors.text} />
                </Pressable>
              </View>
              <ScrollView style={styles.modalList}>
                {currencyOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    style={styles.modalItem}
                    onPress={() => {
                      setCurrency(option.value);
                      setShowCurrencyPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.modalItemText,
                      currency === option.value && styles.modalItemTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Language Picker Modal */}
        <Modal
          visible={showLanguagePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowLanguagePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('language')}</Text>
                <Pressable onPress={() => setShowLanguagePicker(false)}>
                  <X size={24} color={colors.text} />
                </Pressable>
              </View>
              <ScrollView style={styles.modalList}>
                {languageOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    style={styles.modalItem}
                    onPress={() => {
                      handleLanguageChange(option.value as Language);
                      setShowLanguagePicker(false);
                    }}
                  >
                    <Text style={[
                      styles.modalItemText,
                      selectedLanguage === option.value && styles.modalItemTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  
  // Step 2: Budget and Loans
  const renderBudgetAndLoans = () => {
    return (
      <View style={styles.stepContent}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>{t('budgetAndLoans')}</Text>
          <Text style={styles.stepDescription}>{t('setupBudgetAndLoans')}</Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('calculatedBudget')}</Text>
          <View style={styles.calculatedBudgetContainer}>
            <Text style={styles.calculatedBudgetValue}>
              {currency === 'EUR' ? '€' : currency === 'ILS' ? '₪' : '$'}{parseFloat(calculatedBudget).toLocaleString()}
            </Text>
            <Text style={styles.calculatedBudgetInfo}>
              {t('calculatedFromIncome')}
            </Text>
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('rentOrMortgage')}</Text>
          <TextInput
            style={[styles.input, isRTL && styles.rtlInput]}
            value={rentAmount}
            onChangeText={setRentAmount}
            placeholder={t('enterAmount')}
            keyboardType="numeric"
            placeholderTextColor={colors.textLight}
            textAlign={isRTL ? 'right' : 'left'}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('carLoan')}</Text>
          <TextInput
            style={[styles.input, isRTL && styles.rtlInput]}
            value={carLoanAmount}
            onChangeText={setCarLoanAmount}
            placeholder={t('enterAmount')}
            keyboardType="numeric"
            placeholderTextColor={colors.textLight}
            textAlign={isRTL ? 'right' : 'left'}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('otherLoans')}</Text>
          <View style={styles.loanContainer}>
            <TextInput
              style={[styles.input, isRTL && styles.rtlInput]}
              value={otherLoansName}
              onChangeText={setOtherLoansName}
              placeholder={t('loanName')}
              placeholderTextColor={colors.textLight}
              textAlign={isRTL ? 'right' : 'left'}
            />
            <TextInput
              style={[styles.input, isRTL && styles.rtlInput]}
              value={otherLoansAmount}
              onChangeText={setOtherLoansAmount}
              placeholder={t('enterAmount')}
              keyboardType="numeric"
              placeholderTextColor={colors.textLight}
              textAlign={isRTL ? 'right' : 'left'}
            />
            <Pressable
              style={styles.addButton}
              onPress={() => {
                // Ajouter le prêt à la liste
                const newLoan = {
                  id: generateId(),
                  name: otherLoansName,
                  amount: otherLoansAmount,
                };
                setOtherLoans([...otherLoans, newLoan]);
                setOtherLoansName('');
                setOtherLoansAmount('');
              }}
            >
              <Plus size={20} color={colors.white} />
            </Pressable>
          </View>
          
          {/* Liste des prêts */}
          {otherLoans.map((loan, index) => (
            <View key={loan.id} style={styles.loanItem}>
              <Text style={styles.loanName}>{loan.name}</Text>
              <Text style={styles.loanAmount}>
                {currency === 'EUR' ? '€' : currency === 'ILS' ? '₪' : '$'}{parseFloat(loan.amount).toLocaleString()}
              </Text>
              <Pressable
                style={styles.removeButton}
                onPress={() => {
                  setOtherLoans(otherLoans.filter((_, i) => i !== index));
                }}
              >
                <X size={16} color={colors.danger} />
              </Pressable>
            </View>
          ))}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('food')}</Text>
          <TextInput
            style={[styles.input, isRTL && styles.rtlInput]}
            value={foodAmount}
            onChangeText={setFoodAmount}
            placeholder={t('enterAmount')}
            keyboardType="numeric"
            placeholderTextColor={colors.textLight}
            textAlign={isRTL ? 'right' : 'left'}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('insurance')}</Text>
          <Pressable 
            style={styles.insuranceButton}
            onPress={() => setShowInsuranceModal(true)}
          >
            <ShieldCheck size={20} color={colors.primary} />
            <Text style={styles.insuranceButtonText}>
              {t('configureInsurance')}
            </Text>
            <ChevronRight size={20} color={colors.textLight} />
          </Pressable>
          
          {/* Show insurance summary if any amounts are set */}
          {Object.entries(insuranceAmounts).some(([_, amount]) => amount && parseFloat(amount) > 0) && (
            <View style={styles.insuranceSummary}>
              {Object.entries(insuranceAmounts).map(([type, amount]) => {
                if (amount && parseFloat(amount) > 0) {
                  return (
                    <View key={type} style={styles.insuranceItem}>
                      <Text style={styles.insuranceItemType}>{t(type as any)}</Text>
                      <Text style={styles.insuranceItemAmount}>
                        {currency === 'EUR' ? '€' : currency === 'ILS' ? '₪' : '$'}{parseFloat(amount).toLocaleString()}
                      </Text>
                    </View>
                  );
                }
                return null;
              })}
            </View>
          )}
        </View>
        
        {/* Insurance Modal */}
        <Modal
          visible={showInsuranceModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowInsuranceModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('configureInsurance')}</Text>
                <Pressable onPress={() => setShowInsuranceModal(false)}>
                  <X size={24} color={colors.text} />
                </Pressable>
              </View>
              
              {insuranceTypes.map(type => (
                <View key={type.id} style={styles.insuranceInputGroup}>
                  <View style={styles.insuranceTypeHeader}>
                    <View style={styles.insuranceTypeIcon}>
                      <type.icon size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.insuranceTypeText}>{t(type.id as any)}</Text>
                  </View>
                  <TextInput
                    style={styles.insuranceInput}
                    value={insuranceAmounts[type.id]}
                    onChangeText={(value) => handleInsuranceChange(type.id, value)}
                    placeholder={t('enterAmount')}
                    keyboardType="numeric"
                    placeholderTextColor={colors.textLight}
                  />
                </View>
              ))}
              
              <Pressable 
                style={styles.modalButton}
                onPress={() => setShowInsuranceModal(false)}
              >
                <Text style={styles.modalButtonText}>{t('done')}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  
  // Step 3: Bank Accounts and Payment Methods
  const renderBankAccountsAndCards = () => {
    return (
      <View style={styles.stepContent}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>{t('bankAccountsAndCards')}</Text>
          <Text style={styles.stepDescription}>{t('setupBankAccountsAndCards')}</Text>
        </View>
        
        {/* Bank Accounts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('bankAccounts')}</Text>
        </View>
        
        {bankAccounts.map((account, index) => (
          <View key={index} style={styles.bankAccountContainer}>
            <View style={styles.bankAccountHeader}>
              <View style={styles.bankAccountIcon}>
                <Landmark size={20} color={colors.white} />
              </View>
              <Text style={styles.bankAccountTitle}>{t('bankAccount')} {index + 1}</Text>
              {index > 0 && (
                <Pressable 
                  style={styles.removeButton}
                  onPress={() => handleRemoveBankAccount(index)}
                >
                  <X size={16} color={colors.danger} />
                </Pressable>
              )}
            </View>
            
            <View style={styles.bankAccountContent}>
              <View style={styles.bankAccountField}>
                <Text style={styles.bankAccountLabel}>{t('accountName')}</Text>
                <TextInput
                  style={[styles.bankAccountInput, isRTL && styles.rtlInput]}
                  value={account.name}
                  onChangeText={(value) => handleBankAccountChange(index, 'name', value)}
                  placeholder={t('enterAccountName')}
                  placeholderTextColor={colors.textLight}
                  textAlign={isRTL ? 'right' : 'left'}
                />
              </View>
              
              <View style={styles.bankAccountField}>
                <Text style={styles.bankAccountLabel}>{t('currentBalance')}</Text>
                <TextInput
                  style={[styles.bankAccountInput, isRTL && styles.rtlInput]}
                  value={account.balance}
                  onChangeText={(value) => handleBankAccountChange(index, 'balance', value)}
                  placeholder={t('enterAmount')}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textLight}
                  textAlign={isRTL ? 'right' : 'left'}
                />
              </View>
              
              <View style={styles.bankAccountField}>
                <Text style={styles.bankAccountLabel}>{t('overdraftLimit')}</Text>
                <TextInput
                  style={[styles.bankAccountInput, isRTL && styles.rtlInput]}
                  value={account.overdraftLimit}
                  onChangeText={(value) => handleBankAccountChange(index, 'overdraftLimit', value)}
                  placeholder={t('enterAmount')}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textLight}
                  textAlign={isRTL ? 'right' : 'left'}
                />
              </View>
            </View>
          </View>
        ))}
        
        <Pressable 
          style={styles.addButton}
          onPress={handleAddBankAccount}
        >
          <Plus size={16} color={colors.white} />
          <Text style={styles.addButtonText}>{t('addBankAccount')}</Text>
        </Pressable>
        
        {/* Payment Methods */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('paymentMethods')}</Text>
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
                  <X size={16} color={colors.danger} />
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
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t('deductionDay')}</Text>
                  <TextInput
                    style={[styles.input, isRTL && styles.rtlInput]}
                    value={method.deductionDate}
                    onChangeText={(value) => {
                      // Vérifier que la valeur est un nombre entre 1 et 31
                      const day = parseInt(value);
                      if ((!isNaN(day) && day >= 1 && day <= 31) || value === '') {
                        handlePaymentMethodChange(index, 'deductionDate', value);
                      }
                    }}
                    placeholder={t('enterDay')}
                    keyboardType="numeric"
                    placeholderTextColor={colors.textLight}
                    textAlign={isRTL ? 'right' : 'left'}
                    maxLength={2}
                  />
                </View>
                
                {bankAccounts.length > 0 && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('linkedBankAccount')}</Text>
                    <View style={styles.linkedAccountList}>
                      {bankAccounts.map((account, accountIndex) => (
                        <Pressable
                          key={accountIndex}
                          style={[
                            styles.linkedAccountItem,
                            method.linkedBankAccount === accountIndex && styles.linkedAccountItemActive,
                          ]}
                          onPress={() => handlePaymentMethodChange(index, 'linkedBankAccount', accountIndex)}
                        >
                          <Text
                            style={[
                              styles.linkedAccountText,
                              method.linkedBankAccount === accountIndex && styles.linkedAccountTextActive,
                            ]}
                          >
                            {account.name || `${t('account')} ${accountIndex + 1}`}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}
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
      </View>
    );
  };
  
  // Step 4: Recurring Monthly Expenses
  const renderMonthlyExpenses = () => {
    return (
      <View style={styles.stepContent}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>{t('recurringMonthlyExpenses')}</Text>
          <Text style={styles.stepDescription}>{t('setupRecurringExpenses')}</Text>
        </View>
        
        {/* Water */}
        <View style={styles.expenseItem}>
          <View style={styles.expenseItemHeader}>
            <View style={styles.expenseItemIcon}>
              <Droplet size={20} color={colors.primary} />
            </View>
            <Text style={styles.expenseItemTitle}>{t('water')}</Text>
            <Switch
              value={monthlyExpenses.water.enabled}
              onValueChange={(value) => handleMonthlyExpenseChange('water', 'enabled', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
            />
          </View>
          
          {monthlyExpenses.water.enabled && (
            <View style={styles.expenseItemContent}>
              <TextInput
                style={styles.expenseItemInput}
                value={monthlyExpenses.water.amount}
                onChangeText={(value) => handleMonthlyExpenseChange('water', 'amount', value)}
                placeholder={t('enterAmount')}
                keyboardType="numeric"
                placeholderTextColor={colors.textLight}
              />
            </View>
          )}
        </View>
        
        {/* Gas */}
        <View style={styles.expenseItem}>
          <View style={styles.expenseItemHeader}>
            <View style={styles.expenseItemIcon}>
              <Flame size={20} color={colors.primary} />
            </View>
            <Text style={styles.expenseItemTitle}>{t('gas')}</Text>
            <Switch
              value={monthlyExpenses.gas.enabled}
              onValueChange={(value) => handleMonthlyExpenseChange('gas', 'enabled', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
            />
          </View>
          
          {monthlyExpenses.gas.enabled && (
            <View style={styles.expenseItemContent}>
              <TextInput
                style={styles.expenseItemInput}
                value={monthlyExpenses.gas.amount}
                onChangeText={(value) => handleMonthlyExpenseChange('gas', 'amount', value)}
                placeholder={t('enterAmount')}
                keyboardType="numeric"
                placeholderTextColor={colors.textLight}
              />
            </View>
          )}
        </View>
        
        {/* Electricity */}
        <View style={styles.expenseItem}>
          <View style={styles.expenseItemHeader}>
            <View style={styles.expenseItemIcon}>
              <Zap size={20} color={colors.primary} />
            </View>
            <Text style={styles.expenseItemTitle}>{t('electricity')}</Text>
            <Switch
              value={monthlyExpenses.electricity.enabled}
              onValueChange={(value) => handleMonthlyExpenseChange('electricity', 'enabled', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
            />
          </View>
          
          {monthlyExpenses.electricity.enabled && (
            <View style={styles.expenseItemContent}>
              <TextInput
                style={styles.expenseItemInput}
                value={monthlyExpenses.electricity.amount}
                onChangeText={(value) => handleMonthlyExpenseChange('electricity', 'amount', value)}
                placeholder={t('enterAmount')}
                keyboardType="numeric"
                placeholderTextColor={colors.textLight}
              />
            </View>
          )}
        </View>
        
        {/* Taxes */}
        <View style={styles.expenseItem}>
          <View style={styles.expenseItemHeader}>
            <View style={styles.expenseItemIcon}>
              <Receipt size={20} color={colors.primary} />
            </View>
            <Text style={styles.expenseItemTitle}>{t('taxes')}</Text>
            <Switch
              value={monthlyExpenses.taxes.enabled}
              onValueChange={(value) => handleMonthlyExpenseChange('taxes', 'enabled', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
            />
          </View>
          
          {monthlyExpenses.taxes.enabled && (
            <View style={styles.expenseItemContent}>
              <TextInput
                style={styles.expenseItemInput}
                value={monthlyExpenses.taxes.amount}
                onChangeText={(value) => handleMonthlyExpenseChange('taxes', 'amount', value)}
                placeholder={t('enterAmount')}
                keyboardType="numeric"
                placeholderTextColor={colors.textLight}
              />
            </View>
          )}
        </View>
        
        {/* Internet */}
        <View style={styles.expenseItem}>
          <View style={styles.expenseItemHeader}>
            <View style={styles.expenseItemIcon}>
              <Wifi size={20} color={colors.primary} />
            </View>
            <Text style={styles.expenseItemTitle}>{t('internet')}</Text>
            <Switch
              value={monthlyExpenses.internet.enabled}
              onValueChange={(value) => handleMonthlyExpenseChange('internet', 'enabled', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
            />
          </View>
          
          {monthlyExpenses.internet.enabled && (
            <View style={styles.expenseItemContent}>
              <TextInput
                style={styles.expenseItemInput}
                value={monthlyExpenses.internet.amount}
                onChangeText={(value) => handleMonthlyExpenseChange('internet', 'amount', value)}
                placeholder={t('enterAmount')}
                keyboardType="numeric"
                placeholderTextColor={colors.textLight}
              />
            </View>
          )}
        </View>
        
        {/* Phone */}
        <View style={styles.expenseItem}>
          <View style={styles.expenseItemHeader}>
            <View style={styles.expenseItemIcon}>
              <Phone size={20} color={colors.primary} />
            </View>
            <Text style={styles.expenseItemTitle}>{t('phone')}</Text>
            <Switch
              value={monthlyExpenses.phone.enabled}
              onValueChange={(value) => handleMonthlyExpenseChange('phone', 'enabled', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
            />
          </View>
          
          {monthlyExpenses.phone.enabled && (
            <View style={styles.expenseItemContent}>
              <TextInput
                style={styles.expenseItemInput}
                value={monthlyExpenses.phone.amount}
                onChangeText={(value) => handleMonthlyExpenseChange('phone', 'amount', value)}
                placeholder={t('enterAmount')}
                keyboardType="numeric"
                placeholderTextColor={colors.textLight}
              />
            </View>
          )}
        </View>
        
        {/* Other */}
        <View style={styles.expenseItem}>
          <View style={styles.expenseItemHeader}>
            <View style={styles.expenseItemIcon}>
              <Plus size={20} color={colors.primary} />
            </View>
            <Text style={styles.expenseItemTitle}>{t('otherExpenses')}</Text>
            <Switch
              value={monthlyExpenses.other.enabled}
              onValueChange={(value) => handleMonthlyExpenseChange('other', 'enabled', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
            />
          </View>
          
          {monthlyExpenses.other.enabled && (
            <View style={styles.expenseItemContent}>
              <TextInput
                style={styles.expenseItemInput}
                value={monthlyExpenses.other.description}
                onChangeText={(value) => handleMonthlyExpenseChange('other', 'description', value)}
                placeholder={t('description')}
                placeholderTextColor={colors.textLight}
              />
              <TextInput
                style={[styles.expenseItemInput, { marginTop: 8 }]}
                value={monthlyExpenses.other.amount}
                onChangeText={(value) => handleMonthlyExpenseChange('other', 'amount', value)}
                placeholder={t('enterAmount')}
                keyboardType="numeric"
                placeholderTextColor={colors.textLight}
              />
            </View>
          )}
        </View>
      </View>
    );
  };
  
  // Step 5: Additional Expenses
  const renderAdditionalExpenses = () => {
    return (
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
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('otherExpenses')}</Text>
          <View style={styles.expenseContainer}>
            <TextInput
              style={[styles.input, isRTL && styles.rtlInput]}
              value={newExpenseName}
              onChangeText={setNewExpenseName}
              placeholder={t('expenseName')}
              placeholderTextColor={colors.textLight}
              textAlign={isRTL ? 'right' : 'left'}
            />
            <TextInput
              style={[styles.input, isRTL && styles.rtlInput]}
              value={newExpenseAmount}
              onChangeText={setNewExpenseAmount}
              placeholder={t('enterAmount')}
              keyboardType="numeric"
              placeholderTextColor={colors.textLight}
              textAlign={isRTL ? 'right' : 'left'}
            />
            <View style={styles.paymentMethodPicker}>
              <Picker
                selectedValue={newExpensePaymentMethod}
                onValueChange={(value) => setNewExpensePaymentMethod(value)}
                style={styles.picker}
              >
                <Picker.Item label={t('selectPaymentMethod')} value="" />
                {paymentMethods.map((method) => (
                  <Picker.Item
                    key={method.id}
                    label={method.name}
                    value={method.id}
                  />
                ))}
              </Picker>
            </View>
            <Pressable
              style={styles.addButton}
              onPress={handleAddExpense}
            >
              <Plus size={20} color={colors.white} />
            </Pressable>
          </View>
          
          {additionalExpenses.map((expense) => (
            <View key={expense.id} style={styles.expenseItem}>
              <Text style={styles.expenseName}>{expense.name}</Text>
              <Text style={styles.expenseAmount}>
                {currency === 'EUR' ? '€' : currency === 'ILS' ? '₪' : '$'}{parseFloat(expense.amount).toLocaleString()}
              </Text>
              <Text style={styles.expensePaymentMethod}>
                {paymentMethods.find(m => m.id === expense.paymentMethod)?.name}
              </Text>
              <Pressable
                style={styles.removeButton}
                onPress={() => handleRemoveExpense(expense.id)}
              >
                <X size={16} color={colors.danger} />
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    );
  };
  
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };
  
  const handleAddExpense = () => {
    if (newExpenseName && newExpenseAmount && newExpensePaymentMethod) {
      const newExpense = {
        id: generateId(),
        name: newExpenseName,
        amount: newExpenseAmount,
        paymentMethod: newExpensePaymentMethod,
      };
      setAdditionalExpenses([...additionalExpenses, newExpense]);
      setNewExpenseName('');
      setNewExpenseAmount('');
      setNewExpensePaymentMethod('');
    }
  };
  
  const handleRemoveExpense = (id: string) => {
    setAdditionalExpenses(additionalExpenses.filter(expense => expense.id !== id));
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'Account Setup',
          headerShown: false,
        }} 
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('welcome')}</Text>
            <Text style={styles.subtitle}>{t('setupAccount')}</Text>
          </View>
          
          <ScrollView 
            ref={scrollViewRef}
            style={styles.form}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formContent}
          >
            {renderStepContent()}
            
            {/* Add some padding at the bottom for scrolling */}
            <View style={{ height: 100 }} />
          </ScrollView>
          
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
      </KeyboardAvoidingView>
      
      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <SimpleDatePicker
              value={null}
              onChange={handleDateSelect}
              onClose={() => setShowDatePicker(false)}
            />
          </View>
        </View>
      </Modal>
      
      {showDatePicker && selectedChildIndex !== null && (
        <SimpleDatePicker
          value={children[selectedChildIndex].birthDate ? new Date(children[selectedChildIndex].birthDate) : null}
          onChange={handleDateSelect}
          onClose={() => {
            setSelectedChildIndex(null);
            setShowDatePicker(false);
          }}
        />
      )}
    </SafeAreaView>
  );
}