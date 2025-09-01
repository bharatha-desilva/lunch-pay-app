import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsService } from '@/services/groups.service';
import {
  CreateGroupRequest,
  UpdateGroupRequest,
  AddMemberRequest,
  RemoveMemberRequest,
} from '@/types/group.types';

/**
 * React Query hooks for group management operations
 */

// Query keys for caching
export const groupsQueryKeys = {
  all: ['groups'] as const,
  lists: () => [...groupsQueryKeys.all, 'list'] as const,
  list: (filters: string) => [...groupsQueryKeys.lists(), { filters }] as const,
  details: () => [...groupsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...groupsQueryKeys.details(), id] as const,
  invitations: ['groups', 'invitations'] as const,
  stats: (id: string) => [...groupsQueryKeys.all, 'stats', id] as const,
};

/**
 * Get user's groups
 */
export function useGroups() {
  return useQuery({
    queryKey: groupsQueryKeys.lists(),
    queryFn: () => groupsService.getUserGroups(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get single group by ID
 */
export function useGroup(id: string) {
  return useQuery({
    queryKey: groupsQueryKeys.detail(id),
    queryFn: () => groupsService.getGroupById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get user's group invitations
 */
export function useGroupInvitations() {
  return useQuery({
    queryKey: groupsQueryKeys.invitations,
    queryFn: () => groupsService.getUserInvitations(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Get group statistics
 */
export function useGroupStats(id: string) {
  return useQuery({
    queryKey: groupsQueryKeys.stats(id),
    queryFn: () => groupsService.getGroupStats(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Create new group mutation
 */
export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroupRequest) => groupsService.createGroup(data),
    onSuccess: () => {
      // Invalidate and refetch groups list
      queryClient.invalidateQueries({ queryKey: groupsQueryKeys.lists() });
    },
  });
}

/**
 * Update group mutation
 */
export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateGroupRequest) => groupsService.updateGroup(data),
    onSuccess: (updatedGroup) => {
      // Update group in cache
      queryClient.setQueryData(
        groupsQueryKeys.detail(updatedGroup.id),
        updatedGroup
      );
      // Invalidate groups list to reflect changes
      queryClient.invalidateQueries({ queryKey: groupsQueryKeys.lists() });
    },
  });
}

/**
 * Delete group mutation
 */
export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => groupsService.deleteGroup(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: groupsQueryKeys.detail(deletedId) });
      // Invalidate groups list
      queryClient.invalidateQueries({ queryKey: groupsQueryKeys.lists() });
    },
  });
}

/**
 * Add member to group mutation
 */
export function useAddMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddMemberRequest) => groupsService.addMember(data),
    onSuccess: (updatedGroup) => {
      // Update group in cache
      queryClient.setQueryData(
        groupsQueryKeys.detail(updatedGroup.id),
        updatedGroup
      );
    },
  });
}

/**
 * Remove member from group mutation
 */
export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RemoveMemberRequest) => groupsService.removeMember(data),
    onSuccess: (updatedGroup) => {
      // Update group in cache
      queryClient.setQueryData(
        groupsQueryKeys.detail(updatedGroup.id),
        updatedGroup
      );
    },
  });
}

/**
 * Leave group mutation
 */
export function useLeaveGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => groupsService.leaveGroup(groupId),
    onSuccess: (_, groupId) => {
      // Remove group from cache
      queryClient.removeQueries({ queryKey: groupsQueryKeys.detail(groupId) });
      // Invalidate groups list
      queryClient.invalidateQueries({ queryKey: groupsQueryKeys.lists() });
    },
  });
}

/**
 * Accept invitation mutation
 */
export function useAcceptInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      groupsService.acceptInvitation(invitationId),
    onSuccess: () => {
      // Invalidate invitations and groups
      queryClient.invalidateQueries({ queryKey: groupsQueryKeys.invitations });
      queryClient.invalidateQueries({ queryKey: groupsQueryKeys.lists() });
    },
  });
}

/**
 * Decline invitation mutation
 */
export function useDeclineInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      groupsService.declineInvitation(invitationId),
    onSuccess: () => {
      // Invalidate invitations
      queryClient.invalidateQueries({ queryKey: groupsQueryKeys.invitations });
    },
  });
}
