'use client';

import React from 'react';
import { User, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { CHECKOUT_PAGE } from '@/constants/pages/checkout';
import { COMMON_LABELS } from '@/constants/shared';

interface CheckoutStepPersonalProps {
  nombre: string;
  cedula: string;
  telefono: string;
  onUpdate: (field: 'nombre' | 'cedula' | 'telefono', value: string) => void;
  onNext: () => void;
  isValid: boolean;
}

export function CheckoutStepPersonal({
  nombre,
  cedula,
  telefono,
  onUpdate,
  onNext,
  isValid,
}: CheckoutStepPersonalProps) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <User size={20} className="text-orange-600" />
        </div>
        <div>
          <h3 className="text-gray-900" style={{ fontWeight: 600 }}>{CHECKOUT_PAGE.STEP_1_TITLE}</h3>
          <p className="text-gray-500" style={{ fontSize: '14px' }}>{CHECKOUT_PAGE.STEP_1_SUBTITLE}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1.5" style={{ fontSize: '14px' }}>
            {CHECKOUT_PAGE.LABEL_FULL_NAME}
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => onUpdate('nombre', e.target.value)}
            placeholder={CHECKOUT_PAGE.PLACEHOLDER_NAME}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1.5" style={{ fontSize: '14px' }}>
            {CHECKOUT_PAGE.LABEL_CEDULA}
          </label>
          <input
            type="text"
            value={cedula}
            onChange={(e) => onUpdate('cedula', e.target.value)}
            placeholder={CHECKOUT_PAGE.PLACEHOLDER_CEDULA}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1.5" style={{ fontSize: '14px' }}>
            {CHECKOUT_PAGE.LABEL_PHONE}
          </label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => onUpdate('telefono', e.target.value)}
            placeholder={CHECKOUT_PAGE.PLACEHOLDER_PHONE}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all"
          style={{ fontWeight: 600 }}
        >
          {COMMON_LABELS.NEXT} <ArrowLeft size={18} className="rotate-180" />
        </button>
      </div>
    </motion.div>
  );
}
