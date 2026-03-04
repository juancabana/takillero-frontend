import type { HttpGateway } from '@/shared/domain/gateways/http-gateway';
import type { AuthRepository } from '../../domain/gateways/auth-repository';
import type { AuthToken } from '../../domain/entities/auth-token';
import type { LoginRequest } from '../../domain/dto/login-request';
import { API_ENDPOINTS } from '@/constants/api';

export class AuthRepositoryApiImpl implements AuthRepository {
  constructor(private readonly http: HttpGateway) {}

  login(data: LoginRequest): Promise<AuthToken> {
    return this.http.post<AuthToken>(API_ENDPOINTS.AUTH.LOGIN, data);
  }
}
