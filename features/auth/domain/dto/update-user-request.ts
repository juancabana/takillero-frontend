import type { UserRole } from '../entities/user-role';

export interface UpdateUserRequest {
  password?: string;
  displayName?: string;
  role?: UserRole;
}
