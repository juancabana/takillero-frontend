import React from 'react';
import { toggle } from '@/config/theme';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  size?: 'sm' | 'md';
}

/**
 * Toggle switch reutilizable (tienda abierta/cerrada, zonas activas, etc.).
 */
export function ToggleSwitch({
  checked,
  onChange,
  size = 'md',
}: ToggleSwitchProps) {
  const track = size === 'sm' ? toggle.trackSm(checked) : toggle.track(checked);
  const thumb = size === 'sm' ? toggle.thumbSm(checked) : toggle.thumb(checked);

  return (
    <button onClick={onChange} className={track} type="button">
      <span className={thumb} />
    </button>
  );
}
