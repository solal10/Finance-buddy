// User profile
export interface UserProfile {
  firstName: string;
  lastName: string;
  currency: string;
  monthlyBudget: number;
  language: string;
  housingType?: 'apartment' | 'house' | 'other';
  householdMembers: HouseholdMember[];
  paymentMethods: PaymentMethod[];
}

// Household member
export interface HouseholdMember {
  id: string;
  name: string;
  type: 'adult' | 'child';
  salary?: number;
  salaryDate?: string; // ISO date string
  commissions?: number;
}

// Payment method
export interface PaymentMethod {
  id: string;
  type: 'creditCard' | 'debitCard' | 'bankAccount' | 'cash';
  name: string;
  cardType?: 'visa' | 'mastercard' | 'other';
  limit?: number;
  currentUsage?: number;
}

// Transaction
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  subcategory?: string;
  date: string; // ISO date string
  type: 'income' | 'expense';
  isRecurring: boolean;
  recurringDetails?: RecurringDetails;
  paymentMethod?: {
    id: string;
    type: 'creditCard' | 'debitCard' | 'bankAccount' | 'cash';
    name: string;
  };
  isCreditPurchase?: boolean;
  creditDetails?: CreditPurchaseDetails;
  projectId?: string;
}

// Credit purchase details
export interface CreditPurchaseDetails {
  totalAmount: number;
  remainingAmount: number;
  totalMonths: number;
  remainingMonths: number;
  startDate: string; // ISO date string
  monthlyPayment: number;
  cardId?: string;
}

// Recurring transaction details
export interface RecurringDetails {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  dayOfMonth?: number; // For monthly frequency
  dayOfWeek?: number; // For weekly frequency (0-6, where 0 is Sunday)
}

// Expected transaction
export interface ExpectedTransaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  subcategory?: string;
  dueDate: string; // ISO date string
  type: 'income' | 'expense';
  isPaid: boolean;
  paymentMethod?: {
    id: string;
    type: 'creditCard' | 'debitCard' | 'bankAccount' | 'cash';
    name: string;
  };
}

// Category
export interface Category {
  id: string;
  name: string;
  icon?: string;
  color: string;
  subcategories?: { id: string; name: string }[];
}

// Financial project
export interface FinancialProject {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyInvestment: number;
  months: number;
  createdAt: string; // ISO date string
  description?: string;
}

// Monthly total for charts
export interface MonthlyTotal {
  month: string; // Format: YYYY-MM
  expenses: number;
  income: number;
}

// Category total for charts
export interface CategoryTotal {
  categoryId: string;
  categoryName: string;
  amount: number;
  color: string;
}