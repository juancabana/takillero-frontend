import type { HttpGateway } from '@/shared/domain/gateways/http-gateway';
import type { AuthRepository } from '../../domain/gateways/auth-repository';
import type { AuthToken } from '../../domain/entities/auth-token';
import type { LoginRequest } from '../../domain/dto/login-request';
import type { UserAccount } from '../../domain/entities/user-account';
import type { CreateUserRequest } from '../../domain/dto/create-user-request';
import type { UpdateUserRequest } from '../../domain/dto/update-user-request';
import { API_ENDPOINTS } from '@/constants/api';

export class AuthRepositoryApiImpl implements AuthRepository {
  constructor(private readonly http: HttpGateway) {}

  login(data: LoginRequest): Promise<AuthToken> {
    return this.http.post<AuthToken>(API_ENDPOINTS.AUTH.LOGIN, data);
  }

  getUsers(token: string): Promise<UserAccount[]> {
    return this.http.get<UserAccount[]>(API_ENDPOINTS.AUTH.USERS, token);
  }

  createUser(data: CreateUserRequest, token: string): Promise<UserAccount> {
    return this.http.post<UserAccount>(API_ENDPOINTS.AUTH.USERS, data, token);
  }

  updateUser(id: string, data: UpdateUserRequest, token: string): Promise<UserAccount> {
    return this.http.patch<UserAccount>(API_ENDPOINTS.AUTH.USER_BY_ID(id), data, token);
  }

  deleteUser(id: string, token: string): Promise<void> {
    return this.http.delete(API_ENDPOINTS.AUTH.USER_BY_ID(id), token);
  }
}
