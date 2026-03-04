import React from 'react';
import { card, text } from '@/config/theme';
import { formatPrice } from '@/lib/format-price';

interface SummaryRow {
  label: string;
  value: number;
  highlight?: boolean;
}

interface OrderSummaryCardProps {
  title: string;
  rows: SummaryRow[];
  action?: React.ReactNode;
  sticky?: boolean;
}

/**
 * Card de resumen de pedido (subtotal, domicilio, total).
 * Usado en carrito, checkout sidebar, etc.
 */
export function OrderSummaryCard({
  title,
  rows,
  action,
  sticky = false,
}: OrderSummaryCardProps) {
  return (
    <div className={`${card.flat} ${sticky ? 'sticky top-24' : ''}`}>
      <h3 className="text-gray-900 mb-4" style={text.cardTitle}>
        {title}
      </h3>
      <div className="space-y-3 mb-4">
        {rows.map((row) =>
          row.highlight ? (
            <div
              key={row.label}
              className="border-t border-gray-100 pt-3 flex justify-between text-gray-900"
              style={text.price}
            >
              <span>{row.label}</span>
              <span className="text-orange-600">{formatPrice(row.value)}</span>
            </div>
          ) : (
            <div key={row.label} className="flex justify-between text-gray-600">
              <span>{row.label}</span>
              <span>{formatPrice(row.value)}</span>
            </div>
          ),
        )}
      </div>
      {action}
    </div>
  );
}
