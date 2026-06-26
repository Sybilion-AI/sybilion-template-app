import type { ChatResponse } from '@sybilion/uilib';

import { sybilionJwtStorageKey } from './sybilion-sdk';

function readAgentServiceUrl(): string | undefined {
  if (import.meta.env.VITE_AUTH_MODE !== 'auth0') return undefined;
  const raw = import.meta.env.VITE_AGENT_SERVICE_URL as string | undefined;
  const trimmed = raw?.trim();
  return trimmed ? trimmed.replace(/\/$/, '') : undefined;
}

function readSybilionAccessToken(): string | undefined {
  if (typeof localStorage === 'undefined') return undefined;
  return localStorage.getItem(sybilionJwtStorageKey) ?? undefined;
}

async function echoStub(
  message: string,
  targetChatId: string,
): Promise<ChatResponse> {
  await new Promise<void>(resolve => {
    setTimeout(resolve, 350);
  });
  return {
    response: `Echo (template): ${message}`,
    session_id: targetChatId,
  };
}

/** Chat HTTP client — mirrors main Sybilion app `sendChatMessage` when configured. */
export async function templateSendChatMessage(
  message: string,
  targetChatId: string,
): Promise<ChatResponse> {
  const agentServiceUrl = readAgentServiceUrl();
  if (!agentServiceUrl) {
    return echoStub(message, targetChatId);
  }

  const token = readSybilionAccessToken();
  if (!token) {
    throw new Error('No authentication token available');
  }

  const requestBody: { message: string; session_id?: string } = { message };
  if (targetChatId) {
    requestBody.session_id = targetChatId;
  }

  const response = await fetch(`${agentServiceUrl}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(
      `Chat API error: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as ChatResponse;
}
