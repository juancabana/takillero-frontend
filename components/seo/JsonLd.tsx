import { SEO } from '@/constants/app';

const { BUSINESS, SITE_URL } = SEO;

const schema = {
  '@context': 'https://schema.org',
  '@type': BUSINESS.TYPE,
  name: BUSINESS.NAME,
  description: BUSINESS.DESCRIPTION,
  url: SITE_URL,
  telephone: BUSINESS.PHONE,
  servesCuisine: [
    'Hamburguesas',
    'Perros calientes',
    'Salchipapas',
    'Chuzos',
    'Comida rápida colombiana',
  ],
  priceRange: BUSINESS.PRICE_RANGE,
  keywords:
    'hamburguesa, perro caliente, salchipapa, chuzo, comida rápida, domicilio, Cartagena',
  hasMenu: {
    '@type': 'Menu',
    url: `${SITE_URL}/menu/`,
    hasMenuSection: [
      {
        '@type': 'MenuSection',
        name: 'Hamburguesas',
        description: 'Hamburguesas artesanales con ingredientes frescos',
      },
      {
        '@type': 'MenuSection',
        name: 'Perros Calientes',
        description: 'Perros calientes con salsas y toppings',
      },
      {
        '@type': 'MenuSection',
        name: 'Salchipapas',
        description: 'Salchipapas con variedad de salsas',
      },
      {
        '@type': 'MenuSection',
        name: 'Chuzos',
        description: 'Chuzos de carne y pollo a la brasa',
      },
      {
        '@type': 'MenuSection',
        name: 'Bebidas',
        description: 'Bebidas frías y refrescantes',
      },
    ],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.ADDRESS.STREET,
    addressLocality: BUSINESS.ADDRESS.LOCALITY,
    addressRegion: BUSINESS.ADDRESS.REGION,
    addressCountry: BUSINESS.ADDRESS.COUNTRY,
    postalCode: BUSINESS.ADDRESS.POSTAL_CODE,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: BUSINESS.GEO.LATITUDE,
    longitude: BUSINESS.GEO.LONGITUDE,
  },
  openingHours: BUSINESS.OPENING_HOURS,
  image: `${SITE_URL}${SEO.OG_IMAGE}`,
  sameAs: [BUSINESS.SOCIAL.WHATSAPP],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
