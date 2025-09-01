import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Receipt } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { CurrencyInput, parseCurrency } from '@/components/shared/CurrencyInput';
import { DatePicker, getTodayISO } from '@/components/shared/DatePicker';
import { ParticipantSelector } from './ParticipantSelector';

import { useCreateExpense, useExpenseCategories } from '@/hooks/useExpenses';
import { useAuth } from '@/hooks/useAuth';
import { formatValidationError } from '@/utils/formatters';
import { Group } from '@/types/group.types';
import { CreateExpenseRequest } from '@/types/expense.types';

// Validation schema
const expenseSchema = z.object({
  amount: z.string()
    .min(1, 'Amount is required')
    .refine(val => {
      const parsed = parseCurrency(val);
      return parsed > 0;
    }, 'Amount must be greater than 0'),
  description: z.string()
    .min(1, 'Description is required')
    .min(3, 'Description must be at least 3 characters')
    .max(100, 'Description must be less than 100 characters'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  participants: z.array(z.string())
    .min(1, 'Please select at least one participant'),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  group: Group;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Form component for creating new expenses
 */
export function ExpenseForm({ group, onSuccess, onCancel }: ExpenseFormProps) {
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const createExpenseMutation = useCreateExpense();
  const { data: categories } = useExpenseCategories();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: '',
      description: '',
      category: '',
      date: getTodayISO().split('T')[0], // Format for date input
      participants: [],
    },
  });

  const selectedParticipants = watch('participants');

  // Auto-select current user as participant
  useEffect(() => {
    if (user && selectedParticipants.length === 0) {
      setValue('participants', [user.id]);
    }
  }, [user, selectedParticipants.length, setValue]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      setError(null);
      
      const expenseData: CreateExpenseRequest = {
        groupId: group.id,
        amount: parseCurrency(data.amount),
        description: data.description.trim(),
        category: data.category,
        paidBy: user!.id,
        participants: data.participants.map(userId => ({ userId })),
        splitType: 'equal',
        date: new Date(data.date).toISOString(),
      };

      await createExpenseMutation.mutateAsync(expenseData);
      reset();
      onSuccess?.();
    } catch (err) {
      setError(formatValidationError(err));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Add New Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Amount and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="amount"
                    placeholder="0.00"
                    error={!!errors.amount}
                    {...field}
                  />
                )}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What was this expense for?"
                className={errors.description ? 'border-destructive' : ''}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Category and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register('category')}
              >
                <option value="">Select category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? new Date(field.value).toISOString() : ''}
                    onChange={(date) => field.onChange(date)}
                    error={!!errors.date}
                  />
                )}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
          </div>

          {/* Participant Selection */}
          <div className="space-y-2">
            <Label>Participants</Label>
            <Controller
              name="participants"
              control={control}
              render={({ field }) => (
                <ParticipantSelector
                  members={group.members?.map(m => m.user) || []}
                  selectedParticipants={field.value}
                  onSelectionChange={field.onChange}
                />
              )}
            />
            {errors.participants && (
              <p className="text-sm text-destructive">{errors.participants.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || selectedParticipants.length === 0}
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </>
              )}
            </Button>
          </div>

          {/* Split Preview */}
          {selectedParticipants.length > 0 && watch('amount') && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">Split Preview</h4>
              <p className="text-sm text-muted-foreground">
                Each person pays: <span className="font-medium">
                  ${(parseCurrency(watch('amount')) / selectedParticipants.length).toFixed(2)}
                </span>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
