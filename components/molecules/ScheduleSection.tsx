'use client';

import React from 'react';
import { Clock, Save } from 'lucide-react';
import type { StoreSchedule } from '@/features/store-settings/domain/entities/store-settings';
import { ADMIN_SETTINGS } from '@/constants/admin/settings';
import { COMMON_LABELS } from '@/constants/shared';

interface ScheduleSectionProps {
  schedule: StoreSchedule[];
  isSaving: boolean;
  onScheduleChange: (schedule: StoreSchedule[]) => void;
  onSave: () => void;
}

export function ScheduleSection({
  schedule,
  isSaving,
  onScheduleChange,
  onSave,
}: ScheduleSectionProps) {
  const updateRow = (index: number, field: keyof StoreSchedule, value: string) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [field]: value };
    onScheduleChange(updated);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Clock size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-gray-900" style={{ fontWeight: 600 }}>{ADMIN_SETTINGS.SCHEDULE_TITLE}</h2>
          <p className="text-gray-500" style={{ fontSize: '14px' }}>{ADMIN_SETTINGS.SCHEDULE_SUBTITLE}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-2">
        <span className="text-gray-400" style={{ fontSize: '12px', fontWeight: 600 }}>{ADMIN_SETTINGS.SCHEDULE_COL_DAYS}</span>
        <span className="text-gray-400" style={{ fontSize: '12px', fontWeight: 600 }}>{ADMIN_SETTINGS.SCHEDULE_COL_OPEN}</span>
        <span className="text-gray-400" style={{ fontSize: '12px', fontWeight: 600 }}>{ADMIN_SETTINGS.SCHEDULE_COL_CLOSE}</span>
      </div>
      <div className="space-y-2 mb-4">
        {schedule.map((s, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 items-center">
            <input
              type="text"
              value={s.days}
              onChange={(e) => updateRow(i, 'days', e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
              style={{ fontSize: '14px' }}
              placeholder={ADMIN_SETTINGS.SCHEDULE_PLACEHOLDER}
            />
            <input
              type="time"
              value={s.open}
              onChange={(e) => updateRow(i, 'open', e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
              style={{ fontSize: '14px' }}
            />
            <input
              type="time"
              value={s.close}
              onChange={(e) => updateRow(i, 'close', e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
              style={{ fontSize: '14px' }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-5 py-2.5 rounded-xl transition-all"
        style={{ fontSize: '14px', fontWeight: 600 }}
      >
        <Save size={16} /> {isSaving ? COMMON_LABELS.SAVING : ADMIN_SETTINGS.SAVE_SCHEDULE}
      </button>
    </div>
  );
}
