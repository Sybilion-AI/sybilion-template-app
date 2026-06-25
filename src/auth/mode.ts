import type { AppAuthMode } from './types';

export function getAuthMode(): AppAuthMode {
  const raw = import.meta.env.VITE_AUTH_MODE as string | undefined;
  if (raw === 'auth0') return 'auth0';
  if (raw === 'mock' || raw === undefined || raw === '') return 'mock';
  throw new Error(
    `Invalid VITE_AUTH_MODE="${raw}". Expected "mock" or "auth0".`,
  );
}

export function isAuth0Mode(): boolean {
  return getAuthMode() === 'auth0';
}
