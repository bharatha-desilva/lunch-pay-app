import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BalanceSummary } from '@/components/balances/BalanceSummary';
import { BalanceList } from '@/components/balances/BalanceList';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useGroups } from '@/hooks/useGroups';
import { useCreateSettlement } from '@/hooks/useExpenses';

/**
 * Comprehensive expenses page for a specific group
 */
export function ExpensesPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [, setSelectedExpenseId] = useState<string | null>(null);

  const { data: groupsData, isLoading: groupsLoading } = useGroups();
  const createSettlementMutation = useCreateSettlement();

  if (!groupId) {
    navigate('/dashboard');
    return null;
  }

  if (groupsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading group..." />
      </div>
    );
  }

  const group = groupsData?.data?.find(g => g.id === groupId);

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Group not found</h2>
          <p className="text-muted-foreground mb-6">
            The group you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleSettleUp = async (fromUserId: string, toUserId: string, amount: number) => {
    try {
      await createSettlementMutation.mutateAsync({
        groupId: group.id,
        fromUserId,
        toUserId,
        amount,
        description: 'Settlement payment',
      });
    } catch (error) {
      console.error('Failed to create settlement:', error);
    }
  };

  const handleExpenseSuccess = () => {
    setShowExpenseForm(false);
    setSelectedExpenseId(null);
  };

  const handleEditExpense = (expenseId: string) => {
    setSelectedExpenseId(expenseId);
    setShowExpenseForm(true);
  };

  const handleDeleteExpense = (expenseId: string) => {
    // TODO: Implement expense deletion
    console.log('Delete expense:', expenseId);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{group.name}</h1>
            <p className="text-muted-foreground">
              {group.members?.length || 0} members • Manage expenses and balances
            </p>
          </div>
        </div>
        <Button onClick={() => setShowExpenseForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Balance Summary */}
      <div className="mb-8">
        <BalanceSummary groupId={groupId} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Expenses */}
        <div className="xl:col-span-2 space-y-6">
          {/* Add Expense Form */}
          {showExpenseForm && (
            <ExpenseForm
              group={group}
              onSuccess={handleExpenseSuccess}
              onCancel={() => {
                setShowExpenseForm(false);
                setSelectedExpenseId(null);
              }}
            />
          )}

          {/* Expense List */}
          <ExpenseList
            groupId={groupId}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        </div>

        {/* Right Column - Balances */}
        <div className="space-y-6">
          <BalanceList
            groupId={groupId}
            onSettleUp={handleSettleUp}
          />
        </div>
      </div>
    </div>
  );
}

export default ExpensesPage;
