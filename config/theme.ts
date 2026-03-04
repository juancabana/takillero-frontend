/**
 * Design Tokens — Sistema centralizado de estilos de la aplicación.
 *
 * Todos los colores, gradientes, sombras, border-radius y clases repetidas
 * se definen aquí.  Cualquier cambio visual global se modifica UNA sola vez.
 */

// ── Colores base (Tailwind class fragments) ──────────────────────────
export const colors = {
  // Brand / primarios
  primary: {
    50: 'orange-50',
    100: 'orange-100',
    200: 'orange-200',
    300: 'orange-300',
    400: 'orange-400',
    500: 'orange-500',
    600: 'orange-600',
    700: 'orange-700',
  },
  accent: {
    500: 'red-500',
    600: 'red-600',
    700: 'red-700',
  },
  success: {
    50: 'green-50',
    100: 'green-100',
    400: 'green-400',
    500: 'green-500',
    600: 'green-600',
    700: 'green-700',
  },
  danger: {
    50: 'red-50',
    100: 'red-100',
    200: 'red-200',
    400: 'red-400',
    500: 'red-500',
    600: 'red-600',
    700: 'red-700',
  },
  warning: {
    50: 'yellow-50',
    100: 'yellow-100',
    200: 'yellow-200',
    600: 'yellow-600',
    700: 'yellow-700',
    800: 'yellow-800',
  },
  info: {
    50: 'blue-50',
    100: 'blue-100',
    200: 'blue-200',
    500: 'blue-500',
    600: 'blue-600',
    700: 'blue-700',
    800: 'blue-800',
  },
  neutral: {
    50: 'gray-50',
    100: 'gray-100',
    200: 'gray-200',
    300: 'gray-300',
    400: 'gray-400',
    500: 'gray-500',
    600: 'gray-600',
    700: 'gray-700',
    800: 'gray-800',
    900: 'gray-900',
  },
} as const;

// ── Clases compuestas reutilizables ──────────────────────────────────

/** Gradientes */
export const gradients = {
  brandText: 'bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent',
  brandBg: 'bg-gradient-to-r from-orange-500 to-red-600',
  brandBgHover: 'bg-gradient-to-r from-orange-600 to-red-700',
  heroBg: 'bg-gradient-to-br from-orange-50 via-white to-red-50',
  heroOverlay: 'bg-gradient-to-t from-black/70 via-black/20 to-transparent',
  heroFullBg: 'bg-gradient-to-br from-orange-500 via-orange-600 to-red-700',
} as const;

/** Botones — clases base por variante */
export const btn = {
  base: 'inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none',
  primary:
    'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200 hover:shadow-xl hover:shadow-orange-300',
  primaryPill:
    'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl rounded-full',
  outline:
    'bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300',
  outlineWhite:
    'border-2 border-white text-white hover:bg-white hover:text-orange-600 rounded-full',
  success: 'bg-green-500 hover:bg-green-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  info: 'bg-blue-500 hover:bg-blue-600 text-white',
  ghost: 'text-gray-600 hover:text-gray-900',
  disabled: 'bg-gray-300 cursor-not-allowed text-white',
  whatsapp:
    'bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-200',
} as const;

/** Tamaños de botón */
export const btnSize = {
  xs: 'px-3 py-1.5 text-xs',
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
} as const;

/** Inputs / campos de formulario */
export const input = {
  base: 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all',
  withIcon: 'pl-12 pr-4',
  error: 'border-red-300',
  select:
    'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all',
  textarea:
    'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all resize-none',
} as const;

/** Cards / contenedores */
export const card = {
  base: 'bg-white rounded-2xl border border-gray-100 shadow-sm',
  hover: 'bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow',
  flat: 'bg-white rounded-2xl p-6 border border-gray-100 shadow-sm',
  info: 'bg-blue-50 rounded-2xl border border-blue-200',
  success: 'bg-green-50 rounded-2xl border border-green-200',
  warning: 'bg-amber-50 rounded-xl border border-amber-200',
  danger: 'bg-red-50 rounded-2xl border border-red-200',
} as const;

/** Badges / etiquetas de estado */
export const badge = {
  base: 'inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[13px]',
  pill: 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-[13px] font-semibold',
  success: 'bg-green-100 text-green-700',
  danger: 'bg-red-100 text-red-700',
  warning: 'bg-yellow-100 text-yellow-700',
  info: 'bg-blue-100 text-blue-600',
  neutral: 'bg-gray-100 text-gray-600',
  primary: 'bg-orange-100 text-orange-700',
  purple: 'bg-purple-100 text-purple-700',
} as const;

/** Layouts / contenedores de página */
export const layout = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  containerNarrow: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
  containerXNarrow: 'max-w-2xl mx-auto px-4 sm:px-6',
  page: 'min-h-screen bg-gray-50',
  section: 'py-16',
  sectionWhite: 'py-16 bg-white',
} as const;

/** Iconos contenedores (icon box) */
export const iconBox = {
  sm: 'w-9 h-9 rounded-xl flex items-center justify-center',
  md: 'w-10 h-10 rounded-xl flex items-center justify-center',
  lg: 'w-12 h-12 rounded-xl flex items-center justify-center',
  xl: 'w-24 h-24 rounded-full flex items-center justify-center',
  primary: 'bg-orange-100 text-orange-600',
  success: 'bg-green-100 text-green-600',
  danger: 'bg-red-100 text-red-600',
  warning: 'bg-yellow-100 text-yellow-600',
  info: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
} as const;

/** Tipografía — font-weight + size combinados */
export const text = {
  pageTitle: { fontSize: '32px', fontWeight: 700 } as const,
  sectionTitle: { fontSize: '28px', fontWeight: 700 } as const,
  cardTitle: { fontSize: '18px', fontWeight: 600 } as const,
  label: { fontSize: '14px', fontWeight: 500 } as const,
  labelBold: { fontSize: '14px', fontWeight: 600 } as const,
  small: { fontSize: '13px' } as const,
  smallBold: { fontSize: '13px', fontWeight: 600 } as const,
  xs: { fontSize: '12px' } as const,
  xsBold: { fontSize: '12px', fontWeight: 600 } as const,
  price: { fontSize: '18px', fontWeight: 700 } as const,
  bigPrice: { fontSize: '24px', fontWeight: 700 } as const,
  hugePrice: { fontSize: '42px', fontWeight: 800 } as const,
} as const;

/** Overlay / modal */
export const overlay = {
  backdrop: 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4',
  panel: 'bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto',
} as const;

/** Pill filter buttons (e.g. categorías, estados) */
export const pill = {
  base: 'shrink-0 px-5 py-2.5 rounded-xl transition-all font-medium',
  active: 'bg-orange-500 text-white shadow-md shadow-orange-200',
  inactive: 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300',
} as const;

/** Colores de tooltip/stepper */
export const stepper = {
  completed: 'bg-green-500 text-white',
  current: 'bg-orange-500 text-white ring-4 ring-orange-100',
  upcoming: 'bg-gray-200 text-gray-400',
  barCompleted: 'bg-orange-500',
  barUpcoming: 'bg-gray-200',
} as const;

/** Skeleton / loading */
export const skeleton = {
  base: 'bg-white rounded-2xl animate-pulse border border-gray-100',
} as const;

/** Toggle / switch */
export const toggle = {
  track: (on: boolean) =>
    `relative w-14 h-8 rounded-full transition-all ${on ? 'bg-green-500' : 'bg-gray-300'}`,
  thumb: (on: boolean) =>
    `absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${on ? 'left-7' : 'left-1'}`,
  trackSm: (on: boolean) =>
    `relative w-10 h-6 rounded-full transition-all ${on ? 'bg-green-500' : 'bg-gray-300'}`,
  thumbSm: (on: boolean) =>
    `absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${on ? 'left-4' : 'left-0.5'}`,
} as const;

// ── Quantity Stepper ─────────────────────────────────────────────────
export const quantityStepper = {
  btn: 'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
  decrement: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
  increment: 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm',
  value: 'w-8 text-center text-orange-600 font-bold text-[15px]',
} as const;
