import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Layout } from '@/components/layout/Layout';
import { GroupList } from '@/components/groups/GroupList';
import { GroupForm } from '@/components/groups/GroupForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuth } from '@/hooks/useAuth';
import { formatUserName } from '@/utils/formatters';

/**
 * Main dashboard page showing user's groups and overview
 */
export function DashboardPage() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const { user } = useAuth();

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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button onClick={() => setShowCreateGroup(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
              <Button variant="outline" disabled>
                Add Expense
              </Button>
              <Button variant="outline" disabled>
                View Reports
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
    </Layout>
  );
}
