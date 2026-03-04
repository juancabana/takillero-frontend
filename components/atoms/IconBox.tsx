import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { iconBox as ib } from '@/config/theme';

type IconBoxSize = 'sm' | 'md' | 'lg' | 'xl';
type IconBoxColor = 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'purple';

interface IconBoxProps {
  icon: LucideIcon;
  size?: IconBoxSize;
  color?: IconBoxColor;
  iconSize?: number;
}

/**
 * Contenedor cuadrado/redondo con ícono centrado.
 * Reutilizado en steps del checkout, cards de info, etc.
 */
export function IconBox({
  icon: Icon,
  size = 'md',
  color = 'primary',
  iconSize = 20,
}: IconBoxProps) {
  return (
    <div className={`${ib[size]} ${ib[color]}`}>
      <Icon size={iconSize} />
    </div>
  );
}
