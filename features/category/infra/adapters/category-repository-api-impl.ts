import type { HttpGateway } from '@/shared/domain/gateways/http-gateway';
import type { CategoryRepository } from '../../domain/gateways/category-repository';
import type { Category } from '../../domain/entities/category';
import { API_ENDPOINTS } from '@/constants/api';

export class CategoryRepositoryApiImpl implements CategoryRepository {
  constructor(private readonly http: HttpGateway) {}

  getActiveCategories(): Promise<Category[]> {
    return this.http.get<Category[]>(API_ENDPOINTS.CATEGORIES.LIST);
  }
}
