import { CURRENCY_CONFIG } from '@/constants/shared';

/**
 * Formatea un número como precio en la moneda configurada (COP).
 * Se usa en TODA la app — un solo lugar para cambiarlo.
 */
export const formatPrice = (price: number): string =>
  new Intl.NumberFormat(CURRENCY_CONFIG.LOCALE, {
    style: 'currency',
    currency: CURRENCY_CONFIG.CURRENCY,
    minimumFractionDigits: CURRENCY_CONFIG.MINIMUM_FRACTION_DIGITS,
  }).format(price);
