'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface CheckoutProgressProps {
  step: number;
}

export function CheckoutProgress({ step }: CheckoutProgressProps) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2 flex-1">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
              step >= s ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'
            }`}
            style={{ fontSize: '14px', fontWeight: 600 }}
          >
            {step > s ? <Check size={16} /> : s}
          </div>
          {s < 3 && (
            <div
              className={`flex-1 h-1 rounded-full transition-all ${
                step > s ? 'bg-orange-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
