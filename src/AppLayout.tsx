import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { MeResponse } from "@sybilion/platform-sdk";
import { SettingsIcon } from "lucide-react";

import {
  AppHeaderHost,
  AppShell,
  AppShellMainContent,
  DropdownMenuItem,
  PageFooter,
  PageScroll,
  SybilionAppHeader,
  useSybilionAuth,
  useTheme,
} from "@sybilion/uilib";

import { AppSidebar } from "./AppSidebar";
import { sybilionSdk } from "./lib/sybilion-sdk";
import { WORKSPACE_PATHS } from "./workspace/workspaceNav";

const USER_LS_KEY = "user";

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
      (typeof u.id === "number" || typeof u.id === "string") &&
      typeof u.email === "string" &&
      typeof u.name === "string"
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
    avatar: u.avatar ?? "",
  };
}

export function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, isLoading } = useSybilionAuth();
  const { theme, toggleTheme } = useTheme();

  const [user, setUser] = useState<HeaderUser | null>(null);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
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
            avatar: u.avatar != null && u.avatar !== "" ? u.avatar : undefined,
          };
          writeUserToLs(persisted);
          setUser(persistedToHeader(persisted));
        }
      })
      .catch(() => undefined)
      .finally(() => setUserLoading(false));
  }, [isAuthenticated, isLoading]);

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
            />
          }
        >
          <SybilionAppHeader
            pathname={location.pathname}
            onNavigate={(href: string) => navigate(href)}
            authenticated
            appsStorageKey="sybilionAppTemplate.workspaceApps"
            defaultApps={[]}
            user={user}
            isAuthenticated
            isLoading={userLoading && user == null}
            theme={theme}
            onThemeToggle={toggleTheme}
            onLogout={logout}
            menuItems={
              <>
                <DropdownMenuItem onSelect={() => navigate("/settings")}>
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
