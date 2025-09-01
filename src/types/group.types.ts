import { BaseEntity } from './api.types';
import { User } from './auth.types';

/**
 * Group management types and interfaces
 */

export interface Group extends BaseEntity {
  name: string;
  description?: string;
  adminId: string;
  members: GroupMember[];
  memberCount: number;
}

export interface GroupMember {
  userId: string;
  user: User;
  role: GroupRole;
  joinedAt: string;
}

export type GroupRole = 'admin' | 'member';

export interface CreateGroupRequest {
  name: string;
  description?: string;
  initialMembers?: string[]; // Array of user IDs or emails
}

export interface UpdateGroupRequest {
  id: string;
  name?: string;
  description?: string;
}

export interface AddMemberRequest {
  groupId: string;
  email: string;
}

export interface RemoveMemberRequest {
  groupId: string;
  userId: string;
}

export interface GroupInvitation extends BaseEntity {
  groupId: string;
  email: string;
  invitedBy: string;
  status: InvitationStatus;
  expiresAt: string;
}

export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';
