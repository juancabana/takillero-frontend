'use client';

import React from 'react';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { StoreProvider } from '@/context/StoreContext';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          {children}
          <Toaster position="top-right" richColors />
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
