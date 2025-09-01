import { useState } from 'react';
import { Plus, Receipt, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Layout } from '@/components/layout/Layout';
import { GroupList } from '@/components/groups/GroupList';
import { GroupForm } from '@/components/groups/GroupForm';
import { SimpleExpenseList } from '@/components/expenses/ExpenseList';
import { SimpleBalanceDisplay } from '@/components/balances/BalanceSummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuth } from '@/hooks/useAuth';
import { useGroups } from '@/hooks/useGroups';
import { formatUserName } from '@/utils/formatters';

/**
 * Main dashboard page showing user's groups and overview
 */
export function DashboardPage() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const { user } = useAuth();
  const { data: groupsData } = useGroups();
  const navigate = useNavigate();

  const groups = groupsData?.data || [];
  const hasGroups = groups.length > 0;

  const handleGroupCreated = () => {
    setShowCreateGroup(false);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back{user ? `, ${formatUserName(user)}` : ''}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your expense groups and track shared costs
          </p>
        </div>

        {hasGroups ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Groups and Quick Actions */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button onClick={() => setShowCreateGroup(true)} className="justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Group
                    </Button>
                    {groups[0] && (
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/groups/${groups[0].id}`)}
                        className="justify-start"
                      >
                        <Receipt className="h-4 w-4 mr-2" />
                        Add Expense
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Create Group Form */}
              {showCreateGroup && (
                <div className="max-w-md">
                  <GroupForm
                    onSuccess={handleGroupCreated}
                    onCancel={() => setShowCreateGroup(false)}
                  />
                </div>
              )}

              {/* Groups Section */}
              <GroupList onCreateGroup={() => setShowCreateGroup(true)} />
            </div>

            {/* Right Column - Recent Activity */}
            <div className="space-y-6">
              {/* Balance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Your Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <SimpleBalanceDisplay amount={0} size="lg" />
                    <p className="text-xs text-muted-foreground mt-2">
                      Overall balance across all groups
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Expenses */}
              {groups[0] && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="h-5 w-5" />
                      Recent Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleExpenseList groupId={groups[0].id} limit={3} />
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/groups/${groups[0].id}`)}
                        className="w-full"
                      >
                        View All Expenses
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Quick Actions for new users */}
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button onClick={() => setShowCreateGroup(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Group
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Create Group Form */}
            {showCreateGroup && (
              <div className="max-w-md">
                <GroupForm
                  onSuccess={handleGroupCreated}
                  onCancel={() => setShowCreateGroup(false)}
                />
              </div>
            )}

            {/* Groups Section */}
            <GroupList onCreateGroup={() => setShowCreateGroup(true)} />
          </div>
        )}
      </div>
    </Layout>
  );
}
