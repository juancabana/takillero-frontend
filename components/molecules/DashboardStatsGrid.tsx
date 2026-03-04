'use client';

import React from 'react';
import { motion } from 'motion/react';

interface StatItem {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  color: string;
}

interface DashboardStatsGridProps {
  stats: StatItem[];
}

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500" style={{ fontSize: '13px' }}>
              {stat.label}
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={18} />
            </div>
          </div>
          <p className="text-gray-900" style={{ fontSize: '24px', fontWeight: 700 }}>
            {stat.value}
          </p>
          <p className="text-gray-400" style={{ fontSize: '12px' }}>
            {stat.sub}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
