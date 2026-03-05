import type { Order } from '../entities/order';
import type { CreateOrderRequest } from '../dto/create-order-request';
import type { UpdateOrderStatusRequest } from '../dto/update-order-status-request';

export interface OrderRepository {
  createOrder(data: CreateOrderRequest): Promise<Order>;
  createPosOrder(data: CreateOrderRequest, token: string): Promise<Order>;
  getOrders(token: string): Promise<Order[]>;
  getOrderByNumber(orderNumber: number): Promise<Order>;
  updateOrderStatus(id: string, data: UpdateOrderStatusRequest, token: string): Promise<Order>;
}
