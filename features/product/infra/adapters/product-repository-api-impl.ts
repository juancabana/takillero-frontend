import type { HttpGateway } from '@/shared/domain/gateways/http-gateway';
import type { ProductRepository } from '../../domain/gateways/product-repository';
import type { Product } from '../../domain/entities/product';
import type { CreateProductRequest } from '../../domain/dto/create-product-request';
import type { UpdateProductRequest } from '../../domain/dto/update-product-request';
import { API_ENDPOINTS } from '@/constants/api';

function normalizeProduct(p: Product): Product {
  return { ...p, price: Number(p.price) };
}

export class ProductRepositoryApiImpl implements ProductRepository {
  constructor(private readonly http: HttpGateway) {}

  async getProducts(categoryId?: string): Promise<Product[]> {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    const products = await this.http.get<Product[]>(`${API_ENDPOINTS.PRODUCTS.LIST}${query}`);
    return products.map(normalizeProduct);
  }

  async createProduct(data: CreateProductRequest, token: string): Promise<Product> {
    const product = await this.http.post<Product>(API_ENDPOINTS.PRODUCTS.LIST, data, token);
    return normalizeProduct(product);
  }

  async updateProduct(id: string, data: UpdateProductRequest, token: string): Promise<Product> {
    const product = await this.http.patch<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id), data, token);
    return normalizeProduct(product);
  }

  async deleteProduct(id: string, token: string): Promise<void> {
    return this.http.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id), token);
  }
}
