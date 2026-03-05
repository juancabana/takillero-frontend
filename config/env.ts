/**
 * Módulo de configuración de variables de entorno tipadas.
 * Este es el único punto donde se accede a process.env.
 *
 * IMPORTANTE: En static export (S3), solo las variables con prefijo
 * NEXT_PUBLIC_ son incrustadas en el bundle del cliente en build time.
 */
export const env = {
  // TODO [PRODUCCIÓN]: Configurar NEXT_PUBLIC_BACKEND_URL con la URL del backend en producción antes de hacer build
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3000/api',
} as const;
