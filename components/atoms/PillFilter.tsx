import React from 'react';
import { pill } from '@/config/theme';

export interface PillOption {
  value: string;
  label: string;
  icon?: string;
}

interface PillFilterProps {
  options: PillOption[];
  value: string;
  onChange: (value: string) => void;
}

/**
 * Grupo de botones pill para filtrar (categorías, estados, etc.).
 */
export function PillFilter({ options, value, onChange }: PillFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`${pill.base} ${
            value === opt.value ? pill.active : pill.inactive
          } flex items-center gap-2`}
        >
          {opt.icon && <span>{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
