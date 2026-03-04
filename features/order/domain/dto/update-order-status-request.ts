import type { OrderStatus } from '../entities/order-status';

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  rejectionReason?: string;
}
