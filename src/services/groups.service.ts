import apiService, { groupApi } from './api';
import {
  Group,
  CreateGroupRequest,
  UpdateGroupRequest,
  AddMemberRequest,
  RemoveMemberRequest,
  GroupInvitation,
} from '@/types/group.types';
import { PaginatedResponse } from '@/types/api.types';

/**
 * Group management service for CRUD operations and member management
 */
class GroupsService {
  /**
   * Get all groups for current user
   */
  async getUserGroups(): Promise<PaginatedResponse<Group>> {
    return groupApi.getAll() as Promise<PaginatedResponse<Group>>;
  }

  /**
   * Get single group by ID with members
   */
  async getGroupById(id: string): Promise<Group> {
    return groupApi.getById(id) as Promise<Group>;
  }

  /**
   * Create new group
   */
  async createGroup(data: CreateGroupRequest): Promise<Group> {
    return groupApi.saveNew(data) as Promise<Group>;
  }

  /**
   * Update existing group
   */
  async updateGroup(data: UpdateGroupRequest): Promise<Group> {
    return groupApi.update(data) as Promise<Group>;
  }

  /**
   * Delete group (admin only)
   */
  async deleteGroup(id: string): Promise<void> {
    return groupApi.delete(id);
  }

  /**
   * Add member to group by email
   */
  async addMember(data: AddMemberRequest): Promise<Group> {
    return apiService.post<Group>(
      `/groups/${data.groupId}/members`,
      { email: data.email }
    );
  }

  /**
   * Remove member from group
   */
  async removeMember(data: RemoveMemberRequest): Promise<Group> {
    return apiService.delete<Group>(
      `/groups/${data.groupId}/members/${data.userId}`
    );
  }

  /**
   * Leave group (for non-admin members)
   */
  async leaveGroup(groupId: string): Promise<void> {
    return apiService.post<void>(`/groups/${groupId}/leave`);
  }

  /**
   * Get group invitations for current user
   */
  async getUserInvitations(): Promise<GroupInvitation[]> {
    return apiService.get<GroupInvitation[]>('/groups/invitations');
  }

  /**
   * Accept group invitation
   */
  async acceptInvitation(invitationId: string): Promise<Group> {
    return apiService.post<Group>(`/groups/invitations/${invitationId}/accept`);
  }

  /**
   * Decline group invitation
   */
  async declineInvitation(invitationId: string): Promise<void> {
    return apiService.post<void>(`/groups/invitations/${invitationId}/decline`);
  }

  /**
   * Search users by email for group invitations
   */
  async searchUsers(query: string): Promise<{ email: string; name: string }[]> {
    return apiService.get<{ email: string; name: string }[]>(
      '/users/search',
      { search: query }
    );
  }

  /**
   * Get group member statistics
   */
  async getGroupStats(groupId: string): Promise<{
    memberCount: number;
    totalExpenses: number;
    totalAmount: number;
  }> {
    return apiService.get<{
      memberCount: number;
      totalExpenses: number;
      totalAmount: number;
    }>(`/groups/${groupId}/stats`);
  }

  /**
   * Update member role (admin only)
   */
  async updateMemberRole(
    groupId: string,
    userId: string,
    role: 'admin' | 'member'
  ): Promise<Group> {
    return apiService.put<Group>(`/groups/${groupId}/members/${userId}/role`, {
      role,
    });
  }
}

// Export singleton instance
export const groupsService = new GroupsService();
export default groupsService;
