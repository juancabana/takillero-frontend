'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Package,
  MessageCircle,
  ArrowLeft,
  Copy,
} from 'lucide-react';
import { motion } from 'motion/react';
import { orderService } from '@/services/order.service';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';
import type { Order, OrderStatus } from '@/types/order.types';
import { ORDER_TRACKING_PAGE } from '@/constants/pages/order-tracking';
import { COMMON_LABELS, PAYMENT_DATA, PAYMENT_METHODS, DEFAULT_WHATSAPP_NUMBER } from '@/constants/shared';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

const statusSteps: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'pendiente', label: ORDER_TRACKING_PAGE.STATUS_STEPS.RECEIVED, icon: Clock },
  { status: 'confirmado', label: ORDER_TRACKING_PAGE.STATUS_STEPS.CONFIRMED, icon: CheckCircle },
  { status: 'pagado', label: ORDER_TRACKING_PAGE.STATUS_STEPS.PAID, icon: CreditCard },
  { status: 'entregado', label: ORDER_TRACKING_PAGE.STATUS_STEPS.DELIVERED, icon: Package },
];

const statusOrder: Record<OrderStatus, number> = {
  pendiente: 0,
  confirmado: 1,
  rechazado: -1,
  pagado: 2,
  entregado: 3,
};

export default function PedidoPage() {
  const { settings } = useStore();
  const [orderNum, setOrderNum] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const whatsapp = settings?.whatsappNumber ?? DEFAULT_WHATSAPP_NUMBER;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(orderNum);
    if (isNaN(num)) {
      toast.error(ORDER_TRACKING_PAGE.TOAST_INVALID_ORDER);
      return;
    }
    setIsSearching(true);
    setSearched(false);
    setOrder(null);
    try {
      const found = await orderService.getOrderByNumber(num);
      setOrder(found);
    } catch {
      setOrder(null);
    } finally {
      setIsSearching(false);
      setSearched(true);
    }
  };

  const currentStep = order ? statusOrder[order.status] : -1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> {ORDER_TRACKING_PAGE.BACK_TO_HOME}
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-gray-900 mb-2" style={{ fontSize: '28px', fontWeight: 700 }}>
            {ORDER_TRACKING_PAGE.TITLE}
          </h1>
          <p className="text-gray-500">{ORDER_TRACKING_PAGE.SUBTITLE}</p>
        </div>

        {/* Search */}
        <form onSubmit={(e) => void handleSearch(e)} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontWeight: 600 }}>#</span>
            <input
              type="text"
              value={orderNum}
              onChange={(e) => setOrderNum(e.target.value.replace(/\D/g, ''))}
              placeholder={ORDER_TRACKING_PAGE.SEARCH_PLACEHOLDER}
              className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl transition-all"
            style={{ fontWeight: 600 }}
          >
            <Search size={18} /> {isSearching ? ORDER_TRACKING_PAGE.SEARCHING : ORDER_TRACKING_PAGE.SEARCH_BUTTON}
          </button>
        </form>

        {/* Not found */}
        {searched && !order && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl border border-gray-100"
          >
            <XCircle size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">{ORDER_TRACKING_PAGE.NOT_FOUND_PREFIX} #{orderNum}</p>
          </motion.div>
        )}

        {/* Order details */}
        {order && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Order number header */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
              <p className="text-gray-500 mb-1" style={{ fontSize: '14px' }}>{ORDER_TRACKING_PAGE.ORDER_LABEL}</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-gray-900" style={{ fontSize: '36px', fontWeight: 700 }}>
                  #{order.orderNumber}
                </p>
                <button
                  onClick={() => {
                    void navigator.clipboard.writeText(order.orderNumber.toString());
                    toast.success(ORDER_TRACKING_PAGE.TOAST_NUMBER_COPIED);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Copy size={18} />
                </button>
              </div>
              <p className="text-gray-400" style={{ fontSize: '13px' }}>
                {new Date(order.createdAt).toLocaleString('es-CO')}
              </p>
            </div>

            {/* Status tracker */}
            {order.status === 'rechazado' ? (
              <div className="bg-red-50 rounded-2xl p-6 border border-red-200 text-center">
                <XCircle size={40} className="mx-auto text-red-500 mb-3" />
                <p className="text-red-800" style={{ fontSize: '18px', fontWeight: 600 }}>
                  {ORDER_TRACKING_PAGE.REJECTED_TITLE}
                </p>
                {order.rejectionReason && (
                  <p className="text-red-600 mt-2" style={{ fontSize: '14px' }}>
                    {ORDER_TRACKING_PAGE.REJECTED_REASON_PREFIX} {order.rejectionReason}
                  </p>
                )}
                <p className="text-red-500 mt-3" style={{ fontSize: '13px' }}>
                  {ORDER_TRACKING_PAGE.REJECTED_CONTACT}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-gray-900 mb-6" style={{ fontWeight: 600 }}>
                  {ORDER_TRACKING_PAGE.STATUS_SECTION_TITLE}
                </h3>
                <div className="space-y-0">
                  {statusSteps.map((step, i) => {
                    const isCompleted = currentStep >= i;
                    const isCurrent = currentStep === i;

                    return (
                      <div key={step.status} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              isCompleted
                                ? isCurrent
                                  ? 'bg-orange-500 text-white ring-4 ring-orange-100'
                                  : 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            <step.icon size={20} />
                          </div>
                          {i < statusSteps.length - 1 && (
                            <div
                              className={`w-0.5 h-10 transition-all ${
                                currentStep > i ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                            />
                          )}
                        </div>
                        <div className="pb-8">
                          <p
                            className={isCompleted ? 'text-gray-900' : 'text-gray-400'}
                            style={{ fontWeight: isCurrent ? 600 : 400 }}
                          >
                            {step.label}
                          </p>
                          {isCurrent && (
                            <p className="text-orange-500" style={{ fontSize: '13px' }}>
                              {ORDER_TRACKING_PAGE.CURRENT_STATUS}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order details */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-gray-900 mb-4" style={{ fontWeight: 600 }}>
                {ORDER_TRACKING_PAGE.ORDER_DETAIL_TITLE}
              </h3>
              <div className="space-y-2" style={{ fontSize: '14px' }}>
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <span className="text-gray-600">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-2">
                  <div className="flex justify-between text-gray-400">
                    <span>{COMMON_LABELS.DELIVERY}</span>
                    <span>{formatPrice(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-gray-900 mt-1" style={{ fontWeight: 700, fontSize: '18px' }}>
                    <span>{COMMON_LABELS.TOTAL}</span>
                    <span className="text-orange-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-600"
                  style={{ fontSize: '13px' }}
                >
                  {ORDER_TRACKING_PAGE.PAYMENT_PREFIX} {order.paymentMethod === 'efectivo' ? PAYMENT_METHODS.CASH_LABEL : PAYMENT_METHODS.TRANSFER_LABEL}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg ${
                    order.paymentStatus === 'pagado'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                  style={{ fontSize: '13px' }}
                >
                  {order.paymentStatus === 'pagado' ? ORDER_TRACKING_PAGE.PAYMENT_STATUS_PAID : ORDER_TRACKING_PAGE.PAYMENT_STATUS_PENDING}
                </span>
              </div>
            </div>

            {/* Transfer payment CTA */}
            {order.paymentMethod === 'transferencia' && order.paymentStatus !== 'pagado' && (
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-blue-800 mb-2" style={{ fontWeight: 600 }}>
                  {ORDER_TRACKING_PAGE.TRANSFER_PAYMENT_TITLE}
                </h3>
                <div className="space-y-1 text-blue-700 mb-4" style={{ fontSize: '14px' }}>
                  <p>{PAYMENT_DATA.NEQUI}</p>
                  <p>{PAYMENT_DATA.DAVIPLATA}</p>
                  <p>{PAYMENT_DATA.BANCOLOMBIA}</p>
                </div>
                <p className="text-blue-600 mb-4" style={{ fontSize: '13px' }}>
                  {ORDER_TRACKING_PAGE.TRANSFER_RECEIPT_HINT_PREFIX} #{order.orderNumber}
                </p>
                <a
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`${ORDER_TRACKING_PAGE.WA_RECEIPT_GREETING} ${order.customerName}. ${ORDER_TRACKING_PAGE.WA_RECEIPT_MESSAGE} #${order.orderNumber} ${ORDER_TRACKING_PAGE.WA_RECEIPT_AMOUNT_PREFIX} ${formatPrice(order.total)}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-all"
                  style={{ fontWeight: 600 }}
                >
                  <MessageCircle size={20} /> {ORDER_TRACKING_PAGE.SEND_RECEIPT_WHATSAPP}
                </a>
              </div>
            )}

            {/* WhatsApp contact */}
            <div className="bg-green-50 rounded-2xl p-4 border border-green-200 flex items-center justify-between">
              <div>
                <p className="text-green-800" style={{ fontWeight: 500, fontSize: '14px' }}>
                  {ORDER_TRACKING_PAGE.NEED_HELP}
                </p>
                <p className="text-green-600" style={{ fontSize: '13px' }}>
                  {ORDER_TRACKING_PAGE.WRITE_US_WHATSAPP}
                </p>
              </div>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-all"
                style={{ fontSize: '13px', fontWeight: 600 }}
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
