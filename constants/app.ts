/**
 * Constantes de metadatos de la aplicación (layout principal).
 */
export const APP_METADATA = {
  TITLE_DEFAULT: 'Takillero — Hamburguesas, Perros Calientes, Salchipapas y Chuzos en Cartagena',
  TITLE_TEMPLATE: '%s | Takillero',
  DESCRIPTION:
    'Pide hamburguesas, perros calientes, salchipapas y chuzos a domicilio en Cartagena. La mejor comida rápida colombiana con entrega rápida. Pide por WhatsApp.',
  LANG: 'es',
} as const;

/**
 * Constantes SEO globales.
 */
export const SEO = {
  SITE_URL: 'https://takillero.com',
  OG_IMAGE: '/og-image.jpg',
  LOCALE: 'es_CO',

  PAGES: {
    HOME: {
      TITLE: 'Takillero — Hamburguesas, Perros Calientes, Salchipapas y Chuzos en Cartagena',
      DESCRIPTION:
        'Pide hamburguesas, perros calientes, salchipapas y chuzos a domicilio en Cartagena. La mejor comida rápida colombiana con entrega rápida.',
    },
    MENU: {
      TITLE: 'Menú — Hamburguesas, Perros, Salchipapas, Chuzos y Bebidas',
      DESCRIPTION:
        'Explora nuestro menú: hamburguesas artesanales, perros calientes, salchipapas, chuzos y bebidas. Precios desde $4.000 COP. Pide a domicilio en Cartagena.',
    },
    UBICACION: {
      TITLE: 'Ubicación y Horarios',
      DESCRIPTION:
        'Encuéntranos en La Troncal, CR 59C #24A–97, Cartagena. Hamburguesas, perros calientes, salchipapas y chuzos de lunes a domingo 6:00 PM a 11:30 PM.',
    },
  },

  /** Datos para JSON-LD (schema.org Restaurant / LocalBusiness). */
  BUSINESS: {
    NAME: 'Takillero',
    TYPE: 'Restaurant',
    DESCRIPTION:
      'Restaurante de comida rápida colombiana a domicilio en Cartagena. Hamburguesas, perros calientes, salchipapas, chuzos y bebidas.',
    ADDRESS: {
      STREET: 'CR 59C #24A–97, P 1 APTO 2',
      LOCALITY: 'Cartagena de Indias',
      REGION: 'Bolívar',
      COUNTRY: 'CO',
      POSTAL_CODE: '130001',
    },
    GEO: {
      LATITUDE: 10.390117,
      LONGITUDE: -75.4927715,
    },
    PHONE: '+57 324 477 9505',
    CUISINE: 'Comida rápida colombiana',
    PRICE_RANGE: '$',
    OPENING_HOURS: ['Mo-Su 18:00-23:30'],
    SOCIAL: {
      WHATSAPP: 'https://wa.me/573244779505',
    },
  },
} as const;
