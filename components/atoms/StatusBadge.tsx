import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { badge } from '@/config/theme';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'primary' | 'purple';

interface StatusBadgeProps {
  label: string;
  variant: BadgeVariant;
  icon?: LucideIcon;
  pill?: boolean;
}

/**
 * Badge / etiqueta de estado reutilizable (pedidos, pagos, productos).
 */
export function StatusBadge({
  label,
  variant,
  icon: Icon,
  pill: isPill = false,
}: StatusBadgeProps) {
  const shape = isPill ? badge.pill : badge.base;
  return (
    <span className={`${shape} ${badge[variant]}`}>
      {Icon && <Icon size={14} />}
      {label}
    </span>
  );
}
