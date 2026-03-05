/**
 * Constantes del layout de administración (app/admin/layout.tsx).
 */
export const ADMIN_LAYOUT = {
  NAV_ITEMS: {
    DASHBOARD: 'Dashboard',
    POS: 'POS Cajero',
    ORDERS: 'Pedidos',
    PRODUCTS: 'Productos',
    SETTINGS: 'Configuracion',
  },
  ADMIN_PANEL_LABEL: 'Admin Panel',
  BUSINESS_OPEN: 'Negocio Abierto',
  BUSINESS_CLOSED: 'Negocio Cerrado',
  VIEW_STORE: 'Ver tienda',
  LOGOUT: 'Cerrar sesion',
  ADMIN_TITLE: 'Admin',
  PENDING_SUFFIX: 'pendiente',
  PENDING_SUFFIX_PLURAL: 'pendientes',
  OPEN: 'Abierto',
  CLOSED: 'Cerrado',
  MOBILE_MENU_TITLE: 'Menu Admin',
  DELIVERY_ON: 'Domicilios ON',
  DELIVERY_OFF: 'Domicilios OFF',
} as const;
