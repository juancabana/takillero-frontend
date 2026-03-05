'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { ORDER_TRACKING_PAGE } from '@/constants/pages/order-tracking';
import type { BankAccount } from '@/features/store-settings/domain/entities/store-settings';
import { buildWhatsAppUrl, buildReceiptMessage } from '@/lib/whatsapp';

interface TransferPaymentCardProps {
  orderNumber: number;
  customerName: string;
  total: number;
  whatsapp: string;
  bankAccounts: BankAccount[];
}

export function TransferPaymentCard({ orderNumber, customerName, total, whatsapp, bankAccounts }: TransferPaymentCardProps) {
  return (
    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
      <h3 className="text-blue-800 mb-2" style={{ fontWeight: 600 }}>
        {ORDER_TRACKING_PAGE.TRANSFER_PAYMENT_TITLE}
      </h3>
      <div className="space-y-2 text-blue-700 mb-4" style={{ fontSize: '14px' }}>
        {bankAccounts.map((account, idx) => (
          <div key={idx}>
            <p style={{ fontWeight: 500 }}>{account.holderName}</p>
            <p>{account.bank} {account.accountType}: {account.accountNumber}</p>
          </div>
        ))}
        <p className="text-blue-600" style={{ fontSize: '13px' }}>
          Agradecemos enviar soporte de transferencia al número de WhatsApp.
        </p>
      </div>
      <p className="text-blue-600 mb-4" style={{ fontSize: '13px' }}>
        {ORDER_TRACKING_PAGE.TRANSFER_RECEIPT_HINT_PREFIX} #{orderNumber}
      </p>
      <a
        href={buildWhatsAppUrl(whatsapp, buildReceiptMessage(customerName, orderNumber, total))}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-all"
        style={{ fontWeight: 600 }}
      >
        <MessageCircle size={20} /> {ORDER_TRACKING_PAGE.SEND_RECEIPT_WHATSAPP}
      </a>
    </div>
  );
}
