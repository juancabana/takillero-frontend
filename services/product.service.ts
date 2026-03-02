import { apiFetch } from './api.client';
import { API_ENDPOINTS } from '@/constants/api';
import type { Product } from '@/types/product.types';

export const productService = {
  getProducts(categoryId?: string): Promise<Product[]> {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    return apiFetch<Product[]>(`${API_ENDPOINTS.PRODUCTS.LIST}${query}`);
  },

  createProduct(data: Partial<Product>, token: string): Promise<Product> {
    return apiFetch<Product>(API_ENDPOINTS.PRODUCTS.LIST, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  updateProduct(id: string, data: Partial<Product>, token: string): Promise<Product> {
    return apiFetch<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  deleteProduct(id: string, token: string): Promise<void> {
    return apiFetch<void>(API_ENDPOINTS.PRODUCTS.BY_ID(id), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
