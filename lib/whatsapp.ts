import type { Order } from '@/features/order/domain/entities/order';
import type { OrderStatus } from '@/features/order/domain/entities/order-status';
import { formatPrice } from '@/lib/format-price';

// ── URL helpers ────────────────────────────────────────────────────────

/** Strips non-digit chars so "300 123 4567" → "3001234567" */
export const sanitizePhone = (phone: string) => phone.replace(/\D/g, '');

/** Builds a `https://wa.me/…` link, optionally with a pre-filled message. */
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const base = `https://wa.me/${sanitizePhone(phone)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Opens a WhatsApp link in a new tab. */
export function openWhatsApp(phone: string, message?: string): void {
  window.open(buildWhatsAppUrl(phone, message), '_blank');
}

// ── Admin → Customer messages (by status) ──────────────────────────────

const STATUS_MESSAGES: Record<OrderStatus, (order: Order) => string> = {
  pendiente: (o) =>
    `Hola ${o.customerName}! Tu pedido #${o.orderNumber} por ${formatPrice(o.total)} ha sido recibido. Te confirmaremos pronto!`,
  confirmado: (o) =>
    `Hola ${o.customerName}! Tu pedido #${o.orderNumber} por ${formatPrice(o.total)} ha sido *confirmado*. Estamos preparándolo!`,
  rechazado: (o) =>
    `Hola ${o.customerName}. Lamentablemente tu pedido #${o.orderNumber} no pudo ser procesado.${o.rejectionReason ? ` Razón: ${o.rejectionReason}.` : ''} Disculpa las molestias!`,
  pagado: (o) =>
    `Hola ${o.customerName}! Hemos recibido el pago de tu pedido #${o.orderNumber} por ${formatPrice(o.total)}. Gracias!`,
  entregado: (o) =>
    `Hola ${o.customerName}! Tu pedido #${o.orderNumber} ha sido *entregado*. Gracias por tu compra!`,
};

/** Returns a WhatsApp message for the admin to send to the customer based on order status. */
export function buildAdminStatusMessage(order: Order): string {
  return STATUS_MESSAGES[order.status](order);
}

// ── Customer → Business messages ───────────────────────────────────────

interface NewOrderMessageParams {
  orderNumber: number;
  businessName: string;
  customerName: string;
  customerCedula: string;
  customerPhone: string;
  address: string;
  barrio: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'efectivo' | 'transferencia';
  notes?: string;
}

/** Generates the full new-order WhatsApp message that the customer sends to the business. */
export function buildNewOrderMessage(params: NewOrderMessageParams): string {
  let msg = `🔥 *NUEVO PEDIDO #${params.orderNumber} - ${params.businessName}*\n\n`;
  msg += `👤 *Datos del cliente:*\n`;
  msg += `Nombre: ${params.customerName}\n`;
  msg += `Cédula: ${params.customerCedula}\n`;
  msg += `Teléfono: ${params.customerPhone}\n\n`;
  msg += `📍 *Dirección de entrega:*\n`;
  msg += `${params.address}\n`;
  msg += `Barrio: ${params.barrio}\n\n`;
  msg += `🛒 *Pedido:*\n`;
  params.items.forEach((item) => {
    msg += `• ${item.quantity}x ${item.name} - ${formatPrice(item.price * item.quantity)}\n`;
  });
  msg += `\n💰 Subtotal: ${formatPrice(params.subtotal)}\n`;
  msg += `🛵 Domicilio: ${formatPrice(params.deliveryFee)}\n`;
  msg += `💵 *TOTAL: ${formatPrice(params.total)}*\n\n`;
  msg += `💳 Forma de pago: ${params.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'}\n`;
  if (params.notes) {
    msg += `\n📝 Notas: ${params.notes}\n`;
  }
  msg += `\n⏳ *Estado: PENDIENTE DE CONFIRMACIÓN*`;
  msg += `\nEl cliente espera confirmación de su pedido.`;
  return msg;
}

/** Message for customer sending a payment receipt to the business. */
export function buildReceiptMessage(customerName: string, orderNumber: number, total: number): string {
  return `Hola! Soy ${customerName}. Quiero enviar el comprobante de pago de mi pedido #${orderNumber} por ${formatPrice(total)}.`;
}
