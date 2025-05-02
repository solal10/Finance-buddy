import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Transaction, 
  Category, 
  UserProfile, 
  MonthlyTotal, 
  CategoryTotal, 
  FinancialProject, 
  ExpectedTransaction,
  HouseholdMember,
  PaymentMethod,
  CreditPurchaseDetails,
  BankAccount
} from '@/types/finance';
import { defaultCategories } from '@/mocks/categories';
import { colors } from '@/constants/colors';
import { Language } from '@/translations';

export interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  profile: UserProfile;
  projects: FinancialProject[];
  expectedTransactions: ExpectedTransaction[];
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  
  // Household members
  addHouseholdMember: (member: Omit<HouseholdMember, 'id'>) => void;
  updateHouseholdMember: (member: HouseholdMember) => void;
  deleteHouseholdMember: (id: string) => void;
  
  // Payment methods
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (method: PaymentMethod) => void;
  deletePaymentMethod: (id: string) => void;
  
  // Bank accounts
  addBankAccount: (account: Omit<BankAccount, 'id'>) => void;
  updateBankAccount: (account: BankAccount) => void;
  deleteBankAccount: (id: string) => void;
  
  // Project actions
  addProject: (project: Omit<FinancialProject, 'id' | 'createdAt' | 'currentAmount'>) => void;
  updateProject: (project: FinancialProject) => void;
  deleteProject: (id: string) => void;
  contributeToProject: (id: string, amount: number) => void;
  
  // Expected transactions
  addExpectedTransaction: (transaction: Omit<ExpectedTransaction, 'id'>) => void;
  updateExpectedTransaction: (transaction: ExpectedTransaction) => void;
  deleteExpectedTransaction: (id: string) => void;
  markExpectedTransactionAsPaid: (id: string) => void;
  
  // Credit purchases
  addCreditPurchase: (transaction: Omit<Transaction, 'id'>, creditDetails: Omit<CreditPurchaseDetails, 'remainingAmount' | 'remainingMonths'>) => void;
  updateCreditPurchaseStatus: () => void;
  
  // Computed values
  getMonthlyTotals: (months?: number) => MonthlyTotal[];
  getCategoryTotals: (startDate?: string, endDate?: string) => CategoryTotal[];
  getCurrentMonthExpenses: () => number;
  getCurrentMonthIncome: () => number;
  getBudgetRemaining: () => number;
  getAvailableBalance: () => number;
  getExpectedIncome: () => number;
  getExpectedExpenses: () => number;
  getTotalHouseholdIncome: () => number;
  getCardRemainingLimit: (cardId: string) => number;
  isProjectFeasible: (monthlyInvestment: number) => boolean;

  // Reset functionality
  resetAllData: () => void;
}

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Helper function to get the current month's start and end dates
const getCurrentMonthDates = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { startOfMonth, endOfMonth };
};

// Create the store
export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: defaultCategories,
      profile: {
        email: '',
        isRegistered: false,
        firstName: '',
        lastName: '',
        currency: 'USD',
        country: 'US',
        monthlyBudget: 2000,
        language: 'en',
        householdMembers: [],
        paymentMethods: [
          {
            id: generateId(),
            type: 'cash',
            name: 'Cash',
          }
        ],
        bankAccounts: [],
      },
      projects: [],
      expectedTransactions: [],
      
      // Transaction actions
      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: generateId(),
        };
        
        // If this is a payment from a credit card, update the card usage
        if (transaction.paymentMethod && 
            (transaction.paymentMethod.type === 'creditCard' || transaction.paymentMethod.type === 'debitCard') && 
            transaction.type === 'expense') {
          
          const updatedPaymentMethods = get().profile.paymentMethods.map(method => {
            if (method.id === transaction.paymentMethod?.id) {
              return {
                ...method,
                currentUsage: (method.currentUsage || 0) + transaction.amount
              };
            }
            return method;
          });
          
          set(state => ({
            profile: {
              ...state.profile,
              paymentMethods: updatedPaymentMethods
            }
          }));
        }
        
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },
      
      updateTransaction: (transaction) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === transaction.id ? transaction : t
          ),
        }));
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },
      
      // Category actions
      addCategory: (category) => {
        const newCategory: Category = {
          ...category,
          id: generateId(),
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },
      
      updateCategory: (category) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === category.id ? category : c
          ),
        }));
      },
      
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },
      
      // Profile actions
      updateProfile: (profile) => {
        set((state) => ({
          profile: { ...state.profile, ...profile },
        }));
      },
      
      // Household member actions
      addHouseholdMember: (member) => {
        const newMember: HouseholdMember = {
          ...member,
          id: generateId(),
        };
        set((state) => ({
          profile: {
            ...state.profile,
            householdMembers: [...state.profile.householdMembers, newMember]
          }
        }));
      },
      
      updateHouseholdMember: (member) => {
        set((state) => ({
          profile: {
            ...state.profile,
            householdMembers: state.profile.householdMembers.map(m => 
              m.id === member.id ? member : m
            )
          }
        }));
      },
      
      deleteHouseholdMember: (id) => {
        set((state) => ({
          profile: {
            ...state.profile,
            householdMembers: state.profile.householdMembers.filter(m => m.id !== id)
          }
        }));
      },
      
      // Payment method actions
      addPaymentMethod: (method) => {
        const newMethod: PaymentMethod = {
          ...method,
          id: generateId(),
          currentUsage: 0
        };
        set((state) => ({
          profile: {
            ...state.profile,
            paymentMethods: [...state.profile.paymentMethods, newMethod]
          }
        }));
      },
      
      updatePaymentMethod: (method) => {
        set((state) => ({
          profile: {
            ...state.profile,
            paymentMethods: state.profile.paymentMethods.map(m => 
              m.id === method.id ? method : m
            )
          }
        }));
      },
      
      deletePaymentMethod: (id) => {
        set((state) => ({
          profile: {
            ...state.profile,
            paymentMethods: state.profile.paymentMethods.filter(m => m.id !== id)
          }
        }));
      },
      
      // Bank account actions
      addBankAccount: (account) => {
        const newAccount: BankAccount = {
          ...account,
          id: generateId(),
        };
        set((state) => ({
          profile: {
            ...state.profile,
            bankAccounts: [...state.profile.bankAccounts, newAccount]
          }
        }));
      },
      
      updateBankAccount: (account) => {
        set((state) => ({
          profile: {
            ...state.profile,
            bankAccounts: state.profile.bankAccounts.map(a => 
              a.id === account.id ? account : a
            )
          }
        }));
      },
      
      deleteBankAccount: (id) => {
        set((state) => ({
          profile: {
            ...state.profile,
            bankAccounts: state.profile.bankAccounts.filter(a => a.id !== id)
          }
        }));
      },
      
      // Project actions
      addProject: (project) => {
        // Check if the project is feasible
        if (!get().isProjectFeasible(project.monthlyInvestment)) {
          // In a real app, we would show an error message here
          console.error("Project investment is too high compared to monthly income");
          return;
        }
        
        const newProject: FinancialProject = {
          ...project,
          id: generateId(),
          currentAmount: 0,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          projects: [...state.projects, newProject],
        }));
        
        // Add a monthly expected transaction for the project investment
        const now = new Date();
        const dueDate = new Date(now.getFullYear(), now.getMonth(), 15); // 15th of current month
        
        get().addExpectedTransaction({
          amount: project.monthlyInvestment,
          description: `Monthly investment for ${project.name}`,
          category: 'other',
          dueDate: dueDate.toISOString(),
          type: 'expense',
          isPaid: false,
        });
      },
      
      updateProject: (project) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === project.id ? project : p
          ),
        }));
      },
      
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },
      
      contributeToProject: (id, amount) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, currentAmount: p.currentAmount + amount }
              : p
          ),
        }));
        
        // Also add a transaction for this contribution
        const project = get().projects.find(p => p.id === id);
        if (project) {
          get().addTransaction({
            amount,
            description: `Contribution to ${project.name}`,
            category: 'other',
            date: new Date().toISOString(),
            type: 'expense',
            isRecurring: false,
          });
        }
      },
      
      // Expected transaction actions
      addExpectedTransaction: (transaction) => {
        const newTransaction: ExpectedTransaction = {
          ...transaction,
          id: generateId(),
        };
        set((state) => ({
          expectedTransactions: [...state.expectedTransactions, newTransaction],
        }));
      },
      
      updateExpectedTransaction: (transaction) => {
        set((state) => ({
          expectedTransactions: state.expectedTransactions.map((t) =>
            t.id === transaction.id ? transaction : t
          ),
        }));
      },
      
      deleteExpectedTransaction: (id) => {
        set((state) => ({
          expectedTransactions: state.expectedTransactions.filter((t) => t.id !== id),
        }));
      },
      
      markExpectedTransactionAsPaid: (id) => {
        // Find the expected transaction
        const expectedTransaction = get().expectedTransactions.find(t => t.id === id);
        if (!expectedTransaction) return;
        
        // Mark it as paid
        set((state) => ({
          expectedTransactions: state.expectedTransactions.map((t) =>
            t.id === id ? { ...t, isPaid: true } : t
          ),
        }));
        
        // Add a real transaction for it
        get().addTransaction({
          amount: expectedTransaction.amount,
          description: expectedTransaction.description,
          category: expectedTransaction.category,
          subcategory: expectedTransaction.subcategory,
          date: new Date().toISOString(),
          type: expectedTransaction.type,
          isRecurring: false,
          paymentMethod: expectedTransaction.paymentMethod,
        });
      },
      
      // Credit purchase actions
      addCreditPurchase: (transaction, creditDetails) => {
        const { totalAmount, totalMonths, startDate } = creditDetails;
        const monthlyPayment = totalAmount / totalMonths;
        
        const newCreditDetails: CreditPurchaseDetails = {
          totalAmount,
          remainingAmount: totalAmount,
          totalMonths,
          remainingMonths: totalMonths,
          startDate,
          monthlyPayment,
          cardId: transaction.paymentMethod?.id
        };
        
        const newTransaction: Transaction = {
          ...transaction,
          id: generateId(),
          isCreditPurchase: true,
          creditDetails: newCreditDetails
        };
        
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
        
        // Add expected transactions for each monthly payment
        const startDateObj = new Date(startDate);
        
        for (let i = 0; i < totalMonths; i++) {
          const paymentDate = new Date(startDateObj);
          paymentDate.setMonth(startDateObj.getMonth() + i);
          
          get().addExpectedTransaction({
            amount: monthlyPayment,
            description: `${transaction.description} - Payment ${i + 1}/${totalMonths}`,
            category: transaction.category,
            subcategory: transaction.subcategory,
            dueDate: paymentDate.toISOString(),
            type: 'expense',
            isPaid: i === 0, // First payment is made at purchase
            paymentMethod: transaction.paymentMethod,
          });
        }
      },
      
      updateCreditPurchaseStatus: () => {
        const { transactions } = get();
        const now = new Date();
        
        const updatedTransactions = transactions.map(transaction => {
          if (transaction.isCreditPurchase && transaction.creditDetails) {
            const { startDate, totalMonths, monthlyPayment } = transaction.creditDetails;
            const startDateObj = new Date(startDate);
            const monthsPassed = (now.getFullYear() - startDateObj.getFullYear()) * 12 + 
                                (now.getMonth() - startDateObj.getMonth());
            
            if (monthsPassed >= totalMonths) {
              // Credit purchase is completed, remove it
              return null;
            }
            
            const remainingMonths = totalMonths - monthsPassed;
            const remainingAmount = remainingMonths * monthlyPayment;
            
            return {
              ...transaction,
              creditDetails: {
                ...transaction.creditDetails,
                remainingMonths,
                remainingAmount
              }
            };
          }
          return transaction;
        }).filter(Boolean) as Transaction[];
        
        set(() => ({
          transactions: updatedTransactions,
        }));
      },
      
      // Computed values
      getMonthlyTotals: (months = 6) => {
        const { transactions } = get();
        const result: MonthlyTotal[] = [];
        
        // Get the current month and year
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        
        // Generate the last N months
        for (let i = 0; i < months; i++) {
          const monthOffset = i;
          const targetMonth = new Date(currentYear, currentMonth - monthOffset, 1);
          const year = targetMonth.getFullYear();
          const month = targetMonth.getMonth() + 1; // JavaScript months are 0-indexed
          
          const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
          
          // Initialize the month data
          result.push({
            month: monthKey,
            expenses: 0,
            income: 0,
          });
        }
        
        // Calculate totals for each month
        if (transactions && transactions.length > 0) {
          transactions.forEach((transaction) => {
            const date = new Date(transaction.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // JavaScript months are 0-indexed
            
            const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
            
            // Find the month in our result array
            const monthData = result.find((m) => m.month === monthKey);
            if (monthData) {
              if (transaction.type === 'expense') {
                monthData.expenses += transaction.amount;
              } else {
                monthData.income += transaction.amount;
              }
            }
          });
        }
        
        return result;
      },
      
      getCategoryTotals: (startDate, endDate) => {
        const { transactions, categories } = get();
        const result: CategoryTotal[] = [];
        
        // Filter transactions by date if provided
        let filteredTransactions = transactions && transactions.length > 0 ? 
          transactions.filter(t => t.type === 'expense') : [];
        
        if (startDate) {
          const start = new Date(startDate);
          filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= start);
        }
        
        if (endDate) {
          const end = new Date(endDate);
          filteredTransactions = filteredTransactions.filter(t => new Date(t.date) <= end);
        }
        
        // Group transactions by category
        const categoryMap: Record<string, number> = {};
        
        filteredTransactions.forEach((transaction) => {
          const { category, amount } = transaction;
          categoryMap[category] = (categoryMap[category] || 0) + amount;
        });
        
        // Convert to array and sort by amount
        Object.entries(categoryMap).forEach(([categoryId, amount]) => {
          const category = categories.find((c) => c.id === categoryId);
          if (category) {
            result.push({
              categoryId,
              categoryName: category.name,
              amount,
              color: category.color,
            });
          }
        });
        
        // Sort by amount (descending)
        return result.sort((a, b) => b.amount - a.amount);
      },
      
      getCurrentMonthExpenses: () => {
        const { transactions } = get();
        const { startOfMonth, endOfMonth } = getCurrentMonthDates();
        
        if (!transactions || transactions.length === 0) return 0;
        
        return transactions
          .filter(
            (t) =>
              t.type === 'expense' &&
              new Date(t.date) >= startOfMonth &&
              new Date(t.date) <= endOfMonth
          )
          .reduce((sum, t) => sum + t.amount, 0);
      },
      
      getCurrentMonthIncome: () => {
        const { transactions } = get();
        const { startOfMonth, endOfMonth } = getCurrentMonthDates();
        
        if (!transactions || transactions.length === 0) return 0;
        
        return transactions
          .filter(
            (t) =>
              t.type === 'income' &&
              new Date(t.date) >= startOfMonth &&
              new Date(t.date) <= endOfMonth
          )
          .reduce((sum, t) => sum + t.amount, 0);
      },
      
      getBudgetRemaining: () => {
        const { profile } = get();
        const currentMonthExpenses = get().getCurrentMonthExpenses();
        return profile.monthlyBudget - currentMonthExpenses;
      },
      
      getAvailableBalance: () => {
        const { transactions, projects, expectedTransactions, profile } = get();
        
        // Calculate total balance from all transactions
        const totalBalance = transactions && transactions.length > 0 ? 
          transactions.reduce((sum, t) => {
            return sum + (t.type === 'income' ? t.amount : -t.amount);
          }, 0) : 0;
        
        // Add bank account balances
        const bankBalance = profile.bankAccounts && profile.bankAccounts.length > 0 ? 
          profile.bankAccounts.reduce((sum, account) => {
            return sum + account.balance;
          }, 0) : 0;
        
        // Subtract money allocated to projects
        const allocatedToProjects = projects && projects.length > 0 ? 
          projects.reduce((sum, p) => sum + p.currentAmount, 0) : 0;
        
        // Consider expected transactions that are not paid yet
        const expectedExpenses = expectedTransactions && expectedTransactions.length > 0 ? 
          expectedTransactions
            .filter(t => !t.isPaid && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0) : 0;
        
        const expectedIncome = expectedTransactions && expectedTransactions.length > 0 ? 
          expectedTransactions
            .filter(t => !t.isPaid && t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0) : 0;
        
        return totalBalance + bankBalance - allocatedToProjects - expectedExpenses + expectedIncome;
      },
      
      getExpectedIncome: () => {
        const { expectedTransactions } = get();
        
        if (!expectedTransactions || expectedTransactions.length === 0) return 0;
        
        return expectedTransactions
          .filter(t => !t.isPaid && t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
      },
      
      getExpectedExpenses: () => {
        const { expectedTransactions } = get();
        
        if (!expectedTransactions || expectedTransactions.length === 0) return 0;
        
        return expectedTransactions
          .filter(t => !t.isPaid && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
      },
      
      getTotalHouseholdIncome: () => {
        const { profile } = get();
        
        if (!profile.householdMembers || profile.householdMembers.length === 0) return 0;
        
        return profile.householdMembers
          .filter(member => member.type === 'adult')
          .reduce((sum, member) => {
            let memberIncome = 0;
            if (member.salary) memberIncome += member.salary;
            if (member.commissions) memberIncome += member.commissions;
            if (member.financialAid) memberIncome += member.financialAid;
            return sum + memberIncome;
          }, 0);
      },
      
      getCardRemainingLimit: (cardId) => {
        const { profile } = get();
        const card = profile.paymentMethods.find(m => m.id === cardId);
        
        if (!card || !card.limit) return 0;
        
        return card.limit - (card.currentUsage || 0);
      },
      
      isProjectFeasible: (monthlyInvestment) => {
        const totalIncome = get().getTotalHouseholdIncome();
        // A project is feasible if the monthly investment is less than 30% of total income
        return monthlyInvestment <= (totalIncome * 0.3);
      },

      resetAllData: () => {
        // Reset all state to initial values
        set({
          transactions: [],
          categories: defaultCategories,
          profile: {
            email: '',
            isRegistered: false,
            firstName: '',
            lastName: '',
            currency: 'USD',
            country: 'US',
            monthlyBudget: 0,
            language: 'en',
            householdMembers: [],
            paymentMethods: [],
            bankAccounts: [],
          },
          projects: [],
          expectedTransactions: [],
        });
      }
    }),
    {
      name: 'finance-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Custom hooks for accessing specific parts of the store
export const useTransactions = () => useFinanceStore((state) => state.transactions);
export const useCategories = () => useFinanceStore((state) => state.categories);
export const useProfile = () => useFinanceStore((state) => state.profile);
export const useProjects = () => useFinanceStore((state) => state.projects);
export const useExpectedTransactions = () => useFinanceStore((state) => state.expectedTransactions);
export const useHouseholdMembers = () => useFinanceStore((state) => state.profile.householdMembers);
export const usePaymentMethods = () => useFinanceStore((state) => state.profile.paymentMethods);
export const useBankAccounts = () => useFinanceStore((state) => state.profile.bankAccounts);