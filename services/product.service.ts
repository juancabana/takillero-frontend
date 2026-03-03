import { apiFetch } from './api.client';
import { API_ENDPOINTS } from '@/constants/api';
import type { Product } from '@/types/product.types';

/** Coerce decimal strings (from Postgres) to numbers */
function normalizeProduct(p: Product): Product {
  return { ...p, price: Number(p.price) };
}

export const productService = {
  async getProducts(categoryId?: string): Promise<Product[]> {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    const products = await apiFetch<Product[]>(`${API_ENDPOINTS.PRODUCTS.LIST}${query}`);
    return products.map(normalizeProduct);
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
