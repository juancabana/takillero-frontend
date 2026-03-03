/**
 * Constantes del componente BusinessClosed (components/BusinessClosed.tsx).
 */
export const BUSINESS_CLOSED = {
  TITLE: 'Negocio Cerrado',
  DEFAULT_MESSAGE: 'Estamos cerrados por el momento.',
  SCHEDULE_TITLE: 'Nuestro Horario',
  DEFAULT_SCHEDULE: [
    { days: 'Lun - Jue', open: '4:00 PM', close: '11:00 PM' },
    { days: 'Vie - Sáb', open: '4:00 PM', close: '1:00 AM' },
    { days: 'Domingos', open: '12:00 PM', close: '10:00 PM' },
  ],
  FAREWELL_MESSAGE: 'Vuelve pronto, te esperamos con los mejores sabores',
} as const;
