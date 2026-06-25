import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { MeResponse } from '@sybilion/platform-sdk';
import { SettingsIcon } from 'lucide-react';

import {
  AppHeaderHost,
  AppShell,
  AppShellMainContent,
  DropdownMenuItem,
  PageFooter,
  PageScroll,
  SybilionAppHeader,
  useTheme,
} from '@sybilion/uilib';

import { AppSidebar } from './AppSidebar';
import { isAuth0Mode, useAppAuth } from './auth';
import { sybilionSdk } from './lib/sybilion-sdk';
import { WORKSPACE_PATHS } from './workspace/workspaceNav';

const USER_LS_KEY = 'user';

/** Mirrors sybilion-client `UnifiedUser` fields we persist for header / hydration. */
type PersistedUser = {
  id: number | string;
  email: string;
  name: string;
  avatar?: string;
};

type HeaderUser = { name: string; email: string; avatar: string };

function readUserFromLs(): PersistedUser | null {
  try {
    const raw = localStorage.getItem(USER_LS_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw) as PersistedUser;
    if (
      u &&
      (typeof u.id === 'number' || typeof u.id === 'string') &&
      typeof u.email === 'string' &&
      typeof u.name === 'string'
    ) {
      return u;
    }
    return null;
  } catch {
    return null;
  }
}

function writeUserToLs(u: PersistedUser | null): void {
  try {
    if (u === null) localStorage.removeItem(USER_LS_KEY);
    else localStorage.setItem(USER_LS_KEY, JSON.stringify(u));
  } catch {
    /* quota / blocked */
  }
}

function persistedToHeader(u: PersistedUser): HeaderUser {
  return {
    name: u.name,
    email: u.email,
    avatar: u.avatar ?? '',
  };
}

function appUserToHeader(user: {
  name?: string;
  email?: string;
  picture?: string;
}): HeaderUser {
  return {
    name: user.name ?? '',
    email: user.email ?? '',
    avatar: user.picture ?? '',
  };
}

export function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const auth0Mode = isAuth0Mode();
  const { isAuthenticated, logout, isLoading, user: authUser } = useAppAuth();
  const { theme, toggleTheme } = useTheme();

  const mockHeaderUser = useMemo(
    () => (authUser ? appUserToHeader(authUser) : null),
    [authUser],
  );

  const [user, setUser] = useState<HeaderUser | null>(null);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    if (!auth0Mode) {
      setUser(mockHeaderUser);
      return;
    }

    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      setUser(null);
      writeUserToLs(null);
      return;
    }

    const cached = readUserFromLs();
    if (cached) {
      setUser(persistedToHeader(cached));
    }

    setUserLoading(true);
    sybilionSdk.auth
      .getMe()
      .then((res: MeResponse) => {
        const u = res.data?.user;
        if (u) {
          const persisted: PersistedUser = {
            id: u.id,
            email: u.email,
            name: u.name,
            avatar: u.avatar != null && u.avatar !== '' ? u.avatar : undefined,
          };
          writeUserToLs(persisted);
          setUser(persistedToHeader(persisted));
        }
      })
      .catch(() => undefined)
      .finally(() => setUserLoading(false));
  }, [auth0Mode, isAuthenticated, isLoading, mockHeaderUser]);

  const headerUser = auth0Mode ? user : mockHeaderUser;
  const headerLoading = auth0Mode ? userLoading && headerUser == null : false;

  return (
    <PageScroll>
      <AppShell>
        <AppSidebar />

        <AppShellMainContent
          header={<AppHeaderHost />}
          footer={
            <PageFooter
              versionLink=""
              versionLabel="0.0.1"
              homeTo={WORKSPACE_PATHS.dashboard}
              brandText={auth0Mode ? undefined : ''}
            />
          }
        >
          <SybilionAppHeader
            pathname={location.pathname}
            onNavigate={(href: string) => navigate(href)}
            authenticated
            appsStorageKey="sybilionAppTemplate.workspaceApps"
            defaultApps={[]}
            user={headerUser}
            isAuthenticated
            isLoading={headerLoading}
            theme={theme}
            onThemeToggle={toggleTheme}
            onLogout={logout}
            menuItems={
              <>
                <DropdownMenuItem onSelect={() => navigate('/settings')}>
                  <SettingsIcon size={20} />
                  Settings
                </DropdownMenuItem>
              </>
            }
          />
          {children}
        </AppShellMainContent>
      </AppShell>
    </PageScroll>
  );
}
