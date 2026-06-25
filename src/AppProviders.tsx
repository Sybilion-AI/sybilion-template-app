import type { ReactNode } from 'react';
import { useCallback } from 'react';

import {
  ChatProvider,
  ThemeProvider,
  type SendChatMessageFn,
} from '@sybilion/uilib';

import { AppAuthProvider, useAppAuth, userSubToChatKey } from './auth';
import { templateSendChatMessage } from './lib/templateChatSend';

function ChatProviderLayer({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAppAuth();
  const userSwitchKey = userSubToChatKey(
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
  return (
    <AppAuthProvider>
      <ChatProviderLayer>
        <ThemeProvider allowLocalStorage>{children}</ThemeProvider>
      </ChatProviderLayer>
    </AppAuthProvider>
  );
}
