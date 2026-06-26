import { useAuth0 } from '@auth0/auth0-react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

import { SybilionAuthProvider, useSybilionAuth } from '@sybilion/uilib';

import { sybilionJwtStorageKey, sybilionSdk } from '../../lib/sybilion-sdk';
import { AppAuthContext } from '../AppAuthProvider';
import type { AppAuthUser } from '../types';

function optionalAuth0Env(name: 'VITE_AUTH0_AUDIENCE'): string | undefined {
  const value = import.meta.env[name] as string | undefined;
  return value || undefined;
}

function requireAuth0Env(name: 'VITE_AUTH0_DOMAIN' | 'VITE_AUTH0_CLIENT_ID'): string {
  const value = import.meta.env[name] as string | undefined;
  if (!value) {
    throw new Error(
      `${name} is required when VITE_AUTH_MODE=auth0. Set it in .env or switch to VITE_AUTH_MODE=mock.`,
    );
  }
  return value;
}

function Auth0ContextBridge({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, logout } = useSybilionAuth();
  const { user } = useAuth0();

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user: user
        ? ({
            sub: user.sub,
            email: user.email,
            name: user.name,
            picture: user.picture,
          } satisfies AppAuthUser)
        : null,
      logout,
    }),
    [isAuthenticated, isLoading, logout, user],
  );

  return (
    <AppAuthContext.Provider value={value}>{children}</AppAuthContext.Provider>
  );
}

export function Auth0AppAuthProvider({ children }: { children: ReactNode }) {
  const auth0Domain = requireAuth0Env('VITE_AUTH0_DOMAIN');
  const auth0ClientId = requireAuth0Env('VITE_AUTH0_CLIENT_ID');
  const auth0Audience = optionalAuth0Env('VITE_AUTH0_AUDIENCE');

  return (
    <SybilionAuthProvider
      sdk={sybilionSdk}
      sybilionTokenStorageKey={sybilionJwtStorageKey}
      auth0Domain={auth0Domain}
      auth0ClientId={auth0ClientId}
      redirectUri={`${window.location.origin}/callback`}
      authorizationParams={auth0Audience ? { audience: auth0Audience } : undefined}
    >
      <Auth0ContextBridge>{children}</Auth0ContextBridge>
    </SybilionAuthProvider>
  );
}
