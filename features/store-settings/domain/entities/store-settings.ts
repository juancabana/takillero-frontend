export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  active: boolean;
}

export interface StoreSchedule {
  days: string;
  open: string;
  close: string;
  enabled?: boolean;
}

export interface StoreSettings {
  id: string;
  businessName: string;
  isOpen: boolean;
  deliveryEnabled: boolean;
  closedMessage: string | null;
  whatsappNumber: string | null;
  address: string | null;
  deliveryZones: DeliveryZone[];
  schedule: StoreSchedule[];
}
