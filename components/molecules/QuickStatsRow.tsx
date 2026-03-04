'use client';

import React from 'react';

interface QuickStat {
  label: string;
  count: number;
  icon: React.ElementType;
  color: string;
}

interface QuickStatsRowProps {
  stats: QuickStat[];
}

export function QuickStatsRow({ stats }: QuickStatsRowProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
          <s.icon size={20} className={s.color} />
          <div>
            <p className="text-gray-900" style={{ fontWeight: 600 }}>{s.count}</p>
            <p className="text-gray-400" style={{ fontSize: '12px' }}>{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
