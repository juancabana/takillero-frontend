export const storeSettingsKeys = {
  all: ['store-settings'] as const,
  detail: () => [...storeSettingsKeys.all, 'detail'] as const,
};
