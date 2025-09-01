import { useState } from 'react';
import { Receipt, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ExpenseItem } from './ExpenseItem';
import { useGroupExpenses, useExpenseCategories } from '@/hooks/useExpenses';

interface ExpenseListProps {
  groupId: string;
  onEditExpense?: (expenseId: string) => void;
  onDeleteExpense?: (expenseId: string) => void;
}

/**
 * Component to display and filter group expenses
 */
export function ExpenseList({ 
  groupId, 
  onEditExpense, 
  onDeleteExpense 
}: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { 
    data: expensesData, 
    isLoading, 
    error 
  } = useGroupExpenses(groupId, {
    search: searchTerm,
    category: selectedCategory,
  });

  const { data: categories } = useExpenseCategories();

  const expenses = expensesData?.data || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Recent Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8">
            <LoadingSpinner size="lg" text="Loading expenses..." />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Recent Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive">Failed to load expenses</p>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Recent Expenses ({expenses.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Search and Filters */}
        {showFilters && (
          <div className="space-y-4 pt-4 border-t">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
              >
                All
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.name ? '' : category.name
                  )}
                >
                  {category.icon} {category.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            {expenses.length === 0 ? (
              <>
                <Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No expenses yet</h3>
                <p className="text-muted-foreground">
                  Start by adding your first expense to this group
                </p>
              </>
            ) : (
              <>
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No matching expenses</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="mt-4"
                >
                  Clear filters
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredExpenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                onEdit={onEditExpense}
                onDelete={onDeleteExpense}
              />
            ))}
            
            {filteredExpenses.length < expenses.length && (
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredExpenses.length} of {expenses.length} expenses
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Simplified expense list for smaller contexts
 */
export function SimpleExpenseList({ 
  groupId, 
  limit = 5 
}: { 
  groupId: string; 
  limit?: number;
}) {
  const { data: expensesData, isLoading } = useGroupExpenses(groupId, { limit });
  const expenses = expensesData?.data?.slice(0, limit) || [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="h-10 w-10 bg-muted rounded animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
            </div>
            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-6">
        <Receipt className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No expenses yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} compact />
      ))}
    </div>
  );
}
