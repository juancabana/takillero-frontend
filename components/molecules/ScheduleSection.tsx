'use client';

import React from 'react';
import { Clock, Plus, Trash2, Save, Sunrise, Moon, CalendarDays } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';
import type { StoreSchedule } from '@/features/store-settings/domain/entities/store-settings';
import { ADMIN_SETTINGS } from '@/constants/admin/settings';
import { COMMON_LABELS } from '@/constants/shared';

interface ScheduleSectionProps {
  schedule: StoreSchedule[];
  isSaving: boolean;
  hasChanges: boolean;
  onScheduleChange: (schedule: StoreSchedule[]) => void;
  onSave: () => void;
}

function formatTimeLabel(time: string): string {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
}

export function ScheduleSection({
  schedule,
  isSaving,
  hasChanges,
  onScheduleChange,
  onSave,
}: ScheduleSectionProps) {
  const updateRow = (index: number, updates: Partial<StoreSchedule>) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], ...updates };
    onScheduleChange(updated);
  };

  const addRow = () => {
    onScheduleChange([
      ...schedule,
      {
        days: ADMIN_SETTINGS.SCHEDULE_DEFAULT_DAYS,
        open: ADMIN_SETTINGS.SCHEDULE_DEFAULT_OPEN,
        close: ADMIN_SETTINGS.SCHEDULE_DEFAULT_CLOSE,
        enabled: true,
      },
    ]);
    toast.success(ADMIN_SETTINGS.TOAST_SCHEDULE_ROW_ADDED);
  };

  const removeRow = (index: number) => {
    if (schedule.length <= 1) {
      toast.error(ADMIN_SETTINGS.SCHEDULE_MIN_ROWS);
      return;
    }
    onScheduleChange(schedule.filter((_, i) => i !== index));
    toast.info(ADMIN_SETTINGS.TOAST_SCHEDULE_ROW_REMOVED);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Clock size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-gray-900" style={{ fontWeight: 600 }}>
              {ADMIN_SETTINGS.SCHEDULE_TITLE}
            </h2>
            <p className="text-gray-500" style={{ fontSize: '14px' }}>
              {ADMIN_SETTINGS.SCHEDULE_SUBTITLE}
            </p>
          </div>
        </div>
        <button
          onClick={addRow}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all shadow-sm shadow-blue-200"
          style={{ fontSize: '13px', fontWeight: 600 }}
        >
          <Plus size={16} /> {ADMIN_SETTINGS.SCHEDULE_ADD_ROW}
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {schedule.map((s, i) => {
            const isEnabled = s.enabled !== false;
            return (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`rounded-xl border transition-all ${
                  isEnabled
                    ? 'border-blue-100 bg-gradient-to-r from-blue-50/60 to-white'
                    : 'border-gray-200 bg-gray-50/80'
                }`}
              >
                {/* Top bar: toggle + days + delete */}
                <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                  <button
                    onClick={() => updateRow(i, { enabled: !isEnabled })}
                    className={`relative w-11 h-6 rounded-full transition-all shrink-0 ${
                      isEnabled ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                        isEnabled ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>

                  <div className="flex-1 relative">
                    <CalendarDays
                      size={16}
                      className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                        isEnabled ? 'text-blue-400' : 'text-gray-400'
                      }`}
                    />
                    <input
                      type="text"
                      value={s.days}
                      onChange={(e) => updateRow(i, { days: e.target.value })}
                      placeholder={ADMIN_SETTINGS.SCHEDULE_PLACEHOLDER}
                      disabled={!isEnabled}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all ${
                        isEnabled
                          ? 'bg-white border-blue-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300'
                          : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      style={{ fontSize: '14px', fontWeight: 500 }}
                    />
                  </div>

                  <button
                    onClick={() => removeRow(i)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Time inputs row */}
                <div className="flex items-stretch gap-3 px-4 pb-4 pt-2">
                  {/* Apertura */}
                  <div className="flex-1">
                    <label
                      className={`flex items-center gap-1.5 mb-1.5 ${
                        isEnabled ? 'text-blue-600' : 'text-gray-400'
                      }`}
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      <Sunrise size={13} /> {ADMIN_SETTINGS.SCHEDULE_COL_OPEN}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={s.open}
                        onChange={(e) => updateRow(i, { open: e.target.value })}
                        placeholder="HH:MM"
                        disabled={!isEnabled}
                        className={`w-full px-4 py-3 rounded-xl border transition-all ${
                          isEnabled
                            ? 'bg-white border-blue-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300'
                            : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                        style={{ fontSize: '15px', fontWeight: 500 }}
                      />
                      {isEnabled && s.open && /^\d{1,2}:\d{2}$/.test(s.open) && (
                        <span
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none"
                          style={{ fontSize: '11px', fontWeight: 500 }}
                        >
                          {formatTimeLabel(s.open)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="flex items-end pb-4">
                    <span className={`text-lg ${isEnabled ? 'text-blue-300' : 'text-gray-300'}`}>
                      —
                    </span>
                  </div>

                  {/* Cierre */}
                  <div className="flex-1">
                    <label
                      className={`flex items-center gap-1.5 mb-1.5 ${
                        isEnabled ? 'text-blue-600' : 'text-gray-400'
                      }`}
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      <Moon size={13} /> {ADMIN_SETTINGS.SCHEDULE_COL_CLOSE}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={s.close}
                        onChange={(e) => updateRow(i, { close: e.target.value })}
                        placeholder="HH:MM"
                        disabled={!isEnabled}
                        className={`w-full px-4 py-3 rounded-xl border transition-all ${
                          isEnabled
                            ? 'bg-white border-blue-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300'
                            : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                        style={{ fontSize: '15px', fontWeight: 500 }}
                      />
                      {isEnabled && s.close && /^\d{1,2}:\d{2}$/.test(s.close) && (
                        <span
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none"
                          style={{ fontSize: '11px', fontWeight: 500 }}
                        >
                          {formatTimeLabel(s.close)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status indicator when disabled */}
                {!isEnabled && (
                  <div className="px-4 pb-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-200 text-gray-500 rounded-lg"
                      style={{ fontSize: '12px', fontWeight: 500 }}
                    >
                      {ADMIN_SETTINGS.SCHEDULE_DISABLED_LABEL}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {schedule.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Clock size={32} className="mx-auto mb-2 opacity-30" />
          <p style={{ fontSize: '14px' }}>{ADMIN_SETTINGS.SCHEDULE_EMPTY}</p>
        </div>
      )}

      {schedule.length > 0 && (
        <button
          onClick={onSave}
          disabled={isSaving || !hasChanges}
          className="mt-4 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl transition-all"
          style={{ fontSize: '14px', fontWeight: 600 }}
        >
          <Save size={16} /> {isSaving ? COMMON_LABELS.SAVING : ADMIN_SETTINGS.SAVE_SCHEDULE}
        </button>
      )}
    </div>
  );
}
