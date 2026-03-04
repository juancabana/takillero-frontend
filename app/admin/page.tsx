'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Package,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useOrders } from '@/features/order/presentation/hooks/use-order-queries';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
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
import { ADMIN_LAYOUT } from '@/constants/admin/layout';
import { PRODUCT_COUNT } from '@/constants/shared';
import { formatPrice } from '@/lib/format-price';
import { badge, card, text, btn } from '@/config/theme';

export default function AdminDashboardPage() {
  const { settings } = useStore();
  const { token } = useAuth();
  const [viewMode, setViewMode] = useState<'dia' | 'mes'>('dia');
  const { data: orders = [] } = useOrders(token ?? '');

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(today) && o.status !== 'rechazado');
  const todayTotal = todayOrders.reduce((s, o) => s + o.total, 0);

  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthOrders = orders.filter((o) => o.createdAt.startsWith(monthPrefix) && o.status !== 'rechazado');
  const monthTotal = monthOrders.reduce((s, o) => s + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pendiente');
  const confirmedOrders = orders.filter((o) => o.status === 'confirmado');
  const rejectedOrders = orders.filter((o) => o.status === 'rechazado');
  const paidOrders = orders.filter((o) => o.paymentStatus === 'pagado');
  const deliveredOrders = orders.filter((o) => o.status === 'entregado');

  const getLast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOrders = orders.filter(
        (o) => o.createdAt.startsWith(dateStr) && o.status !== 'rechazado',
      );
      data.push({
        name: date.toLocaleDateString('es-CO', { weekday: 'short' }),
        ventas: dayOrders.reduce((s, o) => s + o.total, 0),
        pedidos: dayOrders.length,
      });
    }
    return data;
  };

  const getLast6MonthsData = () => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const prefix = `${y}-${String(m).padStart(2, '0')}`;
      const mOrders = orders.filter((o) => o.createdAt.startsWith(prefix) && o.status !== 'rechazado');
      data.push({
        name: date.toLocaleDateString('es-CO', { month: 'short' }),
        ventas: mOrders.reduce((s, o) => s + o.total, 0),
        pedidos: mOrders.length,
      });
    }
    return data;
  };

  const chartData = viewMode === 'dia' ? getLast7DaysData() : getLast6MonthsData();

  const stats = [
    {
      label: ADMIN_DASHBOARD.SALES_TODAY,
      value: formatPrice(todayTotal),
      sub: PRODUCT_COUNT(todayOrders.length),
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: ADMIN_DASHBOARD.SALES_MONTH,
      value: formatPrice(monthTotal),
      sub: PRODUCT_COUNT(monthOrders.length),
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: ADMIN_DASHBOARD.PENDING,
      value: pendingOrders.length.toString(),
      sub: ADMIN_DASHBOARD.PENDING_DESCRIPTION,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: ADMIN_DASHBOARD.TOTAL_ORDERS,
      value: orders.length.toString(),
      sub: ADMIN_DASHBOARD.HISTORICAL,
      icon: ShoppingBag,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900" style={{ fontSize: '28px', fontWeight: 700 }}>
            {ADMIN_DASHBOARD.TITLE}
          </h1>
          <p className="text-gray-500" style={{ fontSize: '14px' }}>
            {ADMIN_DASHBOARD.SUBTITLE}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
            settings.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
          style={{ fontSize: '13px', fontWeight: 600 }}
        >
          <span className={`w-2 h-2 rounded-full ${settings.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
          {settings.isOpen ? ADMIN_LAYOUT.OPEN : ADMIN_LAYOUT.CLOSED}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500" style={{ fontSize: '13px' }}>
                {stat.label}
              </span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </div>
            <p className="text-gray-900" style={{ fontSize: '24px', fontWeight: 700 }}>
              {stat.value}
            </p>
            <p className="text-gray-400" style={{ fontSize: '12px' }}>
              {stat.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
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

      {/* Quick stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: ADMIN_DASHBOARD.CONFIRMED, count: confirmedOrders.length, icon: CheckCircle, color: 'text-green-500' },
          { label: ADMIN_DASHBOARD.REJECTED, count: rejectedOrders.length, icon: XCircle, color: 'text-red-500' },
          { label: ADMIN_DASHBOARD.PAID, count: paidOrders.length, icon: CreditCard, color: 'text-blue-500' },
          { label: ADMIN_DASHBOARD.DELIVERED, count: deliveredOrders.length, icon: Package, color: 'text-purple-500' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
            <s.icon size={20} className={s.color} />
            <div>
              <p className="text-gray-900" style={{ fontWeight: 600 }}>{s.count}</p>
              <p className="text-gray-400" style={{ fontSize: '12px' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent pending orders */}
      {pendingOrders.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-gray-900 mb-4" style={{ fontSize: '18px', fontWeight: 600 }}>
            {ADMIN_DASHBOARD.PENDING_ORDERS_TITLE}
          </h2>
          <div className="space-y-3">
            {pendingOrders.slice(0, 5).map((order) => (
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
      )}
    </div>
  );
}
