/**
 * Constantes de la gestión de pedidos de admin (app/admin/pedidos/page.tsx).
 */
export const ADMIN_ORDERS = {
  TITLE: 'Gestion de Pedidos',
  SUBTITLE: 'Administra y gestiona los pedidos entrantes',
  SEARCH_PLACEHOLDER: 'Buscar por #pedido, nombre o telefono...',

  // ── Filtros ────────────────────────────────────────────────────────
  FILTER_ALL: 'Todos',
  FILTER_PENDING: 'Pendientes',
  FILTER_CONFIRMED: 'Confirmados',
  FILTER_PAID: 'Pagados',
  FILTER_DELIVERED: 'Entregados',
  FILTER_REJECTED: 'Rechazados',

  // ── Etiquetas de estado ────────────────────────────────────────────
  STATUS_PENDING: 'Pendiente',
  STATUS_CONFIRMED: 'Confirmado',
  STATUS_REJECTED: 'Rechazado',
  STATUS_PAID: 'Pagado',
  STATUS_DELIVERED: 'Entregado',

  // ── Detalle expandido ──────────────────────────────────────────────
  CUSTOMER_DATA_TITLE: 'Datos del Cliente',
  PRODUCTS_TITLE: 'Productos',
  NOTES_PREFIX: 'Notas: ',
  REJECTION_REASON_PREFIX: 'Razon de rechazo: ',

  // ── Formulario de rechazo ──────────────────────────────────────────
  REJECTION_FORM_LABEL: 'Razon del rechazo:',
  REJECTION_PLACEHOLDER: 'Ej: Producto agotado, fuera de zona...',
  CONFIRM_REJECTION: 'Confirmar Rechazo',

  // ── Acciones ───────────────────────────────────────────────────────
  ACTION_CONFIRM: 'Confirmar',
  ACTION_REJECT: 'Rechazar',
  ACTION_MARK_PAID: 'Marcar como Pagado',
  ACTION_MARK_DELIVERED: 'Marcar Entregado',

  // ── Vacío ──────────────────────────────────────────────────────────
  NO_ORDERS: 'No hay pedidos para mostrar',

  // ── Toasts ─────────────────────────────────────────────────────────
  TOAST_LOAD_ERROR: 'Error al cargar pedidos',
  TOAST_UPDATE_ERROR: 'Error al actualizar el pedido',
  TOAST_REJECTED: 'Pedido rechazado',
  TOAST_REJECTION_REASON_REQUIRED: 'Indica una razon para rechazar',
} as const;
