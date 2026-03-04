import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpAdapter } from '@/shared/infra/adapters/fetch-http-adapter';
import { ProductRepositoryApiImpl } from '../../infra/adapters/product-repository-api-impl';
import { productKeys } from '../../infra/product-key-factory';
import type { CreateProductRequest } from '../../domain/dto/create-product-request';
import type { UpdateProductRequest } from '../../domain/dto/update-product-request';

const repo = new ProductRepositoryApiImpl(httpAdapter);

export const useProducts = (categoryId?: string) =>
  useQuery({
    queryKey: productKeys.byCategory(categoryId),
    queryFn: () => repo.getProducts(categoryId),
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: CreateProductRequest; token: string }) =>
      repo.createProduct(data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, token }: { id: string; data: UpdateProductRequest; token: string }) =>
      repo.updateProduct(id, data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: string; token: string }) =>
      repo.deleteProduct(id, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

export const useToggleProductAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isAvailable, token }: { id: string; isAvailable: boolean; token: string }) =>
      repo.updateProduct(id, { isAvailable }, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};
