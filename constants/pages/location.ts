/**
 * Constantes de la página de ubicación (app/ubicacion/page.tsx).
 */
export const LOCATION_PAGE = {
  TITLE: 'Nuestra Ubicación',
  SUBTITLE: 'Encuéntranos o pide a domicilio',

  // ── Mapa ───────────────────────────────────────────────────────────
  MAP_TITLE: 'Ubicación Takillero',
  MAP_EMBED_URL:
    'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d490.5494562292169!2d-75.4927715!3d10.390117!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef625cfbd3db57d%3A0xaa6d607d6f1f49a5!2sTakillero!5e0!3m2!1ses!2sco!4v1772551319222!5m2!1ses!2sco',
  MAP_LINK: 'https://maps.app.goo.gl/Tof1rsGaqDKkGoeW8',
  OPEN_GOOGLE_MAPS: 'Abrir en Google Maps',

  // ── Dirección ──────────────────────────────────────────────────────
  ADDRESS_TITLE: 'Dirección',
  ADDRESS_LINE_1: 'La Troncal, CR 59C #24A–97',
  ADDRESS_LINE_2: 'P 1 APTO 2, Tacarena',
  ADDRESS_LINE_3: 'Cartagena de Indias, Bolívar',
  ADDRESS_REFERENCE: 'Donde quedaba Tatabluo',

  // ── Horarios ───────────────────────────────────────────────────────
  SCHEDULE_TITLE: 'Horarios',
  SCHEDULE_OPEN_NOW: 'Abierto ahora',
  SCHEDULE: [
    { days: 'Lunes - Jueves', hours: '6:00 PM - 11:30 PM' },
    { days: 'Viernes - Sábado', hours: '6:00 PM - 11:30 PM' },
    { days: 'Domingos', hours: '6:00 PM - 11:30 PM' },
  ],

  // ── Contacto ───────────────────────────────────────────────────────
  CONTACT_TITLE: 'Contacto',
  PHONE_NUMBER: '+57 324 477 9505',
  PHONE_HREF: 'tel:+3244779505',
  WHATSAPP_HREF: 'https://wa.me/573244779505',
  WHATSAPP_CTA: 'Escríbenos por WhatsApp',

  // ── Zonas de domicilio ─────────────────────────────────────────────
  DELIVERY_ZONES_TITLE: 'Zonas de Domicilio',
  DELIVERY_ZONES: [
    'Centro',
    'La Candelaria',
    'Chapinero',
    'Teusaquillo',
    'Santa Fe',
    'Los Mártires',
  ],
  DELIVERY_FEE_NOTE: 'Domicilio: $5.000 COP en todas las zonas',
} as const;
