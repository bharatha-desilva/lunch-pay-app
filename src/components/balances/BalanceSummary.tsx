import { TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { formatCurrency } from '@/components/shared/CurrencyInput';
import { useGroupBalances } from '@/hooks/useExpenses';
import { useAuth } from '@/hooks/useAuth';

interface BalanceSummaryProps {
  groupId: string;
}

/**
 * Component to display balance summary for a group
 */
export function BalanceSummary({ groupId }: BalanceSummaryProps) {
  const { user } = useAuth();
  const { data: groupBalance, isLoading, error } = useGroupBalances(groupId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <LoadingSpinner size="sm" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !groupBalance) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive">Failed to load balance information</p>
        </CardContent>
      </Card>
    );
  }

  // Find current user's balance
  const userBalance = groupBalance.balances.find(
    (balance) => balance.userId === user?.id
  );
  const userAmount = userBalance?.amount || 0;

  // Calculate totals (for future use)
  // const totalOwed = groupBalance.balances
  //   .filter(b => b.amount > 0)
  //   .reduce((sum, b) => sum + b.amount, 0);
  
  // const totalOwing = groupBalance.balances
  //   .filter(b => b.amount < 0)
  //   .reduce((sum, b) => sum + Math.abs(b.amount), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Your Balance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Your Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {userAmount > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : userAmount < 0 ? (
              <TrendingDown className="h-4 w-4 text-red-600" />
            ) : (
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={`text-2xl font-bold ${
              userAmount > 0 
                ? 'text-green-600' 
                : userAmount < 0 
                ? 'text-red-600' 
                : 'text-muted-foreground'
            }`}>
              {formatCurrency(Math.abs(userAmount))}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {userAmount > 0 
              ? 'You are owed' 
              : userAmount < 0 
              ? 'You owe'
              : 'You are settled up'
            }
          </p>
        </CardContent>
      </Card>

      {/* Total Group Expenses */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(groupBalance.totalExpenses)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Across {groupBalance.memberCount} members
          </p>
        </CardContent>
      </Card>

      {/* Group Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Group Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="text-2xl font-bold text-purple-600">
              {groupBalance.balances.filter(b => Math.abs(b.amount) < 0.01).length}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Members settled up
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Simple balance display for smaller contexts
 */
export function SimpleBalanceDisplay({ 
  amount, 
  size = 'default' 
}: { 
  amount: number; 
  size?: 'sm' | 'default' | 'lg';
}) {
  const sizeClasses = {
    sm: 'text-sm',
    default: 'text-base',
    lg: 'text-lg font-semibold',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    default: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className="flex items-center gap-1">
      {amount > 0 ? (
        <TrendingUp className={`${iconSizes[size]} text-green-600`} />
      ) : amount < 0 ? (
        <TrendingDown className={`${iconSizes[size]} text-red-600`} />
      ) : (
        <DollarSign className={`${iconSizes[size]} text-muted-foreground`} />
      )}
      <span className={`${sizeClasses[size]} ${
        amount > 0 
          ? 'text-green-600' 
          : amount < 0 
          ? 'text-red-600' 
          : 'text-muted-foreground'
      }`}>
        {formatCurrency(Math.abs(amount))}
      </span>
    </div>
  );
}
