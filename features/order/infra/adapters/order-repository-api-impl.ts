import type { HttpGateway } from '@/shared/domain/gateways/http-gateway';
import type { OrderRepository } from '../../domain/gateways/order-repository';
import type { Order } from '../../domain/entities/order';
import type { CreateOrderRequest } from '../../domain/dto/create-order-request';
import type { UpdateOrderStatusRequest } from '../../domain/dto/update-order-status-request';
import { API_ENDPOINTS } from '@/constants/api';

export class OrderRepositoryApiImpl implements OrderRepository {
  constructor(private readonly http: HttpGateway) {}

  createOrder(data: CreateOrderRequest): Promise<Order> {
    return this.http.post<Order>(API_ENDPOINTS.ORDERS.CREATE, data);
  }

  getOrders(token: string): Promise<Order[]> {
    return this.http.get<Order[]>(API_ENDPOINTS.ORDERS.LIST, token);
  }

  getOrderByNumber(orderNumber: number): Promise<Order> {
    return this.http.get<Order>(API_ENDPOINTS.ORDERS.BY_NUMBER(orderNumber));
  }

  updateOrderStatus(id: string, data: UpdateOrderStatusRequest, token: string): Promise<Order> {
    return this.http.patch<Order>(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), data, token);
  }
}
