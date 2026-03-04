'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Clock, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { CHECKOUT_PAGE } from '@/constants/pages/checkout';
import { PAYMENT_DATA } from '@/constants/shared';
import { formatPrice } from '@/lib/format-price';

interface OrderSentViewProps {
  orderNumber: number;
  total: number;
  customerName: string;
  paymentMethod: 'efectivo' | 'transferencia';
  whatsapp: string;
  whatsappMessage: string;
  onNewOrder: () => void;
}

export function OrderSentView({
  orderNumber,
  total,
  customerName,
  paymentMethod,
  whatsapp,
  whatsappMessage,
  onNewOrder,
}: OrderSentViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 max-w-md w-full"
      >
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock size={40} className="text-orange-600" />
        </div>
        <h2 className="text-gray-900 mb-2" style={{ fontSize: '28px', fontWeight: 700 }}>
          {CHECKOUT_PAGE.ORDER_SENT_TITLE}
        </h2>
        <p className="text-gray-500 mb-4">
          {CHECKOUT_PAGE.ORDER_SENT_DESCRIPTION}
        </p>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <p className="text-gray-500 mb-1" style={{ fontSize: '14px' }}>{CHECKOUT_PAGE.ORDER_NUMBER_LABEL}</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-orange-600" style={{ fontSize: '42px', fontWeight: 800 }}>
              #{orderNumber}
            </span>
            <button
              onClick={() => {
                void navigator.clipboard.writeText(orderNumber.toString());
                toast.success(CHECKOUT_PAGE.ORDER_NUMBER_COPIED);
              }}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Copy size={20} />
            </button>
          </div>
          <p className="text-gray-400 mt-2" style={{ fontSize: '13px' }}>
            {CHECKOUT_PAGE.ORDER_NUMBER_SAVE_HINT}
          </p>
        </div>

        {paymentMethod === 'transferencia' && (
          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200 mb-6 text-left">
            <p className="text-blue-800 mb-2" style={{ fontWeight: 600, fontSize: '14px' }}>
              {CHECKOUT_PAGE.TRANSFER_DATA_TITLE}
            </p>
            <div className="space-y-1 text-blue-700" style={{ fontSize: '14px' }}>
              <p>{PAYMENT_DATA.NEQUI}</p>
              <p>{PAYMENT_DATA.DAVIPLATA}</p>
              <p>{PAYMENT_DATA.BANCOLOMBIA}</p>
            </div>
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hola! Soy ${customerName}. Quiero enviar el comprobante de pago de mi pedido #${orderNumber} por ${formatPrice(total)}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl transition-all"
              style={{ fontWeight: 600, fontSize: '14px' }}
            >
              <MessageCircle size={18} /> {CHECKOUT_PAGE.SEND_RECEIPT_WHATSAPP}
            </a>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href={`/pedido?numero=${orderNumber}`}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl transition-all"
            style={{ fontWeight: 600 }}
          >
            {CHECKOUT_PAGE.VIEW_ORDER_STATUS}
          </Link>
          <a
            href={`https://wa.me/${whatsapp}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl transition-all"
            style={{ fontWeight: 600 }}
          >
            <MessageCircle size={20} /> {CHECKOUT_PAGE.OPEN_WHATSAPP}
          </a>
          <button
            onClick={onNewOrder}
            className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 py-3 rounded-xl transition-colors"
          >
            {CHECKOUT_PAGE.NEW_ORDER}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
