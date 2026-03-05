export type OrderStatus =
  | 'pendiente'
  | 'confirmado'
  | 'rechazado'
  | 'pagado'
  | 'entregado';

export type OrderType = 'domicilio' | 'local';
export type PaymentMethod = 'efectivo' | 'transferencia';
export type PaymentStatus = 'pendiente' | 'pagado';
