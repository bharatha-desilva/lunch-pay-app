import { useState } from 'react';
import { Check, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types/auth.types';
import { formatUserName } from '@/utils/formatters';
import { cn } from '@/utils/cn';

interface ParticipantSelectorProps {
  members: User[];
  selectedParticipants: string[];
  onSelectionChange: (participantIds: string[]) => void;
  className?: string;
}

/**
 * Component for selecting expense participants from group members
 */
export function ParticipantSelector({
  members,
  selectedParticipants,
  onSelectionChange,
  className,
}: ParticipantSelectorProps) {
  const [showAll, setShowAll] = useState(false);

  const toggleParticipant = (userId: string) => {
    const isSelected = selectedParticipants.includes(userId);
    
    if (isSelected) {
      onSelectionChange(selectedParticipants.filter(id => id !== userId));
    } else {
      onSelectionChange([...selectedParticipants, userId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedParticipants.length === members.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(members.map(member => member.id));
    }
  };

  const visibleMembers = showAll ? members : members.slice(0, 6);
  const hasMoreMembers = members.length > 6;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Select Participants ({selectedParticipants.length}/{members.length})
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleSelectAll}
          >
            {selectedParticipants.length === members.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {visibleMembers.map((member) => {
            const isSelected = selectedParticipants.includes(member.id);
            
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => toggleParticipant(member.id)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border transition-all text-left',
                  isSelected
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-background border-border hover:bg-muted'
                )}
              >
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    {formatUserName(member).charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {formatUserName(member)}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {member.email}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {isSelected && (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {hasMoreMembers && (
          <div className="mt-3 text-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : `Show ${members.length - 6} More`}
            </Button>
          </div>
        )}

        {selectedParticipants.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Please select at least one participant
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Simplified participant display for forms
 */
export function SelectedParticipants({
  members,
  selectedParticipants,
  className,
}: {
  members: User[];
  selectedParticipants: string[];
  className?: string;
}) {
  const selectedMembers = members.filter(member => 
    selectedParticipants.includes(member.id)
  );

  if (selectedMembers.length === 0) {
    return (
      <div className={cn('text-sm text-muted-foreground', className)}>
        No participants selected
      </div>
    );
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {selectedMembers.map((member) => (
        <div
          key={member.id}
          className="flex items-center gap-2 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
        >
          <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">
            {formatUserName(member).charAt(0).toUpperCase()}
          </div>
          {formatUserName(member)}
        </div>
      ))}
    </div>
  );
}
