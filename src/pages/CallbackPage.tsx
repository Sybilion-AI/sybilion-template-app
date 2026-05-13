import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useSybilionAuth } from '@sybilion/uilib';

import { getSignInRedirectPath } from '../lib/signInRedirect';

import S from './CallbackPage.module.styl';

export function CallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, error } = useSybilionAuth();
  const isPopup = typeof window !== 'undefined' && window.opener !== null;

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const errParam = urlParams.get('error');

    if (errParam || error) {
      navigate('/sign-in', { replace: true });
      return;
    }

    if (isAuthenticated) {
      navigate(getSignInRedirectPath(), { replace: true });
      return;
    }

    if (isLoading) {
      return;
    }

    navigate('/sign-in', { replace: true });
  }, [
    isAuthenticated,
    isLoading,
    navigate,
    error,
    location.search,
  ]);

  return (
    <div className={S.root}>
      <div className={S.container}>
        <div className={S.spinner} aria-hidden />
        <p className={S.message}>
          {isPopup
            ? 'Completing password reset...'
            : 'Processing authentication...'}
        </p>
      </div>
    </div>
  );
}
