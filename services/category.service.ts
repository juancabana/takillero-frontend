import { apiFetch } from '@/services/api.client';
import { API_ENDPOINTS } from '@/constants/api';
import { Category } from '@/types/category.types';

/**
 * Servicio del dominio Category.
 * Abstrae las llamadas HTTP relacionadas con categorías de productos.
 */
export const categoryService = {
  getActiveCategories: (): Promise<Category[]> =>
    apiFetch<Category[]>(API_ENDPOINTS.CATEGORIES.LIST),
};
