/** Stable 32-bit int for {@link ChatProvider} `userSwitchKey` from a user `sub`. */
export function userSubToChatKey(sub: string | undefined): number | null {
  if (!sub) return null;
  let h = 0;
  for (let i = 0; i < sub.length; i++) {
    h = (Math.imul(31, h) + sub.charCodeAt(i)) | 0;
  }
  return h;
}

/** @deprecated Use {@link userSubToChatKey} */
export const auth0SubToChatUserKey = userSubToChatKey;

/** @deprecated Use {@link userSubToChatKey} */
export const subToChatUserKey = userSubToChatKey;
