import type { StoreSettings } from '../entities/store-settings';
import type { UpdateStoreSettingsRequest } from '../dto/update-store-settings-request';

export interface StoreSettingsRepository {
  getSettings(): Promise<StoreSettings>;
  updateSettings(data: UpdateStoreSettingsRequest, token: string): Promise<StoreSettings>;
}
