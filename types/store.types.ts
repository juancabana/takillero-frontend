export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  active: boolean;
}

export interface StoreSettings {
  id: string;
  businessName: string;
  isOpen: boolean;
  closedMessage: string | null;
  whatsappNumber: string | null;
  deliveryZones: DeliveryZone[];
}
