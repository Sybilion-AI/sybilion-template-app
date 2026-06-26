import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sybilionJwtStorageKey } from './sybilion-sdk';
import { templateSendChatMessage } from './templateChatSend';

describe('templateSendChatMessage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('echoes when VITE_AGENT_SERVICE_URL is unset', async () => {
    vi.stubEnv('VITE_AUTH_MODE', 'mock');
    vi.stubEnv('VITE_AGENT_SERVICE_URL', '');

    const result = await templateSendChatMessage('hello', 'chat-1');

    expect(result.session_id).toBe('chat-1');
    expect(result.response).toContain('Echo (template): hello');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('echoes in mock mode even when agent URL is set', async () => {
    vi.stubEnv('VITE_AUTH_MODE', 'mock');
    vi.stubEnv('VITE_AGENT_SERVICE_URL', 'https://agent-staging.sybilion.com');

    const result = await templateSendChatMessage('hello', 'chat-1');

    expect(result.response).toContain('Echo (template): hello');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('posts to agent service with Sybilion JWT when configured', async () => {
    vi.stubEnv('VITE_AUTH_MODE', 'auth0');
    vi.stubEnv('VITE_AGENT_SERVICE_URL', 'https://agent-staging.sybilion.com');
    localStorage.setItem(sybilionJwtStorageKey, 'sybilion-jwt');

    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({ response: 'Agent reply', session_id: 'chat-1' }),
        { status: 200 },
      ),
    );

    const result = await templateSendChatMessage('hello', 'chat-1');

    expect(fetch).toHaveBeenCalledWith(
      'https://agent-staging.sybilion.com/chat',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer sybilion-jwt',
        }),
      }),
    );
    expect(result.response).toBe('Agent reply');
  });

  it('throws when agent URL is set but no Sybilion JWT is stored', async () => {
    vi.stubEnv('VITE_AUTH_MODE', 'auth0');
    vi.stubEnv('VITE_AGENT_SERVICE_URL', 'https://agent-staging.sybilion.com');

    await expect(
      templateSendChatMessage('hello', 'chat-1'),
    ).rejects.toThrow('No authentication token available');
  });
});
