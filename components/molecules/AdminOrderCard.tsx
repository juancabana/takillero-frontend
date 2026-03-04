'use client';

import React from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Package,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Order } from '@/features/order/domain/entities/order';
import type { OrderStatus } from '@/features/order/domain/entities/order-status';
import { ADMIN_ORDERS } from '@/constants/admin/orders';
import { COMMON_LABELS, CUSTOMER_LABELS, PAYMENT_METHODS, PRODUCT_COUNT } from '@/constants/shared';
import { formatPrice } from '@/lib/format-price';
import { buildWhatsAppUrl, buildAdminStatusMessage } from '@/lib/whatsapp';

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pendiente: { label: ADMIN_ORDERS.STATUS_PENDING, color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  confirmado: { label: ADMIN_ORDERS.STATUS_CONFIRMED, color: 'text-blue-700', bg: 'bg-blue-100', icon: CheckCircle },
  rechazado: { label: ADMIN_ORDERS.STATUS_REJECTED, color: 'text-red-700', bg: 'bg-red-100', icon: XCircle },
  pagado: { label: ADMIN_ORDERS.STATUS_PAID, color: 'text-green-700', bg: 'bg-green-100', icon: CreditCard },
  entregado: { label: ADMIN_ORDERS.STATUS_DELIVERED, color: 'text-purple-700', bg: 'bg-purple-100', icon: Package },
};

interface AdminOrderCardProps {
  order: Order;
  isExpanded: boolean;
  onToggleExpand: () => void;
  rejectingOrder: string | null;
  rejectReason: string;
  onRejectReasonChange: (reason: string) => void;
  onStartReject: () => void;
  onCancelReject: () => void;
  onConfirm: () => void;
  onReject: () => void;
  onMarkPaid: () => void;
  onMarkDelivered: () => void;
}

export function AdminOrderCard({
  order,
  isExpanded,
  onToggleExpand,
  rejectingOrder,
  rejectReason,
  onRejectReasonChange,
  onStartReject,
  onCancelReject,
  onConfirm,
  onReject,
  onMarkPaid,
  onMarkDelivered,
}: AdminOrderCardProps) {
  const sc = statusConfig[order.status];

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Order header */}
      <button
        onClick={onToggleExpand}
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
                    onChange={(e) => onRejectReasonChange(e.target.value)}
                    placeholder={ADMIN_ORDERS.REJECTION_PLACEHOLDER}
                    className="w-full px-3 py-2 bg-white border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 mb-2"
                    style={{ fontSize: '14px' }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={onReject}
                      className="px-4 py-1.5 bg-red-500 text-white rounded-lg"
                      style={{ fontSize: '13px', fontWeight: 600 }}
                    >
                      {ADMIN_ORDERS.CONFIRM_REJECTION}
                    </button>
                    <button
                      onClick={onCancelReject}
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
                      onClick={onConfirm}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all"
                      style={{ fontSize: '13px', fontWeight: 600 }}
                    >
                      <CheckCircle size={16} /> {ADMIN_ORDERS.ACTION_CONFIRM}
                    </button>
                    <button
                      onClick={onStartReject}
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
                      onClick={onMarkPaid}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all"
                      style={{ fontSize: '13px', fontWeight: 600 }}
                    >
                      <CreditCard size={16} /> {ADMIN_ORDERS.ACTION_MARK_PAID}
                    </button>
                  )}

                {(order.status === 'confirmado' || order.status === 'pagado') && (
                  <button
                    onClick={onMarkDelivered}
                    className="flex items-center gap-1.5 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all"
                    style={{ fontSize: '13px', fontWeight: 600 }}
                  >
                    <Package size={16} /> {ADMIN_ORDERS.ACTION_MARK_DELIVERED}
                  </button>
                )}

                <a
                  href={buildWhatsAppUrl(order.customerPhone, buildAdminStatusMessage(order))}
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
}
