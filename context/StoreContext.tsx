'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { storeService } from '@/services/store.service';
import type { StoreSettings, DeliveryZone } from '@/types/store.types';

interface StoreContextType {
  settings: StoreSettings;
  isLoading: boolean;
  updateSettings: (partial: Partial<StoreSettings>, token: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const DEFAULT_SETTINGS: StoreSettings = {
  id: '',
  businessName: 'Takillero',
  isOpen: true,
  closedMessage: null,
  whatsappNumber: '573001234567',
  deliveryZones: [],
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
