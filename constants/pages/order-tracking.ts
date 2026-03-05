/**
 * Constantes de la página de seguimiento de pedido (app/pedido/page.tsx).
 */
export const ORDER_TRACKING_PAGE = {
  BACK_TO_HOME: 'Volver al inicio',
  TITLE: 'Estado de tu Pedido',
  SUBTITLE: 'Ingresa tu número de pedido para ver el estado',
  SEARCH_PLACEHOLDER: 'Número de pedido',
  SEARCHING: 'Buscando...',

  // ── No encontrado ──────────────────────────────────────────────────
  NOT_FOUND_PREFIX: 'No se encontró el pedido',

  // ── Encabezado de pedido ───────────────────────────────────────────
  ORDER_LABEL: 'Pedido',

  // ── Pasos de estado ────────────────────────────────────────────────
  STATUS_STEPS: {
    RECEIVED: 'Pedido Recibido',
    CONFIRMED: 'Confirmado',
    PAID: 'Pagado',
    DELIVERED: 'Entregado',
  },

  // ── Rechazado ──────────────────────────────────────────────────────
  REJECTED_TITLE: 'Pedido Rechazado',
  REJECTED_REASON_PREFIX: 'Razón:',
  REJECTED_CONTACT: 'Comunícate con nosotros para más información',

  // ── Secciones ──────────────────────────────────────────────────────
  STATUS_SECTION_TITLE: 'Estado del Pedido',
  CURRENT_STATUS: 'Estado actual',
  ORDER_DETAIL_TITLE: 'Detalle del Pedido',

  // ── Transferencia ──────────────────────────────────────────────────
  TRANSFER_PAYMENT_TITLE: 'Pago por Transferencia',
  TRANSFER_RECEIPT_HINT_PREFIX:
    'Envía tu comprobante de pago por WhatsApp indicando tu número de pedido',
  SEND_RECEIPT_WHATSAPP: 'Enviar Comprobante por WhatsApp',

  // ── Ayuda / contacto ──────────────────────────────────────────────
  NEED_HELP: '¿Necesitas ayuda?',
  WRITE_US_WHATSAPP: 'Escríbenos por WhatsApp',

  // ── Toasts ─────────────────────────────────────────────────────────
  TOAST_NUMBER_COPIED: 'Número copiado',
  TOAST_INVALID_ORDER: 'Ingresa un número de pedido válido',

  // ── Búsqueda ───────────────────────────────────────────────────────
  SEARCH_BUTTON: 'Buscar',

  // ── Método de pago ─────────────────────────────────────────────────
  PAYMENT_PREFIX: 'Pago:',
  PAYMENT_STATUS_PAID: 'Pagado',
  PAYMENT_STATUS_PENDING: 'Pago pendiente',
} as const;
