'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, AlertCircle, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { ADMIN_LOGIN } from '@/constants/admin/login';
import { ROLE_CONFIG } from '@/features/auth/domain/entities/user-role';
import type { UserRole } from '@/features/auth/domain/entities/user-role';

const DEFAULT_ACCOUNTS: { username: string; password: string; role: UserRole }[] = [
  { username: 'admin', password: 'takilleros2026', role: 'admin' },
  { username: 'cajero', password: 'cajero2026', role: 'cajero' },
  { username: 'cocina', password: 'cocina2026', role: 'cocina' },
  { username: 'domiciliario', password: 'domi2026', role: 'domiciliario' },
];

export default function AdminLoginPage() {
  const { login, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === 'cajero') router.replace('/admin/pos');
      else if (role === 'cocina' || role === 'domiciliario') router.replace('/admin/pedidos');
      else router.replace('/admin');
    }
  }, [isAuthenticated, role, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const ok = await login(username, password);
    setIsLoading(false);
    if (!ok) {
      setError(ADMIN_LOGIN.ERROR_WRONG_CREDENTIALS);
      setPassword('');
    }
  };

  const handleQuickLogin = (acc: (typeof DEFAULT_ACCOUNTS)[number]) => {
    setUsername(acc.username);
    setPassword(acc.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img
            src="/logo.svg"
            alt="Takillero"
            className="w-44 h-24 rounded-2xl mx-auto mb-4"
          />
          <h1 className="text-white mb-2" style={{ fontSize: '28px', fontWeight: 700 }}>
            {ADMIN_LOGIN.TITLE}
          </h1>
          <p className="text-gray-400">{ADMIN_LOGIN.SUBTITLE}</p>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
              {ADMIN_LOGIN.USERNAME_LABEL}
            </label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={ADMIN_LOGIN.USERNAME_PLACEHOLDER}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
                autoFocus
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
              {ADMIN_LOGIN.PASSWORD_LABEL}
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={ADMIN_LOGIN.PASSWORD_PLACEHOLDER}
                className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl mb-4"
              style={{ fontSize: '14px' }}
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl transition-all shadow-md shadow-orange-200"
            style={{ fontWeight: 600 }}
          >
            {isLoading ? ADMIN_LOGIN.LOGGING_IN : ADMIN_LOGIN.LOGIN_BUTTON}
          </button>
        </form>

        {/* Default accounts hint */}
        <div className="mt-6">
          <p className="text-gray-500 text-center mb-3" style={{ fontSize: '13px' }}>
            {ADMIN_LOGIN.DEFAULT_ACCOUNTS_TITLE}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEFAULT_ACCOUNTS.map((acc) => {
              const config = ROLE_CONFIG[acc.role];
              return (
                <button
                  key={acc.username}
                  onClick={() => handleQuickLogin(acc)}
                  className="px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl text-left transition-all"
                >
                  <span className={`block ${config.color}`} style={{ fontSize: '12px', fontWeight: 600 }}>
                    {config.label}
                  </span>
                  <span className="text-gray-400" style={{ fontSize: '11px' }}>
                    {acc.username} / {acc.password}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
