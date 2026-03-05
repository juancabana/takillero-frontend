/**
 * Constantes de la página de inicio (app/page.tsx).
 */
export const HOME_PAGE = {
  BADGE_DELIVERY: 'Domicilios disponibles',
  BADGE_PICKUP: 'Recoge en establecimiento',
  BADGE_TEXT: 'Domicilios disponibles',
  DELIVERY_DISABLED_BANNER: 'Los domicilios estan temporalmente desactivados. Solo pedidos para recoger en establecimiento.',
  HERO_WELCOME_PREFIX: 'Bienvenido a',
  HERO_TITLE_PREFIX: 'El sabor que te',
  HERO_TITLE_HIGHLIGHT: 'enamora',
  HERO_TITLE_SUFFIX: 'en cada bocado',
  HERO_DESCRIPTION:
    'Perros, hamburguesas, salchipapas y mucho más. Pide tu favorito y te lo llevamos hasta la puerta de tu casa.',
  HERO_SUBTITLE:
    'La mejor comida rápida de tu ciudad, hecha con amor y sazón.',
  CTA_MENU: 'Ver Menú',
  CTA_LOCATION: 'Ubicación',
  CTA_LOCATION_ALT: '¿Dónde estamos?',
  HERO_IMAGE_URL:
    'https://images.unsplash.com/photo-1709736792234-af63e72f1037?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXN0JTIwZm9vZCUyMHJlc3RhdXJhbnQlMjBuZW9uJTIwbmlnaHR8ZW58MXx8fHwxNzcyMjM3MTgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  HERO_IMAGE_ALT: 'Takillero comida',
  FEATURES: [
    { title: 'Domicilio Rápido', desc: 'Entrega en 30-45 minutos a tu puerta' },
    { title: 'Abierto hasta tarde', desc: 'Todos los días hasta las 11:30 PM' },
    { title: 'Calidad Premium', desc: 'Ingredientes frescos todos los días' },
  ],
  CLASSIC_FEATURES: [
    { icon: '⚡', title: 'Entrega Rápida', description: 'Tu pedido listo en minutos, sin esperas.' },
    { icon: '🌿', title: 'Siempre Fresco', description: 'Ingredientes frescos seleccionados cada día.' },
    { icon: '📱', title: 'Fácil de Pedir', description: 'Ordena en segundos desde tu dispositivo.' },
  ],
  MENU_SECTION_TITLE: 'Nuestro Menú',
  MENU_SECTION_SUBTITLE: 'Explora nuestras categorías y encuentra tu antojo perfecto',
  CATEGORIES_SUBTITLE_ALT: 'Elige tu categoría favorita',
  CATEGORIES_EMPTY: 'No hay categorías disponibles en este momento.',
  CTA_FULL_MENU: 'Ver Menú Completo',
} as const;
