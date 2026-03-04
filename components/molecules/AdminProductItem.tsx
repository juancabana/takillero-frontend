'use client';

import React from 'react';
import { Pencil, EyeOff, Eye, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { Product } from '@/features/product/domain/entities/product';
import type { Category } from '@/features/category/domain/entities/category';
import { ADMIN_PRODUCTS } from '@/constants/admin/products';
import { DEFAULT_PRODUCT_IMAGE } from '@/constants/shared';
import { formatPrice } from '@/lib/format-price';

interface AdminProductItemProps {
  product: Product;
  categories: Category[];
  onEdit: () => void;
  onToggleAvailable: () => void;
  onDelete: () => void;
}

export function AdminProductItem({
  product,
  categories,
  onEdit,
  onToggleAvailable,
  onDelete,
}: AdminProductItemProps) {
  return (
    <motion.div
      layout
      className={`bg-white rounded-xl p-4 border transition-all ${
        product.isAvailable ? 'border-gray-100' : 'border-red-200 bg-red-50/30'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <img
            src={product.imageUrl ?? DEFAULT_PRODUCT_IMAGE}
            alt={product.name}
            className={`w-16 h-16 rounded-xl object-cover ${!product.isAvailable ? 'opacity-60' : ''}`}
          />
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
              <EyeOff size={16} className="text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-gray-900 truncate" style={{ fontWeight: 500 }}>
              {product.name}
            </h3>
            {!product.isAvailable && (
              <span
                className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-2 py-0.5 rounded-full"
                style={{ fontSize: '11px', fontWeight: 600 }}
              >
                {ADMIN_PRODUCTS.SOLD_OUT_BADGE}
              </span>
            )}
          </div>
          <p className="text-gray-400" style={{ fontSize: '13px' }}>
            {categories.find((c) => c.id === product.categoryId)?.name} -{' '}
            {formatPrice(product.price)}
          </p>
          <p className="text-gray-400 truncate mt-0.5" style={{ fontSize: '12px' }}>
            {product.description}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onEdit}
            className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors"
            title="Editar producto"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={onToggleAvailable}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              product.isAvailable
                ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                : 'bg-green-50 text-green-500 hover:bg-green-100'
            }`}
            title={product.isAvailable ? 'Marcar como agotado' : 'Marcar como disponible'}
          >
            {product.isAvailable ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>

          <button
            onClick={onDelete}
            className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
            title="Eliminar producto"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
