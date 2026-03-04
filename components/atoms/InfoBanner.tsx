import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { card } from '@/config/theme';

type InfoBannerVariant = 'info' | 'success' | 'warning' | 'danger';

const variantClasses: Record<InfoBannerVariant, string> = {
  info: card.info,
  success: card.success,
  warning: card.warning,
  danger: card.danger,
};

const textColor: Record<InfoBannerVariant, { title: string; body: string }> = {
  info: { title: 'text-blue-800', body: 'text-blue-700' },
  success: { title: 'text-green-800', body: 'text-green-700' },
  warning: { title: 'text-amber-800', body: 'text-amber-700' },
  danger: { title: 'text-red-800', body: 'text-red-700' },
};

interface InfoBannerProps {
  variant: InfoBannerVariant;
  icon?: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

/**
 * Banner informativo reutilizable (transferencia data, warnings, etc.).
 */
export function InfoBanner({
  variant,
  icon: Icon,
  title,
  description,
  children,
}: InfoBannerProps) {
  const colors = textColor[variant];

  return (
    <div className={`${variantClasses[variant]} p-5`}>
      <div className="flex items-start gap-3">
        {Icon && (
          <Icon size={20} className={`${colors.title} shrink-0 mt-0.5`} />
        )}
        <div className="flex-1">
          <p
            className={colors.title}
            style={{ fontWeight: 600, fontSize: '14px' }}
          >
            {title}
          </p>
          {description && (
            <p
              className={colors.body}
              style={{ fontSize: '13px' }}
            >
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
