'use client';

import React from 'react';
import { Store, Truck } from 'lucide-react';
import { ADMIN_SETTINGS } from '@/constants/admin/settings';

interface StoreStatusSectionProps {
  isOpen: boolean;
  closedMessage: string;
  deliveryEnabled: boolean;
  togglingOpen: boolean;
  togglingDelivery: boolean;
  onToggleOpen: () => void;
  onClosedMessageChange: (value: string) => void;
  onToggleDelivery: () => void;
}

export function StoreStatusSection({
  isOpen,
  closedMessage,
  deliveryEnabled,
  togglingOpen,
  togglingDelivery,
  onToggleOpen,
  onClosedMessageChange,
  onToggleDelivery,
}: StoreStatusSectionProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <Store size={20} className="text-orange-600" />
        </div>
        <div>
          <h2 className="text-gray-900" style={{ fontWeight: 600 }}>{ADMIN_SETTINGS.STORE_STATUS_TITLE}</h2>
          <p className="text-gray-500" style={{ fontSize: '14px' }}>{ADMIN_SETTINGS.STORE_STATUS_SUBTITLE}</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
        <div>
          <p className="text-gray-900" style={{ fontWeight: 500 }}>
            {isOpen ? ADMIN_SETTINGS.BUSINESS_OPEN : ADMIN_SETTINGS.BUSINESS_CLOSED}
          </p>
          <p className="text-gray-400" style={{ fontSize: '13px' }}>
            {isOpen
              ? ADMIN_SETTINGS.CLIENTS_CAN_ORDER
              : ADMIN_SETTINGS.CLIENTS_SEE_CLOSED}
          </p>
        </div>
        <button
          onClick={onToggleOpen}
          disabled={togglingOpen}
          className={`relative w-14 h-8 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            isOpen ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${
              isOpen ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 mt-3">
        <div className="flex items-center gap-3">
          <Truck size={20} className={deliveryEnabled ? 'text-teal-500' : 'text-gray-400'} />
          <div>
            <p className="text-gray-900" style={{ fontWeight: 500 }}>
              {deliveryEnabled ? ADMIN_SETTINGS.DELIVERY_ACTIVE : ADMIN_SETTINGS.DELIVERY_INACTIVE}
            </p>
            <p className="text-gray-400" style={{ fontSize: '13px' }}>
              {deliveryEnabled
                ? ADMIN_SETTINGS.DELIVERY_ACTIVE_DESC
                : ADMIN_SETTINGS.DELIVERY_INACTIVE_DESC}
            </p>
          </div>
        </div>
        <button
          onClick={onToggleDelivery}
          disabled={togglingDelivery}
          className={`relative w-14 h-8 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            deliveryEnabled ? 'bg-teal-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${
              deliveryEnabled ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>

      <div className="mt-4">
        <label className="block text-gray-700 mb-1.5" style={{ fontSize: '14px' }}>
          {ADMIN_SETTINGS.CLOSED_MESSAGE_LABEL}
        </label>
        <input
          type="text"
          value={closedMessage}
          onChange={(e) => onClosedMessageChange(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
        />
      </div>
    </div>
  );
}
