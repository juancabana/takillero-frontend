'use client';

import React, { createContext, useContext } from 'react';
import { useStoreSettings, useUpdateStoreSettings } from '@/features/store-settings/presentation/hooks/use-store-settings-queries';
import type { StoreSettings } from '@/features/store-settings/domain/entities/store-settings';
import type { UpdateStoreSettingsRequest } from '@/features/store-settings/domain/dto/update-store-settings-request';
import { STORE_DEFAULTS } from '@/constants/shared';

const DEFAULT_SETTINGS: StoreSettings = {
  id: '',
  businessName: STORE_DEFAULTS.BUSINESS_NAME,
  isOpen: true,
  closedMessage: null,
  whatsappNumber: STORE_DEFAULTS.WHATSAPP_NUMBER,
  address: null,
  deliveryZones: [],
  schedule: [],
};

interface StoreContextType {
  settings: StoreSettings;
  isLoading: boolean;
  updateSettings: (partial: UpdateStoreSettingsRequest, token: string) => Promise<void>;
  refetch: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, refetch } = useStoreSettings();
  const { mutateAsync } = useUpdateStoreSettings();

  const updateSettings = async (partial: UpdateStoreSettingsRequest, token: string) => {
    await mutateAsync({ data: partial, token });
  };

  return (
    <StoreContext.Provider
      value={{
        settings: data ?? DEFAULT_SETTINGS,
        isLoading,
        updateSettings,
        refetch,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
