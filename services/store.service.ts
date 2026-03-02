import { apiFetch } from '@/services/api.client';
import { API_ENDPOINTS } from '@/constants/api';
import { StoreSettings } from '@/types/store.types';

export const storeService = {
  getSettings: (): Promise<StoreSettings> =>
    apiFetch<StoreSettings>(API_ENDPOINTS.STORE.SETTINGS),

  updateSettings: (partial: Partial<StoreSettings>, token: string): Promise<StoreSettings> =>
    apiFetch<StoreSettings>(API_ENDPOINTS.STORE.SETTINGS, {
      method: 'PATCH',
      body: JSON.stringify(partial),
      headers: { Authorization: `Bearer ${token}` },
    }),
};
