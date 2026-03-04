'use client';

import React, { useState, useEffect } from 'react';
import { Store, Clock, Truck, Plus, Trash2, Save, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import type { DeliveryZone, StoreSchedule } from '@/features/store-settings/domain/entities/store-settings';
import { ADMIN_SETTINGS } from '@/constants/admin/settings';
import { COMMON_LABELS } from '@/constants/shared';
import { formatPrice } from '@/lib/format-price';
import { ToggleSwitch, IconBox, FormField, FormTextarea } from '@/components/atoms';
import { btn, card, input as inputTokens, text, iconBox } from '@/config/theme';

export default function AdminConfiguracionPage() {
  const { settings, updateSettings } = useStore();
  const { token } = useAuth();

  const [businessName, setBusinessName] = useState(settings.businessName);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber ?? '');
  const [closedMessage, setClosedMessage] = useState(settings.closedMessage ?? '');
  const [address, setAddress] = useState(settings.address ?? '');
  const [zones, setZones] = useState<DeliveryZone[]>(settings.deliveryZones);
  const [schedule, setSchedule] = useState<StoreSchedule[]>(settings.schedule ?? []);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneFee, setNewZoneFee] = useState('5000');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setBusinessName(settings.businessName);
    setWhatsappNumber(settings.whatsappNumber ?? '');
    setClosedMessage(settings.closedMessage ?? '');
    setAddress(settings.address ?? '');
    setZones(settings.deliveryZones);
    setSchedule(settings.schedule ?? []);
  }, [settings]);

  const handleSaveGeneral = async () => {
    if (!token) return;
    setIsSaving(true);
    try {
      await updateSettings(
        { businessName, whatsappNumber, closedMessage, address: address || null },
        token,
      );
      toast.success(ADMIN_SETTINGS.TOAST_SAVED);
    } catch {
      toast.error(ADMIN_SETTINGS.TOAST_SAVE_ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleOpen = async () => {
    if (!token) return;
    try {
      await updateSettings({ isOpen: !settings.isOpen }, token);
      toast.success(settings.isOpen ? ADMIN_SETTINGS.TOAST_BUSINESS_CLOSED : ADMIN_SETTINGS.TOAST_BUSINESS_OPEN);
    } catch {
      toast.error(ADMIN_SETTINGS.TOAST_STATUS_ERROR);
    }
  };

  const handleSaveSchedule = async () => {
    if (!token) return;
    setIsSaving(true);
    try {
      await updateSettings({ schedule }, token);
      toast.success(ADMIN_SETTINGS.TOAST_SCHEDULE_SAVED);
    } catch {
      toast.error(ADMIN_SETTINGS.TOAST_SCHEDULE_ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveZones = async () => {
    if (!token) return;
    setIsSaving(true);
    try {
      await updateSettings({ deliveryZones: zones }, token);
      toast.success(ADMIN_SETTINGS.TOAST_ZONES_SAVED);
    } catch {
      toast.error(ADMIN_SETTINGS.TOAST_ZONES_ERROR);
    } finally {
      setIsSaving(false);
    }
  };

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
    setZones((prev) => [...prev, newZone]);
    setNewZoneName('');
    setNewZoneFee('5000');
  };

  const handleRemoveZone = (id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id));
  };

  const handleToggleZone = (id: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, active: !z.active } : z)),
    );
  };

  const handleZoneFee = (id: string, fee: number) => {
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, fee } : z)));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-gray-900" style={{ fontSize: '28px', fontWeight: 700 }}>
          {ADMIN_SETTINGS.TITLE}
        </h1>
        <p className="text-gray-500" style={{ fontSize: '14px' }}>
          {ADMIN_SETTINGS.SUBTITLE}
        </p>
      </div>

      {/* Store Status */}
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
              {settings.isOpen ? ADMIN_SETTINGS.BUSINESS_OPEN : ADMIN_SETTINGS.BUSINESS_CLOSED}
            </p>
            <p className="text-gray-400" style={{ fontSize: '13px' }}>
              {settings.isOpen
                ? ADMIN_SETTINGS.CLIENTS_CAN_ORDER
                : ADMIN_SETTINGS.CLIENTS_SEE_CLOSED}
            </p>
          </div>
          <button
            onClick={() => void handleToggleOpen()}
            className={`relative w-14 h-8 rounded-full transition-all ${
              settings.isOpen ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${
                settings.isOpen ? 'left-7' : 'left-1'
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
            onChange={(e) => setClosedMessage(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
          />
        </div>
      </div>

      {/* Business Info */}
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
              onChange={(e) => setBusinessName(e.target.value)}
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
              onChange={(e) => setWhatsappNumber(e.target.value)}
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
              onChange={(e) => setAddress(e.target.value)}
              placeholder={ADMIN_SETTINGS.ADDRESS_PLACEHOLDER}
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all resize-none"
              style={{ fontSize: '14px' }}
            />
          </div>
        </div>

        <button
          onClick={() => void handleSaveGeneral()}
          disabled={isSaving}
          className="mt-4 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-5 py-2.5 rounded-xl transition-all"
          style={{ fontSize: '14px', fontWeight: 600 }}
        >
          <Save size={16} /> {isSaving ? COMMON_LABELS.SAVING : COMMON_LABELS.SAVE}
        </button>
      </div>

      {/* Schedule */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Clock size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-gray-900" style={{ fontWeight: 600 }}>{ADMIN_SETTINGS.SCHEDULE_TITLE}</h2>
            <p className="text-gray-500" style={{ fontSize: '14px' }}>{ADMIN_SETTINGS.SCHEDULE_SUBTITLE}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-2">
          <span className="text-gray-400" style={{ fontSize: '12px', fontWeight: 600 }}>{ADMIN_SETTINGS.SCHEDULE_COL_DAYS}</span>
          <span className="text-gray-400" style={{ fontSize: '12px', fontWeight: 600 }}>{ADMIN_SETTINGS.SCHEDULE_COL_OPEN}</span>
          <span className="text-gray-400" style={{ fontSize: '12px', fontWeight: 600 }}>{ADMIN_SETTINGS.SCHEDULE_COL_CLOSE}</span>
        </div>
        <div className="space-y-2 mb-4">
          {schedule.map((s, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-center">
              <input
                type="text"
                value={s.days}
                onChange={(e) => {
                  const ns = [...schedule];
                  ns[i] = { ...s, days: e.target.value };
                  setSchedule(ns);
                }}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                style={{ fontSize: '14px' }}
                placeholder={ADMIN_SETTINGS.SCHEDULE_PLACEHOLDER}
              />
              <input
                type="time"
                value={s.open}
                onChange={(e) => {
                  const ns = [...schedule];
                  ns[i] = { ...s, open: e.target.value };
                  setSchedule(ns);
                }}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                style={{ fontSize: '14px' }}
              />
              <input
                type="time"
                value={s.close}
                onChange={(e) => {
                  const ns = [...schedule];
                  ns[i] = { ...s, close: e.target.value };
                  setSchedule(ns);
                }}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                style={{ fontSize: '14px' }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => void handleSaveSchedule()}
          disabled={isSaving}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-5 py-2.5 rounded-xl transition-all"
          style={{ fontSize: '14px', fontWeight: 600 }}
        >
          <Save size={16} /> {isSaving ? COMMON_LABELS.SAVING : ADMIN_SETTINGS.SAVE_SCHEDULE}
        </button>
      </div>

      {/* Delivery Zones */}
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
          onClick={() => void handleSaveZones()}
          disabled={isSaving}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-5 py-2.5 rounded-xl transition-all"
          style={{ fontSize: '14px', fontWeight: 600 }}
        >
          <Save size={16} /> {isSaving ? COMMON_LABELS.SAVING : ADMIN_SETTINGS.SAVE_ZONES}
        </button>
      </div>
    </div>
  );
}
