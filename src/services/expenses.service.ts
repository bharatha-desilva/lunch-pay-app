import apiService from './api';
import {
  Expense,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  ExpenseCategory,
  GroupBalance,
  Settlement,
  CreateSettlementRequest,
} from '@/types/expense.types';
import { PaginatedResponse } from '@/types/api.types';

/**
 * Expense management service for CRUD operations and balance calculations
 */
class ExpensesService {
  /**
   * Get all expenses for a group
   */
  async getGroupExpenses(
    groupId: string
    // Future: add filtering params when backend is integrated
    // params?: {
    //   page?: number;
    //   limit?: number;
    //   category?: string;
    //   dateFrom?: string;
    //   dateTo?: string;
    //   search?: string;
    // }
  ): Promise<PaginatedResponse<Expense>> {
    // Use real API endpoint for expenses
    return apiService.get<PaginatedResponse<Expense>>(`/expenses?groupId=${groupId}`);
  }

  /**
   * Get single expense by ID
   */
  async getExpenseById(id: string): Promise<Expense> {
    return apiService.get<Expense>(`/expenses/${id}`);
  }

  /**
   * Create new expense
   */
  async createExpense(data: CreateExpenseRequest): Promise<Expense> {
    // Calculate split amounts based on split type
    const calculatedParticipants = this.calculateSplit(
      data.amount,
      data.participants,
      data.splitType
    );

    const expenseData = {
      ...data,
      participants: calculatedParticipants,
    };

    return apiService.post<Expense>('/expenses', expenseData);
  }

  /**
   * Update existing expense
   */
  async updateExpense(data: UpdateExpenseRequest): Promise<Expense> {
    const calculatedParticipants = this.calculateSplit(
      data.amount,
      data.participants,
      data.splitType
    );

    const expenseData = {
      ...data,
      participants: calculatedParticipants,
    };

    return apiService.put<Expense>(`/expenses/${data.id}`, expenseData);
  }

  /**
   * Delete expense
   */
  async deleteExpense(id: string): Promise<void> {
    await apiService.delete(`/expenses/${id}`);
  }

  /**
   * Calculate split amounts based on split type
   */
  private calculateSplit(
    totalAmount: number,
    participants: CreateExpenseRequest['participants'],
    splitType: CreateExpenseRequest['splitType']
  ) {
    switch (splitType) {
      case 'equal':
        return this.calculateEqualSplit(totalAmount, participants);
      case 'unequal':
        return this.calculateUnequalSplit(participants);
      case 'percentage':
        return this.calculatePercentageSplit(totalAmount, participants);
      default:
        throw new Error(`Unsupported split type: ${splitType}`);
    }
  }

  /**
   * Calculate equal split among participants
   */
  private calculateEqualSplit(
    totalAmount: number,
    participants: CreateExpenseRequest['participants']
  ) {
    const perPersonAmount = totalAmount / participants.length;
    const roundedAmount = Math.round(perPersonAmount * 100) / 100;
    
    return participants.map((participant, index) => ({
      userId: participant.userId,
      amount: index === participants.length - 1 
        ? totalAmount - (roundedAmount * (participants.length - 1)) // Last person gets remainder
        : roundedAmount,
    }));
  }

  /**
   * Calculate unequal split with custom amounts
   */
  private calculateUnequalSplit(participants: CreateExpenseRequest['participants']) {
    return participants.map(participant => ({
      userId: participant.userId,
      amount: participant.amount || 0,
    }));
  }

  /**
   * Calculate percentage-based split
   */
  private calculatePercentageSplit(
    totalAmount: number,
    participants: CreateExpenseRequest['participants']
  ) {
    return participants.map(participant => ({
      userId: participant.userId,
      amount: Math.round((totalAmount * (participant.percentage || 0) / 100) * 100) / 100,
      percentage: participant.percentage,
    }));
  }

  /**
   * Get group balances
   */
  async getGroupBalances(groupId: string): Promise<GroupBalance> {
    return apiService.get<GroupBalance>(`/groups/${groupId}/balances`);
  }

  /**
   * Get expense categories
   */
  async getCategories(): Promise<ExpenseCategory[]> {
    const defaultCategories: ExpenseCategory[] = [
      {
        id: '1',
        name: 'Food',
        icon: '🍽️',
        color: '#ff6b6b',
        isDefault: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Transportation',
        icon: '🚗',
        color: '#4ecdc4',
        isDefault: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Entertainment',
        icon: '🎬',
        color: '#45b7d1',
        isDefault: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Shopping',
        icon: '🛒',
        color: '#96ceb4',
        isDefault: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'Utilities',
        icon: '⚡',
        color: '#ffeaa7',
        isDefault: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '6',
        name: 'Other',
        icon: '📝',
        color: '#dda0dd',
        isDefault: true,
        createdAt: new Date().toISOString(),
      },
    ];

    return defaultCategories;
  }

  /**
   * Create settlement
   */
  async createSettlement(data: CreateSettlementRequest): Promise<Settlement> {
    return apiService.post<Settlement>('/settlements', data);
  }

  /**
   * Get settlements for a group
   */
  async getGroupSettlements(groupId: string): Promise<Settlement[]> {
    return apiService.get<Settlement[]>(`/groups/${groupId}/settlements`);
  }
}

// Export singleton instance
export const expensesService = new ExpensesService();
export default expensesService;
