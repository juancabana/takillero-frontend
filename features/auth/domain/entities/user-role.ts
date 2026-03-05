export type UserRole = 'admin' | 'cajero' | 'cocina' | 'domiciliario';

export const ROLE_CONFIG: Record<UserRole, { label: string; color: string; bg: string; description: string }> = {
  admin: {
    label: 'Logistica / Admin',
    color: 'text-orange-700',
    bg: 'bg-orange-100',
    description: 'Acceso completo a todas las secciones',
  },
  cajero: {
    label: 'Cajero',
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    description: 'Crear pedidos desde el POS',
  },
  cocina: {
    label: 'Cocina',
    color: 'text-amber-700',
    bg: 'bg-amber-100',
    description: 'Ver pedidos confirmados para preparar',
  },
  domiciliario: {
    label: 'Domiciliario',
    color: 'text-teal-700',
    bg: 'bg-teal-100',
    description: 'Ver y marcar pedidos como entregados',
  },
};

export const ROLE_ACCESS: Record<UserRole, string[]> = {
  admin: ['dashboard', 'pedidos', 'pos', 'productos', 'configuracion', 'usuarios'],
  cajero: ['pos'],
  cocina: ['pedidos'],
  domiciliario: ['pedidos'],
};
