'use client';

import React, { useState } from 'react';
import { Truck, Plus, Trash2, Save } from 'lucide-react';
import { motion } from 'motion/react';
import type { DeliveryZone } from '@/features/store-settings/domain/entities/store-settings';
import { ADMIN_SETTINGS } from '@/constants/admin/settings';
import { COMMON_LABELS } from '@/constants/shared';
import { toast } from 'sonner';

interface DeliveryZonesSectionProps {
  zones: DeliveryZone[];
  isSaving: boolean;
  hasChanges: boolean;
  onZonesChange: (zones: DeliveryZone[]) => void;
  onSave: () => void;
}

export function DeliveryZonesSection({
  zones,
  isSaving,
  hasChanges,
  onZonesChange,
  onSave,
}: DeliveryZonesSectionProps) {
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneFee, setNewZoneFee] = useState('5000');

  const handleAddZone = () => {
    if (!newZoneName.trim()) {
      toast.error(ADMIN_SETTINGS.TOAST_ZONE_NAME_REQUIRED);
      return;
    }
    const newZone: DeliveryZone = {
      id: `z_${Date.now()}`,
      name: newZoneName.trim(),
      fee: parseInt(newZoneFee) || 5000,
      active: true,
    };
    onZonesChange([...zones, newZone]);
    setNewZoneName('');
    setNewZoneFee('5000');
  };

  const handleRemoveZone = (id: string) => {
    onZonesChange(zones.filter((z) => z.id !== id));
  };

  const handleToggleZone = (id: string) => {
    onZonesChange(zones.map((z) => (z.id === id ? { ...z, active: !z.active } : z)));
  };

  const handleZoneFee = (id: string, fee: number) => {
    onZonesChange(zones.map((z) => (z.id === id ? { ...z, fee } : z)));
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <Truck size={20} className="text-purple-600" />
        </div>
        <div>
          <h2 className="text-gray-900" style={{ fontWeight: 600 }}>{ADMIN_SETTINGS.DELIVERY_ZONES_TITLE}</h2>
          <p className="text-gray-500" style={{ fontSize: '14px' }}>{ADMIN_SETTINGS.DELIVERY_ZONES_SUBTITLE}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {zones.map((zone) => (
          <motion.div
            key={zone.id}
            layout
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleZone(zone.id)}
                className={`relative w-10 h-6 rounded-full transition-all ${
                  zone.active ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                    zone.active ? 'left-4' : 'left-0.5'
                  }`}
                />
              </button>
              <span
                className={zone.active ? 'text-gray-900' : 'text-gray-400 line-through'}
                style={{ fontSize: '14px' }}
              >
                {zone.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={zone.fee}
                onChange={(e) => handleZoneFee(zone.id, parseInt(e.target.value) || 0)}
                className="w-24 px-2 py-1 bg-white border border-gray-200 rounded-lg text-right"
                style={{ fontSize: '14px' }}
              />
              <button
                onClick={() => handleRemoveZone(zone.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add new zone */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newZoneName}
          onChange={(e) => setNewZoneName(e.target.value)}
          placeholder={ADMIN_SETTINGS.ZONE_NAME_PLACEHOLDER}
          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
          style={{ fontSize: '14px' }}
        />
        <input
          type="number"
          value={newZoneFee}
          onChange={(e) => setNewZoneFee(e.target.value)}
          placeholder={ADMIN_SETTINGS.ZONE_FEE_PLACEHOLDER}
          className="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
          style={{ fontSize: '14px' }}
        />
        <button
          onClick={handleAddZone}
          className="flex items-center gap-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all"
          style={{ fontSize: '13px', fontWeight: 600 }}
        >
          <Plus size={16} /> {ADMIN_SETTINGS.ADD_ZONE}
        </button>
      </div>

      <button
        onClick={onSave}
        disabled={isSaving || !hasChanges}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl transition-all"
        style={{ fontSize: '14px', fontWeight: 600 }}
      >
        <Save size={16} /> {isSaving ? COMMON_LABELS.SAVING : ADMIN_SETTINGS.SAVE_ZONES}
      </button>
    </div>
  );
}
