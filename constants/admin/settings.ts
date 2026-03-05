/**
 * Constantes de la página de configuración de admin (app/admin/configuracion/page.tsx).
 */
export const ADMIN_SETTINGS = {
  TITLE: 'Configuracion',
  SUBTITLE: 'Configura los datos de tu negocio',

  // ── Estado del negocio ─────────────────────────────────────────────
  STORE_STATUS_TITLE: 'Estado del Negocio',
  STORE_STATUS_SUBTITLE: 'Abre o cierra tu negocio',
  BUSINESS_OPEN: 'Negocio Abierto',
  BUSINESS_CLOSED: 'Negocio Cerrado',
  CLIENTS_CAN_ORDER: 'Los clientes pueden hacer pedidos',
  CLIENTS_SEE_CLOSED: 'Los clientes veran el mensaje de negocio cerrado',
  CLOSED_MESSAGE_LABEL: 'Mensaje cuando esta cerrado',
  DELIVERY_ACTIVE: 'Domicilios Activos',
  DELIVERY_INACTIVE: 'Domicilios Desactivados',
  DELIVERY_ACTIVE_DESC: 'Los clientes pueden pedir a domicilio',
  DELIVERY_INACTIVE_DESC: 'Solo pedidos en establecimiento / recogida',

  // ── Datos del negocio ──────────────────────────────────────────────
  BUSINESS_INFO_TITLE: 'Datos del Negocio',
  BUSINESS_INFO_SUBTITLE: 'Informacion de contacto',
  BUSINESS_NAME_LABEL: 'Nombre del negocio',
  WHATSAPP_LABEL: 'Numero de WhatsApp (con codigo de pais, sin +)',
  WHATSAPP_PLACEHOLDER: '573001234567',
  ADDRESS_LABEL: 'Dirección del local',
  ADDRESS_PLACEHOLDER: 'Ej: CR 59C #24A–97, Tacarena, Cartagena de Indias',

  // ── Horarios ───────────────────────────────────────────────────────
  SCHEDULE_TITLE: 'Horarios',
  SCHEDULE_SUBTITLE: 'Configura el horario del negocio',
  SCHEDULE_COL_DAYS: 'DIAS',
  SCHEDULE_COL_OPEN: 'APERTURA',
  SCHEDULE_COL_CLOSE: 'CIERRE',
  SCHEDULE_PLACEHOLDER: 'Ej: Lunes - Viernes',
  SCHEDULE_ADD_ROW: 'Agregar franja',
  SCHEDULE_DEFAULT_DAYS: 'Nuevo horario',
  SCHEDULE_DEFAULT_OPEN: '08:00',
  SCHEDULE_DEFAULT_CLOSE: '22:00',
  SCHEDULE_MIN_ROWS: 'Debe haber al menos una franja horaria',
  SCHEDULE_DISABLED_LABEL: 'Franja desactivada',
  SCHEDULE_EMPTY: 'No hay franjas horarias configuradas',
  SAVE_SCHEDULE: 'Guardar Horarios',
  TOAST_SCHEDULE_ROW_ADDED: 'Franja horaria agregada',
  TOAST_SCHEDULE_ROW_REMOVED: 'Franja horaria eliminada',

  // ── Zonas de domicilio ─────────────────────────────────────────────
  DELIVERY_ZONES_TITLE: 'Zonas de Domicilio',
  DELIVERY_ZONES_SUBTITLE: 'Configura los barrios y tarifas de domicilio',
  ZONE_NAME_PLACEHOLDER: 'Nombre del barrio',
  ZONE_FEE_PLACEHOLDER: 'Tarifa',
  ADD_ZONE: 'Agregar',
  SAVE_ZONES: 'Guardar Zonas',

  // ── Toasts ─────────────────────────────────────────────────────────
  TOAST_SAVED: 'Configuracion guardada',
  TOAST_SAVE_ERROR: 'Error al guardar la configuracion',
  TOAST_BUSINESS_CLOSED: 'Negocio cerrado',
  TOAST_BUSINESS_OPEN: 'Negocio abierto',
  TOAST_DELIVERY_ON: 'Domicilios activados',
  TOAST_DELIVERY_OFF: 'Domicilios desactivados',
  TOAST_STATUS_ERROR: 'Error al cambiar el estado',
  TOAST_SCHEDULE_SAVED: 'Horarios guardados',
  TOAST_SCHEDULE_ERROR: 'Error al guardar los horarios',
  TOAST_ZONES_SAVED: 'Zonas de domicilio guardadas',
  TOAST_ZONES_ERROR: 'Error al guardar las zonas',
  TOAST_ZONE_NAME_REQUIRED: 'Ingresa el nombre del barrio/zona',
} as const;
