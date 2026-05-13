import { createSybilionSDK } from '@sybilion/sdk';

export const sybilionJwtStorageKey = 'sybilion.standalone.jwt';

export const sybilionSdk = createSybilionSDK({
  baseUrl: import.meta.env.DEV
    ? ''
    : (import.meta.env.VITE_SYBILION_API_BASE_URL as string),
  apiPrefix: '/api',
  getToken: () =>
    typeof localStorage !== 'undefined'
      ? (localStorage.getItem(sybilionJwtStorageKey) ?? undefined)
      : undefined,
});
