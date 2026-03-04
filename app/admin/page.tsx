'use client';

import React from 'react';
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
import { useOrders } from '@/features/order/presentation/hooks/use-order-queries';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { ADMIN_DASHBOARD } from '@/constants/admin/dashboard';
import { ADMIN_LAYOUT } from '@/constants/admin/layout';
import { PRODUCT_COUNT } from '@/constants/shared';
import { formatPrice } from '@/lib/format-price';
import { DashboardStatsGrid } from '@/components/molecules/DashboardStatsGrid';
import { SalesChart } from '@/components/molecules/SalesChart';
import { QuickStatsRow } from '@/components/molecules/QuickStatsRow';
import { PendingOrdersList } from '@/components/molecules/PendingOrdersList';

export default function AdminDashboardPage() {
  const { settings } = useStore();
  const { token } = useAuth();
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

  const quickStats = [
    { label: ADMIN_DASHBOARD.CONFIRMED, count: confirmedOrders.length, icon: CheckCircle, color: 'text-green-500' },
    { label: ADMIN_DASHBOARD.REJECTED, count: rejectedOrders.length, icon: XCircle, color: 'text-red-500' },
    { label: ADMIN_DASHBOARD.PAID, count: paidOrders.length, icon: CreditCard, color: 'text-blue-500' },
    { label: ADMIN_DASHBOARD.DELIVERED, count: deliveredOrders.length, icon: Package, color: 'text-purple-500' },
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

      <DashboardStatsGrid stats={stats} />

      <SalesChart dailyData={getLast7DaysData()} monthlyData={getLast6MonthsData()} />

      <QuickStatsRow stats={quickStats} />

      <PendingOrdersList orders={pendingOrders} />
    </div>
  );
}
