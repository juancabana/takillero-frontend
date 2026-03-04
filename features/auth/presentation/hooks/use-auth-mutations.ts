import { useMutation } from '@tanstack/react-query';
import { httpAdapter } from '@/shared/infra/adapters/fetch-http-adapter';
import { AuthRepositoryApiImpl } from '../../infra/adapters/auth-repository-api-impl';

const repo = new AuthRepositoryApiImpl(httpAdapter);

export const useLogin = () =>
  useMutation({
    mutationFn: (password: string) => repo.login({ password }),
  });
