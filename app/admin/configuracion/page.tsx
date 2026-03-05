'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import type { DeliveryZone, StoreSchedule } from '@/features/store-settings/domain/entities/store-settings';
import { ADMIN_SETTINGS } from '@/constants/admin/settings';
import { StoreStatusSection } from '@/components/molecules/StoreStatusSection';
import { BusinessInfoSection } from '@/components/molecules/BusinessInfoSection';
import { ScheduleSection } from '@/components/molecules/ScheduleSection';
import { DeliveryZonesSection } from '@/components/molecules/DeliveryZonesSection';

function normalizeTo24h(time: string): string {
  // Already HH:MM format
  if (/^\d{1,2}:\d{2}$/.test(time.trim())) return time.trim();

  // Handle "6:00 PM" / "11:30 AM" style
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    let hour = parseInt(match[1]);
    const min = match[2];
    const period = match[3].toUpperCase();
    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${min}`;
  }

  return time.trim();
}

export default function AdminConfiguracionPage() {
  const { settings, updateSettings } = useStore();
  const { token } = useAuth();

  const [businessName, setBusinessName] = useState(settings.businessName);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber ?? '');
  const [closedMessage, setClosedMessage] = useState(settings.closedMessage ?? '');
  const [address, setAddress] = useState(settings.address ?? '');
  const [zones, setZones] = useState<DeliveryZone[]>(settings.deliveryZones);
  const [schedule, setSchedule] = useState<StoreSchedule[]>(settings.schedule ?? []);
  const [isSaving, setIsSaving] = useState(false);
  const [togglingOpen, setTogglingOpen] = useState(false);
  const [togglingDelivery, setTogglingDelivery] = useState(false);

  const hasGeneralChanges = useMemo(
    () =>
      businessName !== settings.businessName ||
      whatsappNumber !== (settings.whatsappNumber ?? '') ||
      closedMessage !== (settings.closedMessage ?? '') ||
      address !== (settings.address ?? ''),
    [businessName, whatsappNumber, closedMessage, address, settings],
  );

  const hasScheduleChanges = useMemo(
    () => JSON.stringify(schedule) !== JSON.stringify(settings.schedule ?? []),
    [schedule, settings.schedule],
  );

  const hasZonesChanges = useMemo(
    () => JSON.stringify(zones) !== JSON.stringify(settings.deliveryZones),
    [zones, settings.deliveryZones],
  );

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
    if (!token || togglingOpen) return;
    setTogglingOpen(true);
    try {
      await updateSettings({ isOpen: !settings.isOpen }, token);
      toast.success(settings.isOpen ? ADMIN_SETTINGS.TOAST_BUSINESS_CLOSED : ADMIN_SETTINGS.TOAST_BUSINESS_OPEN);
    } catch {
      toast.error(ADMIN_SETTINGS.TOAST_STATUS_ERROR);
    } finally {
      setTogglingOpen(false);
    }
  };

  const handleToggleDelivery = async () => {
    if (!token || togglingDelivery) return;
    setTogglingDelivery(true);
    try {
      await updateSettings({ deliveryEnabled: !settings.deliveryEnabled }, token);
      toast.success(settings.deliveryEnabled ? ADMIN_SETTINGS.TOAST_DELIVERY_OFF : ADMIN_SETTINGS.TOAST_DELIVERY_ON);
    } catch {
      toast.error(ADMIN_SETTINGS.TOAST_STATUS_ERROR);
    } finally {
      setTogglingDelivery(false);
    }
  };

  const handleSaveSchedule = async () => {
    if (!token) return;
    setIsSaving(true);
    try {
      const cleanSchedule = schedule
        .filter((s) => s.enabled !== false)
        .map(({ days, open, close }) => ({
          days,
          open: normalizeTo24h(open),
          close: normalizeTo24h(close),
        }));
      await updateSettings({ schedule: cleanSchedule }, token);
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

  return (
    <div className="space-y-6 max-w-3xl w-full">
      <div>
        <h1 className="text-gray-900" style={{ fontSize: '28px', fontWeight: 700 }}>
          {ADMIN_SETTINGS.TITLE}
        </h1>
        <p className="text-gray-500" style={{ fontSize: '14px' }}>
          {ADMIN_SETTINGS.SUBTITLE}
        </p>
      </div>

      <StoreStatusSection
        isOpen={settings.isOpen}
        closedMessage={closedMessage}
        deliveryEnabled={settings.deliveryEnabled}
        togglingOpen={togglingOpen}
        togglingDelivery={togglingDelivery}
        onToggleOpen={() => void handleToggleOpen()}
        onClosedMessageChange={setClosedMessage}
        onToggleDelivery={() => void handleToggleDelivery()}
      />

      <BusinessInfoSection
        businessName={businessName}
        whatsappNumber={whatsappNumber}
        address={address}
        isSaving={isSaving}
        hasChanges={hasGeneralChanges}
        onBusinessNameChange={setBusinessName}
        onWhatsappChange={setWhatsappNumber}
        onAddressChange={setAddress}
        onSave={() => void handleSaveGeneral()}
      />

      <ScheduleSection
        schedule={schedule}
        isSaving={isSaving}
        hasChanges={hasScheduleChanges}
        onScheduleChange={setSchedule}
        onSave={() => void handleSaveSchedule()}
      />

      <DeliveryZonesSection
        zones={zones}
        isSaving={isSaving}
        hasChanges={hasZonesChanges}
        onZonesChange={setZones}
        onSave={() => void handleSaveZones()}
      />
    </div>
  );
}
