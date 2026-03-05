'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLogin } from '@/features/auth/presentation/hooks/use-auth-mutations';
import { STORAGE_KEYS } from '@/constants/shared';
import type { UserRole } from '@/features/auth/domain/entities/user-role';
import { ROLE_ACCESS } from '@/features/auth/domain/entities/user-role';

interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
}

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  role: UserRole | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasAccess: (section: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
  });

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const loginMutation = useLogin();

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    }
  }, [token]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
    }
  }, [currentUser]);

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      try {
        const res = await loginMutation.mutateAsync({ username, password });
        setToken(res.access_token);
        setCurrentUser({
          id: '',
          username: res.username,
          displayName: res.displayName,
          role: res.role as UserRole,
        });
        return true;
      } catch {
        return false;
      }
    },
    [loginMutation],
  );

  const logout = useCallback(() => {
    setToken(null);
    setCurrentUser(null);
  }, []);

  const hasAccess = useCallback(
    (section: string): boolean => {
      if (!currentUser) return false;
      return ROLE_ACCESS[currentUser.role]?.includes(section) ?? false;
    },
    [currentUser],
  );

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        currentUser,
        role: currentUser?.role ?? null,
        login,
        logout,
        hasAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
