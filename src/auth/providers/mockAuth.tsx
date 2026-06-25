import type { ReactNode } from 'react';
import { useMemo } from 'react';

import { AppAuthContext } from '../AppAuthProvider';
import type { AppAuthUser } from '../types';

/**
 * Hardcoded demo user used when `VITE_AUTH_MODE=mock`.
 *
 * The `sub` field is shaped like an Auth0 `sub` ("provider|id") so chat scope
 * keys via {@link userSubToChatKey} keep the same characteristics as auth0 mode.
 */
export const FAKE_USER = {
  sub: 'demo|user',
  email: 'demo@sybilion.com',
  name: 'Demo User',
  picture: '',
} as const satisfies AppAuthUser;

export type FakeUser = typeof FAKE_USER;

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const value = useMemo(
    () => ({
      isAuthenticated: true as const,
      isLoading: false as const,
      user: FAKE_USER,
      logout: () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard';
        }
      },
    }),
    [],
  );

  return (
    <AppAuthContext.Provider value={value}>{children}</AppAuthContext.Provider>
  );
}
