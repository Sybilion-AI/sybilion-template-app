import type { ChatResponse } from '@sybilion/uilib';

/** Replace with real Sybilion chat HTTP call when backend ready. */
export async function templateSendChatMessage(
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
