import type { UserRole } from './user-role';

export interface UserAccount {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}
