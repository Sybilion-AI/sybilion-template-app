import { WORKSPACE_PATHS } from '../workspace/workspaceNav';

export const REDIRECT_PATH_KEY = 'auth_redirect_path';

export function getSignInRedirectPath(): string {
  try {
    return localStorage.getItem(REDIRECT_PATH_KEY) ?? WORKSPACE_PATHS.dashboard;
  } catch {
    return WORKSPACE_PATHS.dashboard;
  }
}
