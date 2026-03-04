export const productKeys = {
  all: ['products'] as const,
  list: () => [...productKeys.all, 'list'] as const,
  byCategory: (categoryId?: string) => [...productKeys.list(), { categoryId }] as const,
};
