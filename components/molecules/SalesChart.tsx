'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ADMIN_DASHBOARD } from '@/constants/admin/dashboard';
import { formatPrice } from '@/lib/format-price';

interface ChartDataPoint {
  name: string;
  ventas: number;
  pedidos: number;
}

interface SalesChartProps {
  dailyData: ChartDataPoint[];
  monthlyData: ChartDataPoint[];
}

export function SalesChart({ dailyData, monthlyData }: SalesChartProps) {
  const [viewMode, setViewMode] = useState<'dia' | 'mes'>('dia');
  const chartData = viewMode === 'dia' ? dailyData : monthlyData;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900" style={{ fontSize: '18px', fontWeight: 600 }}>
          {ADMIN_DASHBOARD.SALES_SUMMARY_TITLE}
        </h2>
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode('dia')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              viewMode === 'dia' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
            style={{ fontSize: '13px', fontWeight: 500 }}
          >
            {ADMIN_DASHBOARD.VIEW_BY_DAY}
          </button>
          <button
            onClick={() => setViewMode('mes')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              viewMode === 'mes' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
            style={{ fontSize: '13px', fontWeight: 500 }}
          >
            {ADMIN_DASHBOARD.VIEW_BY_MONTH}
          </button>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number | undefined) => (value != null ? formatPrice(value) : '')}
              labelStyle={{ fontWeight: 600 }}
              contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
            />
            <Bar dataKey="ventas" fill="#f97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
