import { ArrowUpRight, ArrowDownLeft, CheckCircle, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { formatCurrency } from '@/components/shared/CurrencyInput';
import { formatUserName } from '@/utils/formatters';
import { useGroupBalances } from '@/hooks/useExpenses';
import { useAuth } from '@/hooks/useAuth';

interface BalanceListProps {
  groupId: string;
  onSettleUp?: (fromUserId: string, toUserId: string, amount: number) => void;
}

/**
 * Component to display individual balances between group members
 */
export function BalanceList({ groupId, onSettleUp }: BalanceListProps) {
  const { user } = useAuth();
  const { data: groupBalance, isLoading, error } = useGroupBalances(groupId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Member Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4">
            <LoadingSpinner size="lg" text="Loading balances..." />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !groupBalance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Member Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-destructive">
            Failed to load balance information
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentUserBalance = groupBalance.balances.find(
    (balance) => balance.userId === user?.id
  );

  // Sort balances: current user first, then by amount (highest to lowest)
  const sortedBalances = [...groupBalance.balances].sort((a, b) => {
    if (a.userId === user?.id) return -1;
    if (b.userId === user?.id) return 1;
    return b.amount - a.amount;
  });

  if (sortedBalances.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Member Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No balances yet</h3>
            <p className="text-muted-foreground">
              Add some expenses to see member balances
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Member Balances
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedBalances.map((balance) => {
          const isCurrentUser = balance.userId === user?.id;
          const isSettled = Math.abs(balance.amount) < 0.01;
          
          return (
            <div
              key={balance.userId}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                isCurrentUser 
                  ? 'bg-primary/5 border-primary/20' 
                  : 'bg-background border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {balance.user ? 
                      formatUserName(balance.user).charAt(0).toUpperCase() :
                      '?'
                    }
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {balance.user ? formatUserName(balance.user) : 'Unknown User'}
                    {isCurrentUser && (
                      <span className="text-xs text-muted-foreground ml-1">(You)</span>
                    )}
                  </p>
                  <div className="flex items-center gap-1">
                    {isSettled ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">Settled up</span>
                      </>
                    ) : balance.amount > 0 ? (
                      <>
                        <ArrowUpRight className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">
                          Gets back {formatCurrency(balance.amount)}
                        </span>
                      </>
                    ) : (
                      <>
                        <ArrowDownLeft className="h-3 w-3 text-red-600" />
                        <span className="text-xs text-red-600">
                          Owes {formatCurrency(Math.abs(balance.amount))}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    isSettled 
                      ? 'text-muted-foreground'
                      : balance.amount > 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {isSettled ? '—' : formatCurrency(Math.abs(balance.amount))}
                  </div>
                </div>

                {/* Settle up button */}
                {!isCurrentUser && !isSettled && onSettleUp && (
                  <div>
                    {currentUserBalance && currentUserBalance.amount > 0 && balance.amount < 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSettleUp(
                          balance.userId,
                          user!.id,
                          Math.min(
                            Math.abs(balance.amount),
                            currentUserBalance.amount
                          )
                        )}
                      >
                        Settle
                      </Button>
                    )}
                    {currentUserBalance && currentUserBalance.amount < 0 && balance.amount > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSettleUp(
                          user!.id,
                          balance.userId,
                          Math.min(
                            Math.abs(currentUserBalance.amount),
                            balance.amount
                          )
                        )}
                      >
                        Pay
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Summary */}
        <div className="pt-3 border-t">
          <div className="text-center text-sm text-muted-foreground">
            Total expenses: {formatCurrency(groupBalance.totalExpenses)} • 
            {' '}{groupBalance.balances.filter(b => Math.abs(b.amount) < 0.01).length} of {groupBalance.memberCount} settled
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
