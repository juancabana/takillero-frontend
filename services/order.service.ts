import { apiFetch } from './api.client';
import { API_ENDPOINTS } from '@/constants/api';
import type { Order, CreateOrderPayload } from '@/types/order.types';

export const orderService = {
  createOrder(payload: CreateOrderPayload): Promise<Order> {
    return apiFetch<Order>(API_ENDPOINTS.ORDERS.CREATE, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getOrders(token: string): Promise<Order[]> {
    return apiFetch<Order[]>(API_ENDPOINTS.ORDERS.LIST, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getOrderByNumber(orderNumber: number): Promise<Order> {
    return apiFetch<Order>(API_ENDPOINTS.ORDERS.BY_NUMBER(orderNumber));
  },

  updateOrderStatus(
    id: string,
    status: string,
    token: string,
    rejectionReason?: string,
  ): Promise<Order> {
    return apiFetch<Order>(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), {
      method: 'PATCH',
      body: JSON.stringify({ status, rejectionReason }),
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
