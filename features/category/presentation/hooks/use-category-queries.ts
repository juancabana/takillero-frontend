import { useQuery } from '@tanstack/react-query';
import { httpAdapter } from '@/shared/infra/adapters/fetch-http-adapter';
import { CategoryRepositoryApiImpl } from '../../infra/adapters/category-repository-api-impl';
import { categoryKeys } from '../../infra/category-key-factory';

const repo = new CategoryRepositoryApiImpl(httpAdapter);

export const useCategories = () =>
  useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => repo.getActiveCategories(),
    staleTime: 1000 * 60 * 60, // 60 min
  });
