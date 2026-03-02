/**
 * Constantes de UI: textos estáticos, labels y configuración visual.
 */
export const HOME_CONTENT = {
  HERO: {
    SUBTITLE: 'La mejor comida rápida de tu ciudad, hecha con amor y sazón.',
    CTA_MENU: 'Ver Menú',
    CTA_LOCATION: '¿Dónde estamos?',
  },
  FEATURES: [
    {
      icon: '⚡',
      title: 'Entrega Rápida',
      description: 'Tu pedido listo en minutos, sin esperas.',
    },
    {
      icon: '🌿',
      title: 'Siempre Fresco',
      description: 'Ingredientes frescos seleccionados cada día.',
    },
    {
      icon: '📱',
      title: 'Fácil de Pedir',
      description: 'Ordena en segundos desde tu dispositivo.',
    },
  ],
  CATEGORIES_TITLE: 'Nuestro Menú',
  CATEGORIES_SUBTITLE: 'Elige tu categoría favorita',
  CLOSED_BANNER_DEFAULT:
    'Estamos cerrados por el momento. ¡Vuelve pronto!',
} as const;
