import { env } from '@/config/env';

/**
 * Cliente HTTP base para comunicación con el backend NestJS.
 * Se ejecuta en el cliente (browser) — usa fetch estándar.
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${env.backendUrl}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(
      `API error ${response.status}: ${response.statusText} — ${url}`,
    );
  }

  return response.json() as Promise<T>;
}
