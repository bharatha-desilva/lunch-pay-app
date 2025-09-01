import { BaseEntity } from './api.types';
import { User } from './auth.types';

/**
 * Expense management types and interfaces
 */

export interface Expense extends BaseEntity {
  groupId: string;
  amount: number;
  description: string;
  category: string;
  paidBy: string;
  paidByUser?: User;
  participants: ExpenseParticipant[];
  splitType: SplitType;
  date: string;
  receiptUrl?: string;
}

export interface ExpenseParticipant {
  userId: string;
  user?: User;
  amount: number;
  percentage?: number;
}

export type SplitType = 'equal' | 'unequal' | 'percentage';

export interface CreateExpenseRequest {
  groupId: string;
  amount: number;
  description: string;
  category: string;
  paidBy: string;
  participants: CreateExpenseParticipant[];
  splitType: SplitType;
  date: string;
}

export interface CreateExpenseParticipant {
  userId: string;
  amount?: number;
  percentage?: number;
}

export interface UpdateExpenseRequest extends CreateExpenseRequest {
  id: string;
}

export interface ExpenseCategory extends BaseEntity {
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
}

export interface Balance {
  userId: string;
  user?: User;
  amount: number; // positive = owed to user, negative = user owes
  netBalance: number;
}

export interface GroupBalance {
  groupId: string;
  balances: Balance[];
  totalExpenses: number;
  memberCount: number;
}

export interface Settlement extends BaseEntity {
  groupId: string;
  fromUserId: string;
  fromUser?: User;
  toUserId: string;
  toUser?: User;
  amount: number;
  description?: string;
  status: SettlementStatus;
}

export type SettlementStatus = 'pending' | 'completed' | 'cancelled';

export interface CreateSettlementRequest {
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  description?: string;
}
