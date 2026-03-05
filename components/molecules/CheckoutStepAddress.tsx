'use client';

import React from 'react';
import { MapPin, ArrowLeft, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { CHECKOUT_PAGE } from '@/constants/pages/checkout';
import { COMMON_LABELS } from '@/constants/shared';
import { formatPrice } from '@/lib/format-price';
import type { DeliveryZone } from '@/features/store-settings/domain/entities/store-settings';

interface CheckoutStepAddressProps {
  direccion: string;
  barrio: string;
  notas: string;
  activeZones: DeliveryZone[];
  isPickupMode?: boolean;
  onUpdate: (field: 'direccion' | 'barrio' | 'notas', value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

export function CheckoutStepAddress({
  direccion,
  barrio,
  notas,
  activeZones,
  isPickupMode = false,
  onUpdate,
  onNext,
  onBack,
  isValid,
}: CheckoutStepAddressProps) {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <MapPin size={20} className="text-orange-600" />
        </div>
        <div>
          <h3 className="text-gray-900" style={{ fontWeight: 600 }}>
            {isPickupMode ? CHECKOUT_PAGE.PICKUP_TITLE : CHECKOUT_PAGE.STEP_2_TITLE}
          </h3>
          <p className="text-gray-500" style={{ fontSize: '14px' }}>
            {isPickupMode ? CHECKOUT_PAGE.PICKUP_SUBTITLE : CHECKOUT_PAGE.STEP_2_SUBTITLE}
          </p>
        </div>
      </div>

      {isPickupMode && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4">
          <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800" style={{ fontWeight: 500, fontSize: '14px' }}>
              {CHECKOUT_PAGE.PICKUP_BANNER_TITLE}
            </p>
            <p className="text-amber-600" style={{ fontSize: '13px' }}>
              {CHECKOUT_PAGE.PICKUP_BANNER_DESC}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {!isPickupMode && (
          <>
            <div>
              <label className="block text-gray-700 mb-1.5" style={{ fontSize: '14px' }}>
                {CHECKOUT_PAGE.LABEL_ADDRESS}
              </label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => onUpdate('direccion', e.target.value)}
                placeholder={CHECKOUT_PAGE.PLACEHOLDER_ADDRESS}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1.5" style={{ fontSize: '14px' }}>
                {CHECKOUT_PAGE.LABEL_NEIGHBORHOOD}
              </label>
              <select
                value={barrio}
                onChange={(e) => onUpdate('barrio', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
              >
                <option value="">{CHECKOUT_PAGE.SELECT_NEIGHBORHOOD}</option>
                {activeZones.map((z) => (
                  <option key={z.id} value={z.name}>
                    {z.name} - Domicilio: {formatPrice(z.fee)}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        <div>
          <label className="block text-gray-700 mb-1.5" style={{ fontSize: '14px' }}>
            {CHECKOUT_PAGE.LABEL_NOTES}
          </label>
          <textarea
            value={notas}
            onChange={(e) => onUpdate('notas', e.target.value)}
            placeholder={CHECKOUT_PAGE.PLACEHOLDER_NOTES}
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all resize-none"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-3 rounded-xl transition-colors"
        >
          <ArrowLeft size={18} /> {COMMON_LABELS.BACK}
        </button>
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
