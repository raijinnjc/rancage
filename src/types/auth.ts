/**
 * RANCAGE Authentication & Authorization Types
 */

export type UserRole = 'PUBLIC' | 'GOVERNMENT' | 'ADMIN';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  agency?: string;
  token?: string;
  isAuthenticated: boolean;
}

export interface Permission {
  action: string;
  subject: string;
}

export interface RolePermissions {
  role: UserRole;
  allowedScreens: string[];
  permissions: Permission[];
}
