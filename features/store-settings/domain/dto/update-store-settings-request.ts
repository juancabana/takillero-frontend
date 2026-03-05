import type { BankAccount, DeliveryZone, StoreSchedule } from '../entities/store-settings';

export type UpdateStoreSettingsRequest = Partial<{
  businessName: string;
  isOpen: boolean;
  deliveryEnabled: boolean;
  closedMessage: string | null;
  whatsappNumber: string | null;
  address: string | null;
  deliveryZones: DeliveryZone[];
  schedule: StoreSchedule[];
  bankAccounts: BankAccount[];
}>;
