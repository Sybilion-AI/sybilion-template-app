import { useContext } from 'react';

import { AppAuthContext } from './AppAuthProvider';
import type { AppAuthState } from './types';

export function useAppAuth(): AppAuthState {
  const ctx = useContext(AppAuthContext);
  if (!ctx) {
    throw new Error('useAppAuth must be used within AppAuthProvider');
  }
  return ctx;
}
