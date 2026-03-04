import type { HttpGateway } from '@/shared/domain/gateways/http-gateway';
import type { StoreSettingsRepository } from '../../domain/gateways/store-settings-repository';
import type { StoreSettings } from '../../domain/entities/store-settings';
import type { UpdateStoreSettingsRequest } from '../../domain/dto/update-store-settings-request';
import { API_ENDPOINTS } from '@/constants/api';

export class StoreSettingsRepositoryApiImpl implements StoreSettingsRepository {
  constructor(private readonly http: HttpGateway) {}

  getSettings(): Promise<StoreSettings> {
    return this.http.get<StoreSettings>(API_ENDPOINTS.STORE.SETTINGS);
  }

  updateSettings(data: UpdateStoreSettingsRequest, token: string): Promise<StoreSettings> {
    return this.http.patch<StoreSettings>(API_ENDPOINTS.STORE.SETTINGS, data, token);
  }
}
