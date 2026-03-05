'use client';

import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { DEFAULT_PRODUCT_IMAGE } from '@/constants/shared';
import { formatPrice } from '@/lib/format-price';
import type { Product } from '@/features/product/domain/entities/product';

interface CartItemCardProps {
  product: Product;
  quantity: number;
  onRemove: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function CartItemCard({ product, quantity, onRemove, onIncrement, onDecrement }: CartItemCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className="bg-white rounded-2xl p-4 flex gap-4 border border-gray-100 shadow-sm"
    >
      <img
        src={product.imageUrl ?? DEFAULT_PRODUCT_IMAGE}
        alt={product.name}
        className="w-24 h-24 rounded-xl object-cover shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-gray-900" style={{ fontWeight: 500 }}>{product.name}</h3>
            <p className="text-orange-600" style={{ fontWeight: 600 }}>
              {formatPrice(product.price)}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-1">
            <button
              onClick={onDecrement}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center text-gray-900" style={{ fontWeight: 600 }}>
              {quantity}
            </span>
            <button
              onClick={onIncrement}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          <span className="text-gray-900" style={{ fontWeight: 700 }}>
            {formatPrice(product.price * quantity)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
