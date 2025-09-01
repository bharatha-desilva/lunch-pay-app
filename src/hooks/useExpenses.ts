import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expensesService } from '@/services/expenses.service';
import {
  CreateExpenseRequest,
  UpdateExpenseRequest,
  CreateSettlementRequest,
} from '@/types/expense.types';

/**
 * React Query hooks for expense management operations
 */

// Query keys for caching
export const expensesQueryKeys = {
  all: ['expenses'] as const,
  lists: () => [...expensesQueryKeys.all, 'list'] as const,
  list: (groupId: string, filters?: string) => 
    [...expensesQueryKeys.lists(), groupId, { filters }] as const,
  details: () => [...expensesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...expensesQueryKeys.details(), id] as const,
  balances: (groupId: string) => [...expensesQueryKeys.all, 'balances', groupId] as const,
  categories: ['expenses', 'categories'] as const,
  settlements: (groupId: string) => [...expensesQueryKeys.all, 'settlements', groupId] as const,
};

/**
 * Get expenses for a group
 */
export function useGroupExpenses(
  groupId: string,
  _params?: {
    page?: number;
    limit?: number;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }
) {
  return useQuery({
    queryKey: expensesQueryKeys.list(groupId, JSON.stringify(_params)),
    queryFn: () => expensesService.getGroupExpenses(groupId),
    enabled: !!groupId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get single expense by ID
 */
export function useExpense(id: string) {
  return useQuery({
    queryKey: expensesQueryKeys.detail(id),
    queryFn: () => expensesService.getExpenseById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get group balances
 */
export function useGroupBalances(groupId: string) {
  return useQuery({
    queryKey: expensesQueryKeys.balances(groupId),
    queryFn: () => expensesService.getGroupBalances(groupId),
    enabled: !!groupId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Get expense categories
 */
export function useExpenseCategories() {
  return useQuery({
    queryKey: expensesQueryKeys.categories,
    queryFn: () => expensesService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get group settlements
 */
export function useGroupSettlements(groupId: string) {
  return useQuery({
    queryKey: expensesQueryKeys.settlements(groupId),
    queryFn: () => expensesService.getGroupSettlements(groupId),
    enabled: !!groupId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Create new expense mutation
 */
export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseRequest) => expensesService.createExpense(data),
    onSuccess: (newExpense) => {
      // Invalidate and refetch expenses list for the group
      queryClient.invalidateQueries({ 
        queryKey: expensesQueryKeys.list(newExpense.groupId) 
      });
      
      // Invalidate balances for the group
      queryClient.invalidateQueries({ 
        queryKey: expensesQueryKeys.balances(newExpense.groupId) 
      });
      
      // Add the new expense to the cache
      queryClient.setQueryData(
        expensesQueryKeys.detail(newExpense.id),
        newExpense
      );
    },
  });
}

/**
 * Update expense mutation
 */
export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateExpenseRequest) => expensesService.updateExpense(data),
    onSuccess: (updatedExpense) => {
      // Update expense in cache
      queryClient.setQueryData(
        expensesQueryKeys.detail(updatedExpense.id),
        updatedExpense
      );
      
      // Invalidate expenses list for the group
      queryClient.invalidateQueries({ 
        queryKey: expensesQueryKeys.list(updatedExpense.groupId) 
      });
      
      // Invalidate balances for the group
      queryClient.invalidateQueries({ 
        queryKey: expensesQueryKeys.balances(updatedExpense.groupId) 
      });
    },
  });
}

/**
 * Delete expense mutation
 */
export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; groupId: string }) => 
      expensesService.deleteExpense(id),
    onSuccess: (_, { id, groupId }) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: expensesQueryKeys.detail(id) });
      
      // Invalidate expenses list for the group
      queryClient.invalidateQueries({ 
        queryKey: expensesQueryKeys.list(groupId) 
      });
      
      // Invalidate balances for the group
      queryClient.invalidateQueries({ 
        queryKey: expensesQueryKeys.balances(groupId) 
      });
    },
  });
}

/**
 * Create settlement mutation
 */
export function useCreateSettlement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSettlementRequest) => expensesService.createSettlement(data),
    onSuccess: (settlement) => {
      // Invalidate balances for the group
      queryClient.invalidateQueries({ 
        queryKey: expensesQueryKeys.balances(settlement.groupId) 
      });
      
      // Invalidate settlements for the group
      queryClient.invalidateQueries({ 
        queryKey: expensesQueryKeys.settlements(settlement.groupId) 
      });
    },
  });
}
