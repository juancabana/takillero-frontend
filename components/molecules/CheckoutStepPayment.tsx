'use client';

import React from 'react';
import {
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Banknote,
  Smartphone,
  Clock,
} from 'lucide-react';
import { motion } from 'motion/react';
import { CHECKOUT_PAGE } from '@/constants/pages/checkout';
import { COMMON_LABELS, CUSTOMER_LABELS, PAYMENT_DATA, PAYMENT_METHODS } from '@/constants/shared';
import { formatPrice } from '@/lib/format-price';
import type { CartItem } from '@/context/CartContext';

type PaymentMethod = 'efectivo' | 'transferencia';

interface FormSummary {
  nombre: string;
  cedula: string;
  telefono: string;
  direccion: string;
  barrio: string;
}

interface CheckoutStepPaymentProps {
  formaPago: PaymentMethod;
  onPaymentChange: (method: PaymentMethod) => void;
  items: CartItem[];
  totalPrice: number;
  deliveryFee: number;
  total: number;
  form: FormSummary;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export function CheckoutStepPayment({
  formaPago,
  onPaymentChange,
  items,
  totalPrice,
  deliveryFee,
  total,
  form,
  isSubmitting,
  onBack,
  onSubmit,
}: CheckoutStepPaymentProps) {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <CreditCard size={20} className="text-orange-600" />
        </div>
        <div>
          <h3 className="text-gray-900" style={{ fontWeight: 600 }}>{CHECKOUT_PAGE.STEP_3_TITLE}</h3>
          <p className="text-gray-500" style={{ fontSize: '14px' }}>{CHECKOUT_PAGE.STEP_3_SUBTITLE}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => onPaymentChange('efectivo')}
          className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
            formaPago === 'efectivo'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              formaPago === 'efectivo' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            <Banknote size={24} />
          </div>
          <div className="text-left">
            <p className="text-gray-900" style={{ fontWeight: 600 }}>{PAYMENT_METHODS.CASH_LABEL}</p>
            <p className="text-gray-500" style={{ fontSize: '13px' }}>{PAYMENT_METHODS.CASH_DESCRIPTION}</p>
          </div>
        </button>
        <button
          onClick={() => onPaymentChange('transferencia')}
          className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
            formaPago === 'transferencia'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              formaPago === 'transferencia' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            <Smartphone size={24} />
          </div>
          <div className="text-left">
            <p className="text-gray-900" style={{ fontWeight: 600 }}>{PAYMENT_METHODS.TRANSFER_LABEL}</p>
            <p className="text-gray-500" style={{ fontSize: '13px' }}>{PAYMENT_METHODS.TRANSFER_DESCRIPTION}</p>
          </div>
        </button>
      </div>

      {formaPago === 'transferencia' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"
        >
          <p className="text-blue-800" style={{ fontWeight: 600, fontSize: '14px' }}>
            {CHECKOUT_PAGE.TRANSFER_DATA_TITLE}
          </p>
          <div className="mt-2 space-y-1 text-blue-700" style={{ fontSize: '14px' }}>
            <p>{PAYMENT_DATA.NEQUI}</p>
            <p>{PAYMENT_DATA.DAVIPLATA}</p>
            <p>{PAYMENT_DATA.BANCOLOMBIA}</p>
          </div>
          <p className="mt-2 text-blue-600" style={{ fontSize: '13px' }}>
            {CHECKOUT_PAGE.TRANSFER_RECEIPT_HINT}
          </p>
        </motion.div>
      )}

      {/* Order summary */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h4 className="text-gray-900 mb-3" style={{ fontWeight: 600 }}>{CHECKOUT_PAGE.ORDER_SUMMARY_TITLE}</h4>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-gray-600" style={{ fontSize: '14px' }}>
              <span>{item.quantity}x {item.product.name}</span>
              <span>{formatPrice(item.product.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between text-gray-600" style={{ fontSize: '14px' }}>
            <span>{COMMON_LABELS.DELIVERY} ({form.barrio || CHECKOUT_PAGE.SELECT_NEIGHBORHOOD_PLACEHOLDER})</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-gray-900" style={{ fontWeight: 700, fontSize: '18px' }}>
            <span>{COMMON_LABELS.TOTAL}</span>
            <span className="text-orange-600">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Customer info summary */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h4 className="text-gray-900 mb-3" style={{ fontWeight: 600 }}>{CHECKOUT_PAGE.DELIVERY_DATA_TITLE}</h4>
        <div className="grid grid-cols-2 gap-2" style={{ fontSize: '14px' }}>
          <span className="text-gray-500">{CUSTOMER_LABELS.NAME}</span>
          <span className="text-gray-900">{form.nombre}</span>
          <span className="text-gray-500">{CUSTOMER_LABELS.CEDULA}</span>
          <span className="text-gray-900">{form.cedula}</span>
          <span className="text-gray-500">{CUSTOMER_LABELS.PHONE}</span>
          <span className="text-gray-900">{form.telefono}</span>
          <span className="text-gray-500">{CUSTOMER_LABELS.ADDRESS}</span>
          <span className="text-gray-900">{form.direccion}</span>
          <span className="text-gray-500">{CUSTOMER_LABELS.NEIGHBORHOOD}</span>
          <span className="text-gray-900">{form.barrio}</span>
        </div>
      </div>

      {/* Pending confirmation notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Clock size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800" style={{ fontWeight: 600, fontSize: '14px' }}>
              {CHECKOUT_PAGE.MANUAL_VERIFICATION_TITLE}
            </p>
            <p className="text-amber-700" style={{ fontSize: '13px' }}>
              {CHECKOUT_PAGE.MANUAL_VERIFICATION_DESCRIPTION}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-3 rounded-xl transition-colors"
        >
          <ArrowLeft size={18} /> {COMMON_LABELS.BACK}
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl transition-all shadow-md shadow-green-200"
          style={{ fontWeight: 600 }}
        >
          {isSubmitting ? CHECKOUT_PAGE.SUBMITTING : CHECKOUT_PAGE.SUBMIT_ORDER}
          <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}
