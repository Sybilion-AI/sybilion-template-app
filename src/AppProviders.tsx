import { useAuth0 } from '@auth0/auth0-react';
import type { ReactNode } from 'react';
import { useCallback } from 'react';

import {
  ChatProvider,
  SybilionAuthProvider,
  ThemeProvider,
  type SendChatMessageFn,
} from '@sybilion/uilib';

import { auth0SubToChatUserKey } from './lib/auth0SubChatUserKey';
import { templateSendChatMessage } from './lib/templateChatSend';
import { sybilionJwtStorageKey, sybilionSdk } from './lib/sybilion-sdk';

function ChatProviderLayer({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth0();
  const userSwitchKey = auth0SubToChatUserKey(
    isAuthenticated ? user?.sub : undefined,
  );

  const sendChatMessage = useCallback<SendChatMessageFn>(
    (message, targetChatId) => templateSendChatMessage(message, targetChatId),
    [],
  );

  return (
    <ChatProvider userSwitchKey={userSwitchKey} sendChatMessage={sendChatMessage}>
      {children}
    </ChatProvider>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN as string;
  const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string;

  return (
    <SybilionAuthProvider
      sdk={sybilionSdk}
      sybilionTokenStorageKey={sybilionJwtStorageKey}
      auth0Domain={auth0Domain}
      auth0ClientId={auth0ClientId}
      redirectUri={`${window.location.origin}/callback`}
    >
      <ChatProviderLayer>
        <ThemeProvider allowLocalStorage>{children}</ThemeProvider>
      </ChatProviderLayer>
    </SybilionAuthProvider>
  );
}
