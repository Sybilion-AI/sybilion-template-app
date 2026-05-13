import { Link } from 'react-router-dom';

import { SybilionAuthLayout } from '@sybilion/uilib';

export function ForgotPasswordPage() {
  return (
    <SybilionAuthLayout title="Forgot Password">
      <p className="text-muted-foreground text-center text-sm">
        Wire Auth0&apos;s Universal Login password reset here, or use your
        identity provider&apos;s hosted reset flow.
      </p>

      <p className="text-center text-sm">
        <Link to="/sign-in" className="text-primary underline">
          Back to sign in
        </Link>
      </p>
    </SybilionAuthLayout>
  );
}
