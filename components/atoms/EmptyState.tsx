import React from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { iconBox, btn, text as textTokens } from '@/config/theme';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  actionIcon?: LucideIcon;
  emoji?: string;
}

/**
 * Estado vacío reutilizable: icono grande + título + descripción + CTA.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionIcon: ActionIcon,
  emoji,
}: EmptyStateProps) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center p-8">
        {emoji ? (
          <p className="text-gray-400" style={{ fontSize: '48px' }}>
            {emoji}
          </p>
        ) : Icon ? (
          <div
            className={`${iconBox.xl} ${iconBox.primary} mx-auto mb-6`}
          >
            <Icon size={40} className="text-orange-400" />
          </div>
        ) : null}
        <h2
          className="text-gray-900 mb-2"
          style={{ fontSize: '24px', fontWeight: 700 }}
        >
          {title}
        </h2>
        {description && (
          <p className="text-gray-500 mb-6">{description}</p>
        )}
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className={`${btn.base} ${btn.primary} gap-2 px-6 py-3`}
            style={{ fontWeight: 600 }}
          >
            {ActionIcon && <ActionIcon size={18} />}
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
