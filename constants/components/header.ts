/**
 * Constantes del componente Header (components/Header.tsx).
 */
export const HEADER = {
  NAV_LINKS: [
    { href: '/', label: 'Inicio' },
    { href: '/menu', label: 'Menu' },
    { href: '/pedido', label: 'Mi Pedido' },
    { href: '/ubicacion', label: 'Ubicacion' },
  ],
  CART_LABEL: 'Carrito',
  MOBILE_MENU_ARIA: 'Abrir menú',
} as const;
