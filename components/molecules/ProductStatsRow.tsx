'use client';

import React from 'react';
import { ADMIN_PRODUCTS } from '@/constants/admin/products';

interface ProductStatsRowProps {
  total: number;
  active: number;
  disabled: number;
}

export function ProductStatsRow({ total, active, disabled }: ProductStatsRowProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
        <p className="text-gray-400" style={{ fontSize: '12px' }}>{ADMIN_PRODUCTS.STATS_TOTAL}</p>
        <p className="text-gray-900" style={{ fontSize: '24px', fontWeight: 700 }}>{total}</p>
      </div>
      <div className="bg-white rounded-xl p-3 border border-green-100 text-center">
        <p className="text-green-500" style={{ fontSize: '12px' }}>{ADMIN_PRODUCTS.STATS_AVAILABLE}</p>
        <p className="text-green-600" style={{ fontSize: '24px', fontWeight: 700 }}>{active}</p>
      </div>
      <div className="bg-white rounded-xl p-3 border border-red-100 text-center">
        <p className="text-red-400" style={{ fontSize: '12px' }}>{ADMIN_PRODUCTS.STATS_SOLD_OUT}</p>
        <p className="text-red-500" style={{ fontSize: '24px', fontWeight: 700 }}>{disabled}</p>
      </div>
    </div>
  );
}
