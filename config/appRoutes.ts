/**
 * Definición centralizada de todas las rutas de la aplicación.
 * REGLA: Nunca usar strings literales para navegación.
 * SIEMPRE usar appRoutes.KEY.getHref() en toda la app.
 */
export const appRoutes = {
  HOME: {
    path: '/',
    getHref: () => '/',
  },
  MENU: {
    path: '/menu',
    getHref: () => '/menu',
    BY_CATEGORY: {
      path: '/menu',
      getHref: ({ categoriaId }: { categoriaId: string }) =>
        `/menu?categoria=${categoriaId}`,
    },
  },
  UBICACION: {
    path: '/ubicacion',
    getHref: () => '/ubicacion',
  },
} as const;
