export type OrderStatus =
  | 'pendiente'
  | 'confirmado'
  | 'rechazado'
  | 'pagado'
  | 'entregado';

export type PaymentMethod = 'efectivo' | 'transferencia';
export type PaymentStatus = 'pendiente' | 'pagado';

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

export interface CreateOrderPayload {
  customerName: string;
  customerCedula: string;
  customerPhone: string;
  customerAddress: string;
  customerBarrio: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}
