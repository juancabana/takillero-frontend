'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { CHECKOUT_PAGE } from '@/constants/pages/checkout';
import { COMMON_LABELS, DEFAULT_PRODUCT_IMAGE } from '@/constants/shared';
import { formatPrice } from '@/lib/format-price';
import type { CartItem } from '@/context/CartContext';

interface CheckoutSidebarProps {
  items: CartItem[];
  totalPrice: number;
  deliveryFee: number;
  total: number;
  whatsapp: string;
}

export function CheckoutSidebar({
  items,
  totalPrice,
  deliveryFee,
  total,
  whatsapp,
}: CheckoutSidebarProps) {
  return (
    <div className="lg:col-span-1 hidden lg:block">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
        <h3 className="text-gray-900 mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
          {CHECKOUT_PAGE.SIDEBAR_TITLE} ({items.length})
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                <img
                  src={item.product.imageUrl ?? DEFAULT_PRODUCT_IMAGE}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 truncate" style={{ fontSize: '14px' }}>{item.product.name}</p>
                <p className="text-gray-500" style={{ fontSize: '13px' }}>{item.quantity}x {formatPrice(item.product.price)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4">
          <div className="flex justify-between text-gray-500 mb-1" style={{ fontSize: '14px' }}>
            <span>{COMMON_LABELS.SUBTOTAL}</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-gray-500 mb-2" style={{ fontSize: '14px' }}>
            <span>{COMMON_LABELS.DELIVERY}</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-gray-900" style={{ fontWeight: 700, fontSize: '18px' }}>
            <span>{COMMON_LABELS.TOTAL}</span>
            <span className="text-orange-600">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100">
          <div className="flex items-center gap-2 text-green-700 mb-1" style={{ fontWeight: 600, fontSize: '14px' }}>
            <MessageCircle size={16} />
            {CHECKOUT_PAGE.SIDEBAR_WHATSAPP_TITLE}
          </div>
          <p className="text-green-600" style={{ fontSize: '13px' }}>
            +{whatsapp.startsWith('57') ? `57 ${whatsapp.slice(2)}` : whatsapp}
          </p>
          <p className="text-green-500 mt-1" style={{ fontSize: '12px' }}>
            {CHECKOUT_PAGE.SIDEBAR_MANUAL_CONFIRM}
          </p>
        </div>
      </div>
    </div>
  );
}
