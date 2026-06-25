export type AppAuthMode = 'mock' | 'auth0';

export type AppAuthUser = {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
};

export type AppAuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AppAuthUser | null;
  logout: () => void;
};
