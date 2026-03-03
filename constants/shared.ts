/**
 * Constantes compartidas usadas en múltiples partes de la aplicación.
 */

// ── Configuración de moneda ──────────────────────────────────────────
export const CURRENCY_CONFIG = {
  LOCALE: 'es-CO',
  CURRENCY: 'COP',
  MINIMUM_FRACTION_DIGITS: 0,
} as const;

// ── Datos bancarios / transferencias ─────────────────────────────────
export const PAYMENT_DATA = {
  NEQUI: 'Nequi: 300 123 4567 - Juan Lopez',
  DAVIPLATA: 'Daviplata: 300 123 4567',
  BANCOLOMBIA: 'Bancolombia Ahorros: 123-456789-00',
} as const;

// ── Métodos de pago ──────────────────────────────────────────────────
export const PAYMENT_METHODS = {
  CASH_LABEL: 'Efectivo',
  TRANSFER_LABEL: 'Transferencia',
  CASH_DESCRIPTION: 'Pago contra entrega',
  TRANSFER_DESCRIPTION: 'Nequi / Daviplata / Bancolombia',
} as const;

// ── Etiquetas comunes ────────────────────────────────────────────────
export const COMMON_LABELS = {
  SUBTOTAL: 'Subtotal',
  DELIVERY: 'Domicilio',
  TOTAL: 'Total',
  BACK: 'Atras',
  NEXT: 'Siguiente',
  CANCEL: 'Cancelar',
  SAVE: 'Guardar',
  SAVING: 'Guardando...',
  SEARCH: 'Buscar',
  ALL: 'Todos',
  ADD: 'Agregar',
  WHATSAPP: 'WhatsApp',
  OPEN: 'Abierto',
  CLOSED: 'Cerrado',
  PAID: 'Pagado',
  PAYMENT_PENDING: 'Pago pendiente',
} as const;

// ── Etiquetas de datos del cliente ───────────────────────────────────
export const CUSTOMER_LABELS = {
  NAME: 'Nombre:',
  CEDULA: 'Cedula:',
  PHONE: 'Telefono:',
  ADDRESS: 'Direccion:',
  NEIGHBORHOOD: 'Barrio:',
  NOTES: 'Notas:',
} as const;

// ── Defaults ─────────────────────────────────────────────────────────
export const DEFAULT_WHATSAPP_NUMBER = '573001234567';
export const DEFAULT_DELIVERY_FEE = 5000;
export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';

// ── Defaults de tienda ───────────────────────────────────────────────
export const STORE_DEFAULTS = {
  BUSINESS_NAME: 'Takillero',
  WHATSAPP_NUMBER: '573001234567',
} as const;

// ── Claves de almacenamiento local ───────────────────────────────────
export const STORAGE_KEYS = {
  ADMIN_TOKEN: 'takillero_admin_token',
  CART: 'takillero_cart',
} as const;

// ── Helpers de conteo ────────────────────────────────────────────────
export const PRODUCT_COUNT = (count: number) => `${count} producto(s)`;
export const ORDER_COUNT = (count: number) => `${count} pedido(s)`;
