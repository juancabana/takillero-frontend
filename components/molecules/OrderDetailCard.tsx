'use client';

import React from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { ORDER_TRACKING_PAGE } from '@/constants/pages/order-tracking';
import { COMMON_LABELS, PAYMENT_METHODS } from '@/constants/shared';
import { formatPrice } from '@/lib/format-price';
import type { Order } from '@/features/order/domain/entities/order';

interface OrderDetailCardProps {
  order: Order;
}

export function OrderDetailCard({ order }: OrderDetailCardProps) {
  return (
    <div className="space-y-6">
      {/* Order number header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
        <p className="text-gray-500 mb-1" style={{ fontSize: '14px' }}>{ORDER_TRACKING_PAGE.ORDER_LABEL}</p>
        <div className="flex items-center justify-center gap-2">
          <p className="text-gray-900" style={{ fontSize: '36px', fontWeight: 700 }}>
            #{order.orderNumber}
          </p>
          <button
            onClick={() => {
              void navigator.clipboard.writeText(order.orderNumber.toString());
              toast.success(ORDER_TRACKING_PAGE.TOAST_NUMBER_COPIED);
            }}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Copy size={18} />
          </button>
        </div>
        <p className="text-gray-400" style={{ fontSize: '13px' }}>
          {new Date(order.createdAt).toLocaleString('es-CO')}
        </p>
      </div>

      {/* Order items */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-gray-900 mb-4" style={{ fontWeight: 600 }}>
          {ORDER_TRACKING_PAGE.ORDER_DETAIL_TITLE}
        </h3>
        <div className="space-y-2" style={{ fontSize: '14px' }}>
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between">
              <span className="text-gray-600">
                {item.quantity}x {item.name}
              </span>
              <span className="text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-2">
            <div className="flex justify-between text-gray-400">
              <span>{COMMON_LABELS.DELIVERY}</span>
              <span>{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-gray-900 mt-1" style={{ fontWeight: 700, fontSize: '18px' }}>
              <span>{COMMON_LABELS.TOTAL}</span>
              <span className="text-orange-600">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-600"
            style={{ fontSize: '13px' }}
          >
            {ORDER_TRACKING_PAGE.PAYMENT_PREFIX} {order.paymentMethod === 'efectivo' ? PAYMENT_METHODS.CASH_LABEL : PAYMENT_METHODS.TRANSFER_LABEL}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg ${
              order.paymentStatus === 'pagado'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
            style={{ fontSize: '13px' }}
          >
            {order.paymentStatus === 'pagado' ? ORDER_TRACKING_PAGE.PAYMENT_STATUS_PAID : ORDER_TRACKING_PAGE.PAYMENT_STATUS_PENDING}
          </span>
        </div>
      </div>
    </div>
  );
}
