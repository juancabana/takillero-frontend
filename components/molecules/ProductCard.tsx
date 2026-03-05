'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '@/context/CartContext';
import { MENU_PAGE } from '@/constants/pages/menu';
import { DEFAULT_PRODUCT_IMAGE } from '@/constants/shared';
import { formatPrice } from '@/lib/format-price';
import { QuantityStepper } from '@/components/atoms/QuantityStepper';
import { btn, card } from '@/config/theme';
import type { Product } from '@/features/product/domain/entities/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, removeFromCart, updateQuantity, items } = useCart();
  const inCart = items.find((i) => i.product.id === product.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={card.hover + ' overflow-hidden'}
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl ?? DEFAULT_PRODUCT_IMAGE}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
          }}
        />
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full" style={{ fontSize: '13px', fontWeight: 600 }}>
              {MENU_PAGE.SOLD_OUT}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>{product.name}</h3>
        <p className="text-gray-500 mb-3" style={{ fontSize: '13px', lineHeight: 1.4 }}>
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-orange-600" style={{ fontSize: '18px', fontWeight: 700 }}>
            {formatPrice(product.price)}
          </span>

          {inCart ? (
            <QuantityStepper
              quantity={inCart.quantity}
              onDecrement={() =>
                inCart.quantity === 1
                  ? removeFromCart(product.id)
                  : updateQuantity(product.id, inCart.quantity - 1)
              }
              onIncrement={() => updateQuantity(product.id, inCart.quantity + 1)}
            />
          ) : (
            <button
              onClick={() => addToCart(product)}
              disabled={!product.isAvailable}
              className={`${btn.base} gap-1.5 px-4 py-2 ${
                product.isAvailable
                  ? btn.primary
                  : btn.disabled
              }`}
              style={{ fontWeight: 600, fontSize: '14px' }}
            >
              <Plus size={16} />
              {MENU_PAGE.ADD_TO_CART}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
