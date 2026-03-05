export const API_ENDPOINTS = {
  STORE: {
    SETTINGS: '/store/settings',
    UPDATE_SETTINGS: '/store/settings',
  },
  CATEGORIES: {
    LIST: '/categories',
  },
  PRODUCTS: {
    LIST: '/products',
    BY_ID: (id: string) => `/products/${id}`,
  },
  ORDERS: {
    CREATE: '/orders',
    CREATE_POS: '/orders/pos',
    LIST: '/orders',
    BY_NUMBER: (n: number) => `/orders/by-number/${n}`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  },
  AUTH: {
    LOGIN: '/auth/login',
  },
} as const;
