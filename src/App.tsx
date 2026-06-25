import { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { SidebarProvider, SignInPage } from '@sybilion/uilib';

import { AppLayout } from './AppLayout';
import { isAuth0Mode, useAppAuth } from './auth';
import { REDIRECT_PATH_KEY, getSignInRedirectPath } from './lib/signInRedirect';
import { AccountPage } from './pages/AccountPage';
import { CallbackPage } from './pages/CallbackPage';
import { DashboardPage } from './pages/DashboardPage';
import { ErrorPage } from './pages/ErrorPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { SettingsPage } from './pages/SettingsPage';
import { SupportPage } from './pages/SupportPage';
import { isAuthRoute } from './tools/page';
import { WORKSPACE_PATHS } from './workspace/workspaceNav';

export function App() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAppAuth();
  const showAuthRoutes = isAuth0Mode();

  const effectiveAuthenticated = showAuthRoutes ? isAuthenticated : true;

  const signInRedirectPath = useMemo(
    () =>
      effectiveAuthenticated
        ? getSignInRedirectPath()
        : WORKSPACE_PATHS.dashboard,
    [effectiveAuthenticated],
  );

  useEffect(() => {
    if (!isLoading && effectiveAuthenticated) {
      const savedPath = localStorage.getItem(REDIRECT_PATH_KEY);
      if (savedPath) {
        const currentPath = location.pathname + location.search;
        if (savedPath === currentPath || savedPath === location.pathname) {
          localStorage.removeItem(REDIRECT_PATH_KEY);
        }
      }
    }
  }, [location.pathname, location.search, effectiveAuthenticated, isLoading]);

  const workspaceRoutes = (
    <>
      <Route
        path="/"
        element={<Navigate to={WORKSPACE_PATHS.dashboard} replace />}
      />
      <Route path={WORKSPACE_PATHS.dashboard} element={<DashboardPage />} />
      <Route path={WORKSPACE_PATHS.account} element={<AccountPage />} />
      <Route path={WORKSPACE_PATHS.settings} element={<SettingsPage />} />
      {showAuthRoutes && (
        <>
          <Route
            path="/sign-in"
            element={<Navigate to={signInRedirectPath} replace />}
          />
          <Route path="/callback" element={<CallbackPage />} />
        </>
      )}
      <Route
        path="*"
        element={<Navigate to={signInRedirectPath} replace />}
      />
    </>
  );

  const authRoutes = showAuthRoutes ? (
    <>
      <Route path="/callback" element={<CallbackPage />} />
      <Route
        path="/sign-in"
        element={
              <SignInPage
                containerClassName={undefined}
                forgotPasswordTo="/forgot-password"
                logoSize={undefined}
                versionLabel="0.0.1"
              />
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </>
  ) : null;

  const routes = (
    <Routes>
      {effectiveAuthenticated ? workspaceRoutes : authRoutes}
    </Routes>
  );

  const showWorkspaceShell =
    effectiveAuthenticated && !isAuthRoute(location.pathname);

  return showWorkspaceShell ? (
    <SidebarProvider
      sidebarWidthStorageKey="sybilionAppTemplate.sidebarWidthPx"
      persistSidebarWidthWithoutConsent
    >
      <AppLayout>{routes}</AppLayout>
    </SidebarProvider>
  ) : (
    routes
  );
}
