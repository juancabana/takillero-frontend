'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { storeService } from '@/services/store.service';
import type { StoreSettings } from '@/types/store.types';
import { STORE_DEFAULTS } from '@/constants/shared';

interface StoreContextType {
  settings: StoreSettings;
  isLoading: boolean;
  updateSettings: (partial: Partial<StoreSettings>, token: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const DEFAULT_SETTINGS: StoreSettings = {
  id: '',
  businessName: STORE_DEFAULTS.BUSINESS_NAME,
  isOpen: true,
  closedMessage: null,
  whatsappNumber: STORE_DEFAULTS.WHATSAPP_NUMBER,
  deliveryZones: [],
  schedule: [],
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await storeService.getSettings();
      setSettings(data);
    } catch {
      // keep defaults on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback(async (partial: Partial<StoreSettings>, token: string) => {
    const updated = await storeService.updateSettings(partial, token);
    setSettings(updated);
  }, []);

  return (
    <StoreContext.Provider value={{ settings, isLoading, updateSettings, refetch: fetchSettings }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
