'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { CART_PAGE } from '@/constants/pages/cart';
import { COMMON_LABELS, DEFAULT_PRODUCT_IMAGE } from '@/constants/shared';
import { formatPrice } from '@/lib/format-price';
import { EmptyState } from '@/components/atoms';
import { OrderSummaryCard } from '@/components/molecules/OrderSummaryCard';
import { btn, card, layout, text } from '@/config/theme';

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
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className="bg-white rounded-2xl p-4 flex gap-4 border border-gray-100 shadow-sm"
                >
                  <img
                    src={item.product.imageUrl ?? DEFAULT_PRODUCT_IMAGE}
                    alt={item.product.name}
                    className="w-24 h-24 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-gray-900" style={{ fontWeight: 500 }}>{item.product.name}</h3>
                        <p className="text-orange-600" style={{ fontWeight: 600 }}>
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center text-gray-900" style={{ fontWeight: 600 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="text-gray-900" style={{ fontWeight: 700 }}>
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
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
