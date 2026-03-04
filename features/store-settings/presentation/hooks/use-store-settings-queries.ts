import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpAdapter } from '@/shared/infra/adapters/fetch-http-adapter';
import { StoreSettingsRepositoryApiImpl } from '../../infra/adapters/store-settings-repository-api-impl';
import { storeSettingsKeys } from '../../infra/store-settings-key-factory';
import type { UpdateStoreSettingsRequest } from '../../domain/dto/update-store-settings-request';

const repo = new StoreSettingsRepositoryApiImpl(httpAdapter);

export const useStoreSettings = () =>
  useQuery({
    queryKey: storeSettingsKeys.detail(),
    queryFn: () => repo.getSettings(),
    staleTime: 1000 * 60 * 60, // 15 min
  });

export const useUpdateStoreSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ data, token }: { data: UpdateStoreSettingsRequest; token: string }) =>
      repo.updateSettings(data, token),
    onSuccess: (updated) => {
      queryClient.setQueryData(storeSettingsKeys.detail(), updated);
    },
  });
};
