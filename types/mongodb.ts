import { ObjectId } from 'mongodb';
import { Transaction, Category, UserProfile, RecurringDetails } from './finance';

/**
 * MongoDB Document Types
 * These types extend our application types with MongoDB specific fields
 */

export interface MongoDocument {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionDocument extends Omit<Transaction, 'id'>, MongoDocument {
  userId: ObjectId;
}

export interface CategoryDocument extends Omit<Category, 'id'>, MongoDocument {
  userId: ObjectId;
}

export interface UserProfileDocument extends UserProfile, MongoDocument {
  email: string;
  passwordHash?: string;
  authProvider?: 'local' | 'google' | 'apple';
  authProviderId?: string;
  isVerified: boolean;
  lastLogin?: Date;
}

export interface RecurringTransactionDocument extends MongoDocument {
  userId: ObjectId;
  amount: number;
  description: string;
  category: string;
  type: 'expense' | 'income';
  frequency: RecurringDetails['frequency'];
  startDate: Date;
  endDate?: Date;
  lastProcessed?: Date;
  nextProcessDate?: Date;
  isActive: boolean;
}

/**
 * MongoDB Schema Definitions
 * These represent the actual schema structure in MongoDB
 */

export const TransactionSchema = {
  userId: { type: ObjectId, required: true, index: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true, index: true },
  type: { type: String, enum: ['expense', 'income'], required: true },
  isRecurring: { type: Boolean, default: false },
  recurringDetails: {
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
    endDate: { type: Date }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

export const CategorySchema = {
  userId: { type: ObjectId, required: true, index: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
  icon: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

export const UserProfileSchema = {
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  currency: { type: String, required: true, default: 'USD' },
  monthlyBudget: { type: Number, required: true, default: 0 },
  passwordHash: { type: String },
  authProvider: { type: String, enum: ['local', 'google', 'apple'] },
  authProviderId: { type: String },
  isVerified: { type: Boolean, default: false },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

export const RecurringTransactionSchema = {
  userId: { type: ObjectId, required: true, index: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['expense', 'income'], required: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  lastProcessed: { type: Date },
  nextProcessDate: { type: Date, index: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

/**
 * Helper functions for converting between MongoDB documents and application models
 */

export function convertToAppTransaction(doc: TransactionDocument): Transaction {
  return {
    id: doc._id.toString(),
    amount: doc.amount,
    description: doc.description,
    category: doc.category,
    date: doc.date.toISOString(),
    type: doc.type,
    isRecurring: doc.isRecurring,
    recurringDetails: doc.recurringDetails
  };
}

export function convertToAppCategory(doc: CategoryDocument): Category {
  return {
    id: doc._id.toString(),
    name: doc.name,
    color: doc.color,
    icon: doc.icon
  };
}

export function convertToAppProfile(doc: UserProfileDocument): UserProfile {
  return {
    name: doc.name,
    currency: doc.currency,
    monthlyBudget: doc.monthlyBudget
  };
}