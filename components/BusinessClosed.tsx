'use client';

import { Clock, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import type { StoreSettings } from '@/features/store-settings/domain/entities/store-settings';
import { BUSINESS_CLOSED } from '@/constants/components/business-closed';

interface BusinessClosedProps {
  settings: StoreSettings;
}

export function BusinessClosed({ settings }: BusinessClosedProps) {
  if (settings.isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-[100] bg-gray-900/95 flex items-center justify-center px-4"
    >
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <XCircle size={48} className="text-red-400" />
        </motion.div>

        <h1 className="text-white mb-3" style={{ fontSize: '32px', fontWeight: 700 }}>
          {BUSINESS_CLOSED.TITLE}
        </h1>
        <p className="text-gray-300 mb-8" style={{ fontSize: '18px' }}>
          {settings.closedMessage ?? BUSINESS_CLOSED.DEFAULT_MESSAGE}
        </p>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-left">
          <div className="flex items-center gap-2 text-orange-400 mb-4">
            <Clock size={20} />
            <span style={{ fontWeight: 600 }}>{BUSINESS_CLOSED.SCHEDULE_TITLE}</span>
          </div>
          <div className="space-y-3">
            {BUSINESS_CLOSED.DEFAULT_SCHEDULE.map((s) => (
              <div
                key={s.days}
                className="flex justify-between items-center py-2 border-b border-white/10 last:border-0"
              >
                <span className="text-gray-300">{s.days}</span>
                <span className="text-white" style={{ fontWeight: 500 }}>
                  {s.open} - {s.close}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-500 mt-6" style={{ fontSize: '14px' }}>
          {BUSINESS_CLOSED.FAREWELL_MESSAGE}
        </p>
      </div>
    </motion.div>
  );
}
