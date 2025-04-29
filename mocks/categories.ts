import { Category } from '@/types/finance';
import { colors } from '@/constants/colors';

export const categoryColors = {
  food: '#FF9500',
  groceries: '#34C759',
  dining: '#FF2D55',
  utilities: '#5856D6',
  rent: '#AF52DE',
  transportation: '#007AFF',
  entertainment: '#FF3B30',
  shopping: '#5AC8FA',
  health: '#FF9500',
  education: '#4CD964',
  travel: '#FF2D55',
  personal: '#5856D6',
  other: '#8E8E93',
};

export const defaultCategories: Category[] = [
  {
    id: 'household',
    name: 'Household',
    color: categoryColors.rent,
    icon: 'home',
    subcategories: [
      { id: 'water', name: 'Water' },
      { id: 'gas', name: 'Gas' },
      { id: 'electricity', name: 'Electricity' },
      { id: 'taxes', name: 'Taxes' },
      { id: 'rent', name: 'Rent' },
      { id: 'internet', name: 'Internet' },
      { id: 'food', name: 'Food' },
      { id: 'phone', name: 'Phone' },
      { id: 'other', name: 'Other' }
    ]
  },
  {
    id: 'car',
    name: 'Car',
    color: categoryColors.transportation,
    icon: 'car',
    subcategories: [
      { id: 'carGas', name: 'Gas' },
      { id: 'carLoan', name: 'Car Loan' },
      { id: 'insurance', name: 'Insurance' },
      { id: 'other', name: 'Other' }
    ]
  },
  {
    id: 'children',
    name: 'Children',
    color: categoryColors.education,
    icon: 'baby',
    subcategories: [
      { id: 'school', name: 'School' },
      { id: 'sports', name: 'Sports' },
      { id: 'privateLessons', name: 'Private Lessons' },
      { id: 'pocketMoney', name: 'Pocket Money' },
      { id: 'other', name: 'Other' }
    ]
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    color: categoryColors.entertainment,
    icon: 'tv',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    color: categoryColors.shopping,
    icon: 'shopping-bag',
  },
  {
    id: 'health',
    name: 'Health',
    color: categoryColors.health,
    icon: 'heart',
  },
  {
    id: 'travel',
    name: 'Travel',
    color: categoryColors.travel,
    icon: 'plane',
  },
  {
    id: 'personal',
    name: 'Personal',
    color: categoryColors.personal,
    icon: 'user',
  },
  {
    id: 'other',
    name: 'Other',
    color: categoryColors.other,
    icon: 'more-horizontal',
  },
];