import { createContext, type ReactNode } from 'react';

import { getAuthMode } from './mode';
import { Auth0AppAuthProvider } from './providers/auth0AppAuth';
import { MockAuthProvider } from './providers/mockAuth';
import type { AppAuthState } from './types';

export const AppAuthContext = createContext<AppAuthState | null>(null);

export function AppAuthProvider({ children }: { children: ReactNode }) {
  const mode = getAuthMode();

  if (mode === 'auth0') {
    return <Auth0AppAuthProvider>{children}</Auth0AppAuthProvider>;
  }

  return <MockAuthProvider>{children}</MockAuthProvider>;
}
