'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import type { DeliveryZone, StoreSchedule } from '@/features/store-settings/domain/entities/store-settings';
import { ADMIN_SETTINGS } from '@/constants/admin/settings';
import { StoreStatusSection } from '@/components/molecules/StoreStatusSection';
import { BusinessInfoSection } from '@/components/molecules/BusinessInfoSection';
import { ScheduleSection } from '@/components/molecules/ScheduleSection';
import { DeliveryZonesSection } from '@/components/molecules/DeliveryZonesSection';

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

      <StoreStatusSection
        isOpen={settings.isOpen}
        closedMessage={closedMessage}
        onToggleOpen={() => void handleToggleOpen()}
        onClosedMessageChange={setClosedMessage}
      />

      <BusinessInfoSection
        businessName={businessName}
        whatsappNumber={whatsappNumber}
        address={address}
        isSaving={isSaving}
        onBusinessNameChange={setBusinessName}
        onWhatsappChange={setWhatsappNumber}
        onAddressChange={setAddress}
        onSave={() => void handleSaveGeneral()}
      />

      <ScheduleSection
        schedule={schedule}
        isSaving={isSaving}
        onScheduleChange={setSchedule}
        onSave={() => void handleSaveSchedule()}
      />

      <DeliveryZonesSection
        zones={zones}
        isSaving={isSaving}
        onZonesChange={setZones}
        onSave={() => void handleSaveZones()}
      />
    </div>
  );
}
