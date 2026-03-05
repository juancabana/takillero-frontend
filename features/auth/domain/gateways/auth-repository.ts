import type { AuthToken } from '../entities/auth-token';
import type { LoginRequest } from '../dto/login-request';
import type { UserAccount } from '../entities/user-account';
import type { CreateUserRequest } from '../dto/create-user-request';
import type { UpdateUserRequest } from '../dto/update-user-request';

export interface AuthRepository {
  login(data: LoginRequest): Promise<AuthToken>;
  getUsers(token: string): Promise<UserAccount[]>;
  createUser(data: CreateUserRequest, token: string): Promise<UserAccount>;
  updateUser(id: string, data: UpdateUserRequest, token: string): Promise<UserAccount>;
  deleteUser(id: string, token: string): Promise<void>;
}
