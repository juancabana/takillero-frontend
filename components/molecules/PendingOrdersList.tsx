'use client';

import React from 'react';
import { ADMIN_DASHBOARD } from '@/constants/admin/dashboard';
import { PRODUCT_COUNT } from '@/constants/shared';
import { formatPrice } from '@/lib/format-price';
import type { Order } from '@/features/order/domain/entities/order';

interface PendingOrdersListProps {
  orders: Order[];
}

export function PendingOrdersList({ orders }: PendingOrdersListProps) {
  if (orders.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h2 className="text-gray-900 mb-4" style={{ fontSize: '18px', fontWeight: 600 }}>
        {ADMIN_DASHBOARD.PENDING_ORDERS_TITLE}
      </h2>
      <div className="space-y-3">
        {orders.slice(0, 5).map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-100"
          >
            <div className="flex items-center gap-3">
              <span
                className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-lg"
                style={{ fontSize: '13px', fontWeight: 600 }}
              >
                #{order.orderNumber}
              </span>
              <div>
                <p className="text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>
                  {order.customerName}
                </p>
                <p className="text-gray-500" style={{ fontSize: '12px' }}>
                  {PRODUCT_COUNT(order.items.length)} - {formatPrice(order.total)}
                </p>
              </div>
            </div>
            <span className="text-gray-400" style={{ fontSize: '12px' }}>
              {new Date(order.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
