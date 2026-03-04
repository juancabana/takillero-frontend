'use client';

import React, { useState } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Package,
  Search,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOrders, useUpdateOrderStatus } from '@/features/order/presentation/hooks/use-order-queries';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import type { Order } from '@/features/order/domain/entities/order';
import type { OrderStatus } from '@/features/order/domain/entities/order-status';
import { ADMIN_ORDERS } from '@/constants/admin/orders';
import { COMMON_LABELS, CUSTOMER_LABELS, PAYMENT_METHODS, PRODUCT_COUNT } from '@/constants/shared';
import { formatPrice } from '@/lib/format-price';
import { SearchInput } from '@/components/atoms';
import { btn, card, badge, layout, text, input as inputTokens } from '@/config/theme';

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pendiente: { label: ADMIN_ORDERS.STATUS_PENDING, color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  confirmado: { label: ADMIN_ORDERS.STATUS_CONFIRMED, color: 'text-blue-700', bg: 'bg-blue-100', icon: CheckCircle },
  rechazado: { label: ADMIN_ORDERS.STATUS_REJECTED, color: 'text-red-700', bg: 'bg-red-100', icon: XCircle },
  pagado: { label: ADMIN_ORDERS.STATUS_PAID, color: 'text-green-700', bg: 'bg-green-100', icon: CreditCard },
  entregado: { label: ADMIN_ORDERS.STATUS_DELIVERED, color: 'text-purple-700', bg: 'bg-purple-100', icon: Package },
};

export default function AdminPedidosPage() {
  const { token } = useAuth();
  const { data: orders = [] } = useOrders(token ?? '', { refetchInterval: 30_000 });
  const updateStatusMutation = useUpdateOrderStatus();

  const [filter, setFilter] = useState<'todos' | OrderStatus>('todos');
  const [search, setSearch] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingOrder, setRejectingOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchFilter = filter === 'todos' || o.status === filter;
    const matchSearch =
      search === '' ||
      o.orderNumber.toString().includes(search) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    return matchFilter && matchSearch;
  });

  const updateStatus = async (id: string, status: OrderStatus, rejectionReason?: string) => {
    if (!token) return;
    try {
      await updateStatusMutation.mutateAsync({ id, data: { status, rejectionReason }, token });
    } catch {
      toast.error(ADMIN_ORDERS.TOAST_UPDATE_ERROR);
    }
  };

  const handleConfirm = async (order: Order) => {
    await updateStatus(order.id, 'confirmado');
    toast.success(`Pedido #${order.orderNumber} confirmado`);
    const msg = encodeURIComponent(
      `Hola ${order.customerName}! Tu pedido #${order.orderNumber} ha sido *CONFIRMADO*. Estamos preparandolo. Total: ${formatPrice(order.total)}. Forma de pago: ${order.paymentMethod === 'efectivo' ? PAYMENT_METHODS.CASH_LABEL : PAYMENT_METHODS.TRANSFER_LABEL}. Gracias por tu compra!`,
    );
    window.open(`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${msg}`, '_blank');
  };

  const handleReject = async (orderId: string) => {
    if (!rejectReason.trim()) {
      toast.error(ADMIN_ORDERS.TOAST_REJECTION_REASON_REQUIRED);
      return;
    }
    const order = orders.find((o) => o.id === orderId);
    await updateStatus(orderId, 'rechazado', rejectReason);
    if (order) {
      const msg = encodeURIComponent(
        `Hola ${order.customerName}. Lamentablemente tu pedido #${order.orderNumber} no pudo ser procesado. Razon: ${rejectReason}. Disculpa las molestias!`,
      );
      window.open(`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${msg}`, '_blank');
    }
    toast.info(ADMIN_ORDERS.TOAST_REJECTED);
    setRejectingOrder(null);
    setRejectReason('');
  };

  const handleMarkPaid = async (order: Order) => {
    await updateStatus(order.id, 'pagado');
    toast.success(`Pedido #${order.orderNumber} marcado como pagado`);
  };

  const handleMarkDelivered = async (order: Order) => {
    await updateStatus(order.id, 'entregado');
    toast.success(`Pedido #${order.orderNumber} entregado`);
  };

  const filterButtons: { value: 'todos' | OrderStatus; label: string }[] = [
    { value: 'todos', label: ADMIN_ORDERS.FILTER_ALL },
    { value: 'pendiente', label: ADMIN_ORDERS.FILTER_PENDING },
    { value: 'confirmado', label: ADMIN_ORDERS.FILTER_CONFIRMED },
    { value: 'pagado', label: ADMIN_ORDERS.FILTER_PAID },
    { value: 'entregado', label: ADMIN_ORDERS.FILTER_DELIVERED },
    { value: 'rechazado', label: ADMIN_ORDERS.FILTER_REJECTED },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900" style={{ fontSize: '28px', fontWeight: 700 }}>
          Gestion de Pedidos
        </h1>
        <p className="text-gray-500" style={{ fontSize: '14px' }}>
          Administra y gestiona los pedidos entrantes
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={ADMIN_ORDERS.SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 overflow-x-auto">
          {filterButtons.map((fb) => (
            <button
              key={fb.value}
              onClick={() => setFilter(fb.value)}
              className={`shrink-0 px-3 py-1.5 rounded-lg transition-all ${
                filter === fb.value ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
              style={{ fontSize: '13px', fontWeight: 500 }}
            >
              {fb.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Filter size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">{ADMIN_ORDERS.NO_ORDERS}</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const sc = statusConfig[order.status];
            const isExpanded = expandedOrder === order.id;

            return (
              <motion.div
                key={order.id}
                layout
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Order header */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="bg-gray-900 text-white px-3 py-1 rounded-lg"
                      style={{ fontSize: '14px', fontWeight: 700 }}
                    >
                      #{order.orderNumber}
                    </span>
                    <div className="text-left">
                      <p className="text-gray-900" style={{ fontWeight: 500 }}>
                        {order.customerName}
                      </p>
                      <p className="text-gray-400" style={{ fontSize: '12px' }}>
                        {new Date(order.createdAt).toLocaleString('es-CO', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' - '}
                        {PRODUCT_COUNT(order.items.length)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-900" style={{ fontWeight: 600 }}>
                      {formatPrice(order.total)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${sc.bg} ${sc.color}`}
                      style={{ fontSize: '12px', fontWeight: 600 }}
                    >
                      <sc.icon size={14} />
                      {sc.label}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={18} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                        <div className="grid sm:grid-cols-2 gap-6">
                          {/* Customer info */}
                          <div>
                            <h4
                              className="text-gray-500 mb-2"
                              style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                            >
                              {ADMIN_ORDERS.CUSTOMER_DATA_TITLE}
                            </h4>
                            <div className="space-y-1" style={{ fontSize: '14px' }}>
                              <p><span className="text-gray-400">{CUSTOMER_LABELS.NAME}</span> {order.customerName}</p>
                              <p><span className="text-gray-400">{CUSTOMER_LABELS.CEDULA}</span> {order.customerCedula}</p>
                              <p><span className="text-gray-400">{CUSTOMER_LABELS.PHONE}</span> {order.customerPhone}</p>
                              <p><span className="text-gray-400">{CUSTOMER_LABELS.ADDRESS}</span> {order.customerAddress}</p>
                              <p><span className="text-gray-400">{CUSTOMER_LABELS.NEIGHBORHOOD}</span> {order.customerBarrio}</p>
                            </div>
                          </div>

                          {/* Order items */}
                          <div>
                            <h4
                              className="text-gray-500 mb-2"
                              style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                            >
                              {ADMIN_ORDERS.PRODUCTS_TITLE}
                            </h4>
                            <div className="space-y-1" style={{ fontSize: '14px' }}>
                              {order.items.map((item) => (
                                <div key={item.productId} className="flex justify-between">
                                  <span>{item.quantity}x {item.name}</span>
                                  <span className="text-gray-500">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                              ))}
                              <div className="border-t border-gray-100 pt-1 mt-1">
                                <div className="flex justify-between text-gray-400">
                                  <span>{COMMON_LABELS.DELIVERY}</span>
                                  <span>{formatPrice(order.deliveryFee)}</span>
                                </div>
                                <div className="flex justify-between text-gray-900" style={{ fontWeight: 600 }}>
                                  <span>{COMMON_LABELS.TOTAL}</span>
                                  <span>{formatPrice(order.total)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Payment & notes */}
                        <div className="mt-4 flex flex-wrap gap-3">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-600" style={{ fontSize: '13px' }}>
                            Pago: {order.paymentMethod === 'efectivo' ? PAYMENT_METHODS.CASH_LABEL : PAYMENT_METHODS.TRANSFER_LABEL}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg ${
                              order.paymentStatus === 'pagado'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                            style={{ fontSize: '13px' }}
                          >
                            {order.paymentStatus === 'pagado' ? COMMON_LABELS.PAID : COMMON_LABELS.PAYMENT_PENDING}
                          </span>
                        </div>

                        {order.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-xl" style={{ fontSize: '14px' }}>
                            <span className="text-gray-400">{ADMIN_ORDERS.NOTES_PREFIX}</span>
                            <span className="text-gray-700">{order.notes}</span>
                          </div>
                        )}

                        {order.rejectionReason && (
                          <div className="mt-3 p-3 bg-red-50 rounded-xl text-red-700" style={{ fontSize: '14px' }}>
                            <span className="text-red-500">{ADMIN_ORDERS.REJECTION_REASON_PREFIX}</span>
                            {order.rejectionReason}
                          </div>
                        )}

                        {/* Reject form */}
                        {rejectingOrder === order.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 p-4 bg-red-50 rounded-xl border border-red-100"
                          >
                            <p className="text-red-700 mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                              {ADMIN_ORDERS.REJECTION_FORM_LABEL}
                            </p>
                            <input
                              type="text"
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder={ADMIN_ORDERS.REJECTION_PLACEHOLDER}
                              className="w-full px-3 py-2 bg-white border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 mb-2"
                              style={{ fontSize: '14px' }}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => void handleReject(order.id)}
                                className="px-4 py-1.5 bg-red-500 text-white rounded-lg"
                                style={{ fontSize: '13px', fontWeight: 600 }}
                              >
                                {ADMIN_ORDERS.CONFIRM_REJECTION}
                              </button>
                              <button
                                onClick={() => { setRejectingOrder(null); setRejectReason(''); }}
                                className="px-4 py-1.5 text-gray-500"
                                style={{ fontSize: '13px' }}
                              >
                                {COMMON_LABELS.CANCEL}
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {/* Actions */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {order.status === 'pendiente' && (
                            <>
                              <button
                                onClick={() => void handleConfirm(order)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all"
                                style={{ fontSize: '13px', fontWeight: 600 }}
                              >
                                <CheckCircle size={16} /> {ADMIN_ORDERS.ACTION_CONFIRM}
                              </button>
                              <button
                                onClick={() => setRejectingOrder(order.id)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all"
                                style={{ fontSize: '13px', fontWeight: 600 }}
                              >
                                <XCircle size={16} /> {ADMIN_ORDERS.ACTION_REJECT}
                              </button>
                            </>
                          )}

                          {(order.status === 'confirmado' || order.status === 'pendiente') &&
                            order.paymentStatus !== 'pagado' && (
                              <button
                                onClick={() => void handleMarkPaid(order)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all"
                                style={{ fontSize: '13px', fontWeight: 600 }}
                              >
                                <CreditCard size={16} /> {ADMIN_ORDERS.ACTION_MARK_PAID}
                              </button>
                            )}

                          {(order.status === 'confirmado' || order.status === 'pagado') && (
                            <button
                              onClick={() => void handleMarkDelivered(order)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all"
                              style={{ fontSize: '13px', fontWeight: 600 }}
                            >
                              <Package size={16} /> {ADMIN_ORDERS.ACTION_MARK_DELIVERED}
                            </button>
                          )}

                          <a
                            href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl transition-all"
                            style={{ fontSize: '13px', fontWeight: 600 }}
                          >
                            <MessageCircle size={16} /> WhatsApp
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
