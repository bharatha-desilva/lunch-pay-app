import { MoreHorizontal, Edit, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/components/shared/CurrencyInput';
import { getRelativeDateString } from '@/components/shared/DatePicker';
import { formatUserName } from '@/utils/formatters';
import { Expense } from '@/types/expense.types';
import { useAuth } from '@/hooks/useAuth';

interface ExpenseItemProps {
  expense: Expense;
  onEdit?: (expenseId: string) => void;
  onDelete?: (expenseId: string) => void;
  compact?: boolean;
}

/**
 * Individual expense item component
 */
export function ExpenseItem({ 
  expense, 
  onEdit, 
  onDelete, 
  compact = false 
}: ExpenseItemProps) {
  const { user } = useAuth();
  const isPaidByUser = expense.paidBy === user?.id;
  const userParticipant = expense.participants.find(p => p.userId === user?.id);
  const isUserInvolved = !!userParticipant;

  // Get category icon/color (simplified for MVP)
  const getCategoryIcon = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Food': '🍽️',
      'Transportation': '🚗',
      'Entertainment': '🎬',
      'Shopping': '🛒',
      'Utilities': '⚡',
      'Other': '📝',
    };
    return categoryMap[category] || '📝';
  };

  return (
    <div className={`flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
      compact ? 'p-3' : 'p-4'
    }`}>
      {/* Category Icon */}
      <div className={`flex-shrink-0 ${compact ? 'h-8 w-8' : 'h-12 w-12'} rounded-lg bg-primary/10 flex items-center justify-center`}>
        <span className={compact ? 'text-lg' : 'text-xl'}>
          {getCategoryIcon(expense.category)}
        </span>
      </div>

      {/* Expense Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h4 className={`font-medium truncate ${compact ? 'text-sm' : 'text-base'}`}>
              {expense.description}
            </h4>
            <div className={`flex items-center gap-2 text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
              <span>{expense.category}</span>
              <span>•</span>
              <span>{getRelativeDateString(expense.date)}</span>
              {!compact && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{expense.participants.length} people</span>
                  </div>
                </>
              )}
            </div>
            {!compact && (
              <p className="text-xs text-muted-foreground mt-1">
                Paid by {expense.paidByUser ? formatUserName(expense.paidByUser) : 'Unknown'}
                {isPaidByUser && ' (You)'}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="text-right ml-4">
            <div className={`font-bold ${compact ? 'text-sm' : 'text-lg'}`}>
              {formatCurrency(expense.amount)}
            </div>
            {isUserInvolved && userParticipant && (
              <div className={`${compact ? 'text-xs' : 'text-sm'} ${
                isPaidByUser 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {isPaidByUser 
                  ? `+${formatCurrency(expense.amount - userParticipant.amount)}`
                  : `-${formatCurrency(userParticipant.amount)}`
                }
              </div>
            )}
          </div>

          {/* Actions Menu */}
          {!compact && (onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(expense.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(expense.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Participants (non-compact only) */}
        {!compact && expense.participants.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Split:</span>
              {expense.splitType === 'equal' && (
                <span>Equal split among {expense.participants.length} people</span>
              )}
              {expense.splitType === 'unequal' && (
                <span>Custom amounts</span>
              )}
              {expense.splitType === 'percentage' && (
                <span>Percentage split</span>
              )}
            </div>
            {expense.participants.length <= 3 && (
              <div className="flex gap-2 mt-2">
                {expense.participants.map((participant) => (
                  <div 
                    key={participant.userId}
                    className="text-xs px-2 py-1 bg-muted rounded"
                  >
                    {participant.user ? formatUserName(participant.user) : 'Unknown'}: {formatCurrency(participant.amount)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Skeleton loading component for expense items
 */
export function ExpenseItemSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-4 border rounded-lg ${compact ? 'p-3' : 'p-4'}`}>
      <div className={`${compact ? 'h-8 w-8' : 'h-12 w-12'} bg-muted rounded-lg animate-pulse`} />
      <div className="flex-1 space-y-2">
        <div className={`${compact ? 'h-3' : 'h-4'} bg-muted rounded animate-pulse`} />
        <div className={`${compact ? 'h-2' : 'h-3'} bg-muted rounded w-2/3 animate-pulse`} />
        {!compact && (
          <div className="h-2 bg-muted rounded w-1/2 animate-pulse" />
        )}
      </div>
      <div className="space-y-2 text-right">
        <div className={`${compact ? 'h-3 w-12' : 'h-4 w-16'} bg-muted rounded animate-pulse`} />
        <div className={`${compact ? 'h-2 w-8' : 'h-3 w-12'} bg-muted rounded animate-pulse`} />
      </div>
    </div>
  );
}
