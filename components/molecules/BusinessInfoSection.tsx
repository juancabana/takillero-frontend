'use client';

import React from 'react';
import { MessageCircle, Save } from 'lucide-react';
import { ADMIN_SETTINGS } from '@/constants/admin/settings';
import { COMMON_LABELS } from '@/constants/shared';

interface BusinessInfoSectionProps {
  businessName: string;
  whatsappNumber: string;
  address: string;
  isSaving: boolean;
  hasChanges: boolean;
  onBusinessNameChange: (value: string) => void;
  onWhatsappChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onSave: () => void;
}

export function BusinessInfoSection({
  businessName,
  whatsappNumber,
  address,
  isSaving,
  hasChanges,
  onBusinessNameChange,
  onWhatsappChange,
  onAddressChange,
  onSave,
}: BusinessInfoSectionProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <MessageCircle size={20} className="text-green-600" />
        </div>
        <div>
          <h2 className="text-gray-900" style={{ fontWeight: 600 }}>{ADMIN_SETTINGS.BUSINESS_INFO_TITLE}</h2>
          <p className="text-gray-500" style={{ fontSize: '14px' }}>{ADMIN_SETTINGS.BUSINESS_INFO_SUBTITLE}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1.5" style={{ fontSize: '14px' }}>
            {ADMIN_SETTINGS.BUSINESS_NAME_LABEL}
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => onBusinessNameChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1.5" style={{ fontSize: '14px' }}>
            {ADMIN_SETTINGS.WHATSAPP_LABEL}
          </label>
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => onWhatsappChange(e.target.value)}
            placeholder={ADMIN_SETTINGS.WHATSAPP_PLACEHOLDER}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1.5" style={{ fontSize: '14px' }}>
            {ADMIN_SETTINGS.ADDRESS_LABEL}
          </label>
          <textarea
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder={ADMIN_SETTINGS.ADDRESS_PLACEHOLDER}
            rows={3}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all resize-none"
            style={{ fontSize: '14px' }}
          />
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={isSaving || !hasChanges}
        className="mt-4 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-5 py-2.5 rounded-xl transition-all"
        style={{ fontSize: '14px', fontWeight: 600 }}
      >
        <Save size={16} /> {isSaving ? COMMON_LABELS.SAVING : COMMON_LABELS.SAVE}
      </button>
    </div>
  );
}
