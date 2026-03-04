export const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
  byNumber: (orderNumber: number) => [...orderKeys.all, 'by-number', orderNumber] as const,
};
