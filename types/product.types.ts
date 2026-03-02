export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  categoryId: string;
  isAvailable: boolean;
  sortOrder: number;
}
