import type { OrderStatus, OrderType, PaymentMethod, PaymentStatus } from './order-status';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: number;
  orderType: OrderType;
  customerName: string;
  customerCedula: string;
  customerPhone: string;
  customerAddress: string;
  customerBarrio: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes: string | null;
  rejectionReason: string | null;
  items: OrderItem[];
  createdAt: string;
}
