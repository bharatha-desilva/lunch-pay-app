import { Link } from 'react-router-dom';
import { Users, ChevronRight, Calendar, User } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

import { useGroups } from '@/hooks/useGroups';
import { formatRelativeTime, formatUserName } from '@/utils/formatters';
import { useAuth } from '@/hooks/useAuth';
import { Group, GroupMember } from '@/types/group.types';

interface GroupListProps {
  onCreateGroup?: () => void;
}

/**
 * Component to display user's groups in a list format
 */
export function GroupList({ onCreateGroup }: GroupListProps) {
  const { data: groupsData, isLoading, error } = useGroups();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner size="lg" text="Loading groups..." />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive">Failed to load groups</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : 'An error occurred'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const groups = (groupsData?.data as Group[]) || [];

  if (groups.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first group to start splitting expenses with friends
          </p>
          {onCreateGroup && (
            <Button onClick={onCreateGroup}>
              <Users className="mr-2 h-4 w-4" />
              Create Your First Group
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Groups</h2>
        {onCreateGroup && (
          <Button onClick={onCreateGroup} size="sm">
            <Users className="mr-2 h-4 w-4" />
            New Group
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => {
          const isAdmin = group.adminId === user?.id;
          
          return (
            <Card key={group.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {group.name}
                    </CardTitle>
                    {group.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {group.description}
                      </p>
                    )}
                  </div>
                  {isAdmin && (
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md ml-2">
                      Admin
                    </span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="mr-2 h-4 w-4" />
                    <span>{group.memberCount} member{group.memberCount !== 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Created {formatRelativeTime(group.createdAt)}</span>
                  </div>

                  {group.members && group.members.length > 0 && (
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {group.members.slice(0, 3).map((member: GroupMember) => (
                          <div
                            key={member.userId}
                            className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium border-2 border-background"
                            title={formatUserName(member.user)}
                          >
                            {formatUserName(member.user).charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {group.members.length > 3 && (
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                            +{group.members.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <Link to={`/groups/${group.id}`} className="block">
                    <Button variant="outline" className="w-full mt-3">
                      View Group
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
