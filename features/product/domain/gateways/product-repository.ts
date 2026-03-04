import type { Product } from '../entities/product';
import type { CreateProductRequest } from '../dto/create-product-request';
import type { UpdateProductRequest } from '../dto/update-product-request';

export interface ProductRepository {
  getProducts(categoryId?: string): Promise<Product[]>;
  createProduct(data: CreateProductRequest, token: string): Promise<Product>;
  updateProduct(id: string, data: UpdateProductRequest, token: string): Promise<Product>;
  deleteProduct(id: string, token: string): Promise<void>;
}
