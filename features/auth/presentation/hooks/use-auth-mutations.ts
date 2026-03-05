import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpAdapter } from '@/shared/infra/adapters/fetch-http-adapter';
import { AuthRepositoryApiImpl } from '../../infra/adapters/auth-repository-api-impl';
import { authKeys } from '../../infra/auth-key-factory';
import type { LoginRequest } from '../../domain/dto/login-request';
import type { CreateUserRequest } from '../../domain/dto/create-user-request';
import type { UpdateUserRequest } from '../../domain/dto/update-user-request';

const repo = new AuthRepositoryApiImpl(httpAdapter);

export const useLogin = () =>
  useMutation({
    mutationFn: (data: LoginRequest) => repo.login(data),
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: CreateUserRequest; token: string }) =>
      repo.createUser(data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.users() });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, token }: { id: string; data: UpdateUserRequest; token: string }) =>
      repo.updateUser(id, data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.users() });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: string; token: string }) =>
      repo.deleteUser(id, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.users() });
    },
  });
};
