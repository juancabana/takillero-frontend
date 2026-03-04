import type { PaymentMethod } from '../entities/order-status';

export interface CreateOrderRequest {
  customerName: string;
  customerCedula: string;
  customerPhone: string;
  customerAddress: string;
  customerBarrio: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  items: { productId: string; quantity: number }[];
}
