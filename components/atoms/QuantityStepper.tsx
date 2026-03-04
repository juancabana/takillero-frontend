import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { quantityStepper as qs } from '@/config/theme';

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

/**
 * Control +/- de cantidad reutilizado en menú y carrito.
 */
export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
}: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={onDecrement} className={`${qs.btn} ${qs.decrement}`}>
        <Minus size={16} />
      </button>
      <span className={qs.value}>{quantity}</span>
      <button onClick={onIncrement} className={`${qs.btn} ${qs.increment}`}>
        <Plus size={16} />
      </button>
    </div>
  );
}
