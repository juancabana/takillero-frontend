import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpAdapter } from '@/shared/infra/adapters/fetch-http-adapter';
import { OrderRepositoryApiImpl } from '../../infra/adapters/order-repository-api-impl';
import { orderKeys } from '../../infra/order-key-factory';
import type { CreateOrderRequest } from '../../domain/dto/create-order-request';
import type { UpdateOrderStatusRequest } from '../../domain/dto/update-order-status-request';

const repo = new OrderRepositoryApiImpl(httpAdapter);

export const useOrders = (token: string, options?: { refetchInterval?: number }) =>
  useQuery({
    queryKey: orderKeys.list(),
    queryFn: () => repo.getOrders(token),
    enabled: !!token,
    staleTime: 0,
    refetchInterval: options?.refetchInterval,
  });

export const useOrderByNumber = (orderNumber: number | null) =>
  useQuery({
    queryKey: orderKeys.byNumber(orderNumber ?? 0),
    queryFn: () => repo.getOrderByNumber(orderNumber!),
    enabled: orderNumber !== null && orderNumber > 0,
  });

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => repo.createOrder(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
      token,
    }: {
      id: string;
      data: UpdateOrderStatusRequest;
      token: string;
    }) => repo.updateOrderStatus(id, data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};
