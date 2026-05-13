/** Stable 32-bit int for {@link ChatProvider} `userSwitchKey` from Auth0 `sub`. */
export function auth0SubToChatUserKey(sub: string | undefined): number | null {
  if (!sub) return null;
  let h = 0;
  for (let i = 0; i < sub.length; i++) {
    h = (Math.imul(31, h) + sub.charCodeAt(i)) | 0;
  }
  return h;
}
