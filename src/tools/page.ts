export function isAuthRoute(path: string): boolean {
  return (
    path === '/sign-in' ||
    path === '/callback' ||
    path === '/forgot-password' ||
    path === '/support' ||
    path === '/error'
  );
}
