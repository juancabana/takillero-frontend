'use client';

import React from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Package,
} from 'lucide-react';
import type { OrderStatus } from '@/features/order/domain/entities/order-status';
import { ORDER_TRACKING_PAGE } from '@/constants/pages/order-tracking';

const statusSteps: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'pendiente', label: ORDER_TRACKING_PAGE.STATUS_STEPS.RECEIVED, icon: Clock },
  { status: 'confirmado', label: ORDER_TRACKING_PAGE.STATUS_STEPS.CONFIRMED, icon: CheckCircle },
  { status: 'pagado', label: ORDER_TRACKING_PAGE.STATUS_STEPS.PAID, icon: CreditCard },
  { status: 'entregado', label: ORDER_TRACKING_PAGE.STATUS_STEPS.DELIVERED, icon: Package },
];

const statusOrder: Record<OrderStatus, number> = {
  pendiente: 0,
  confirmado: 1,
  rechazado: -1,
  pagado: 2,
  entregado: 3,
};

interface OrderStatusTrackerProps {
  status: OrderStatus;
  rejectionReason?: string | null;
}

export function OrderStatusTracker({ status, rejectionReason }: OrderStatusTrackerProps) {
  const currentStep = statusOrder[status];

  if (status === 'rechazado') {
    return (
      <div className="bg-red-50 rounded-2xl p-6 border border-red-200 text-center">
        <XCircle size={40} className="mx-auto text-red-500 mb-3" />
        <p className="text-red-800" style={{ fontSize: '18px', fontWeight: 600 }}>
          {ORDER_TRACKING_PAGE.REJECTED_TITLE}
        </p>
        {rejectionReason && (
          <p className="text-red-600 mt-2" style={{ fontSize: '14px' }}>
            {ORDER_TRACKING_PAGE.REJECTED_REASON_PREFIX} {rejectionReason}
          </p>
        )}
        <p className="text-red-500 mt-3" style={{ fontSize: '13px' }}>
          {ORDER_TRACKING_PAGE.REJECTED_CONTACT}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-gray-900 mb-6" style={{ fontWeight: 600 }}>
        {ORDER_TRACKING_PAGE.STATUS_SECTION_TITLE}
      </h3>
      <div className="space-y-0">
        {statusSteps.map((step, i) => {
          const isCompleted = currentStep >= i;
          const isCurrent = currentStep === i;

          return (
            <div key={step.status} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? isCurrent
                        ? 'bg-orange-500 text-white ring-4 ring-orange-100'
                        : 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <step.icon size={20} />
                </div>
                {i < statusSteps.length - 1 && (
                  <div
                    className={`w-0.5 h-10 transition-all ${
                      currentStep > i ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <div className="pb-8">
                <p
                  className={isCompleted ? 'text-gray-900' : 'text-gray-400'}
                  style={{ fontWeight: isCurrent ? 600 : 400 }}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-orange-500" style={{ fontSize: '13px' }}>
                    {ORDER_TRACKING_PAGE.CURRENT_STATUS}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
