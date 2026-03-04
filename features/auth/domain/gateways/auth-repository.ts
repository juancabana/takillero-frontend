import type { AuthToken } from '../entities/auth-token';
import type { LoginRequest } from '../dto/login-request';

export interface AuthRepository {
  login(data: LoginRequest): Promise<AuthToken>;
}
