/**
 * Constantes del componente Header (components/Header.tsx).
 */
export const HEADER = {
  NAV_LINKS: [
    { href: '/', label: 'Inicio' },
    { href: '/menu', label: 'Menú' },
    { href: '/pedido', label: 'Mi Pedido' },
    { href: '/ubicacion', label: 'Ubicación' },
  ],
  CART_LABEL: 'Carrito',
  MOBILE_MENU_ARIA: 'Abrir menú',
} as const;
