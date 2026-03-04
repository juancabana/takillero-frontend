import type { Category } from '../entities/category';

export interface CategoryRepository {
  getActiveCategories(): Promise<Category[]>;
}
