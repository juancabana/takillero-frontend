import { apiFetch } from './api.client';
import { API_ENDPOINTS } from '@/constants/api';
import type { AuthTokenResponse } from '@/types/auth.types';

export const authService = {
  login(password: string): Promise<AuthTokenResponse> {
    return apiFetch<AuthTokenResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  },
};
