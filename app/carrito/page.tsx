'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { CART_PAGE } from '@/constants/pages/cart';
import { COMMON_LABELS } from '@/constants/shared';
import { EmptyState } from '@/components/atoms/EmptyState';
import { OrderSummaryCard } from '@/components/molecules/OrderSummaryCard';
import { CartItemCard } from '@/components/molecules/CartItemCard';
import { btn, layout } from '@/config/theme';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { settings } = useStore();

  if (items.length === 0) {
    return (
      <div className={layout.page}>
        <EmptyState
          icon={ShoppingBag}
          title={CART_PAGE.EMPTY_TITLE}
          description={CART_PAGE.EMPTY_DESCRIPTION}
          actionLabel={CART_PAGE.EMPTY_CTA}
          actionHref="/menu"
          actionIcon={ArrowLeft}
        />
      </div>
    );
  }

  const activeZones = settings?.deliveryZones?.filter((z) => z.active) ?? [];
  const domicilio = activeZones.length > 0
    ? Math.min(...activeZones.map((z) => z.fee))
    : 5000;
  const total = totalPrice + domicilio;

  return (
    <div className={layout.page}>
      <div className={`${layout.containerNarrow} py-8`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-gray-900" style={{ fontSize: '32px', fontWeight: 700 }}>
              {CART_PAGE.TITLE}
            </h1>
            <p className="text-gray-500">{items.length} producto(s)</p>
          </div>
          <Link
            href="/menu"
            className="text-orange-500 hover:text-orange-600 flex items-center gap-1"
          >
            <ArrowLeft size={18} /> {CART_PAGE.CONTINUE_SHOPPING}
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <CartItemCard
                  key={item.product.id}
                  product={item.product}
                  quantity={item.quantity}
                  onRemove={() => removeFromCart(item.product.id)}
                  onDecrement={() => updateQuantity(item.product.id, item.quantity - 1)}
                  onIncrement={() => updateQuantity(item.product.id, item.quantity + 1)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <OrderSummaryCard
              title={CART_PAGE.ORDER_SUMMARY}
              rows={[
                { label: COMMON_LABELS.SUBTOTAL, value: totalPrice },
                { label: CART_PAGE.DELIVERY_FROM, value: domicilio },
                { label: COMMON_LABELS.TOTAL, value: total, highlight: true },
              ]}
              sticky
              action={
                <Link
                  href="/checkout"
                  className={`w-full ${btn.base} ${btn.primary} gap-2 py-3.5 justify-center`}
                  style={{ fontWeight: 600 }}
                >
                  {CART_PAGE.PLACE_ORDER} <ArrowRight size={18} />
                </Link>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
