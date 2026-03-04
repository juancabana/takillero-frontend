export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  isAvailable?: boolean;
  sortOrder?: number;
}
