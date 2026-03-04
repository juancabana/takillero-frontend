import React from 'react';
import { text } from '@/config/theme';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

/**
 * Header reutilizable de página con título + subtítulo + acción opcional.
 */
export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-gray-900" style={text.pageTitle}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-500" style={text.label}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
