import type { UserRole } from '../entities/user-role';

export interface CreateUserRequest {
  username: string;
  password: string;
  displayName: string;
  role: UserRole;
}
