'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { STORAGE_KEYS } from '@/constants/shared';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    }
  }, [token]);

  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      const res = await authService.login(password);
      setToken(res.access_token);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
