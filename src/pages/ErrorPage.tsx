import { Link, useSearchParams } from 'react-router-dom';

import { SybilionAuthLayout } from '@sybilion/uilib';

export function ErrorPage() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const tracking = searchParams.get('tracking');

  return (
    <SybilionAuthLayout
      title="Authentication error"
      subtitle="An error occurred during authentication. Please try again."
      logoSize="md"
    >
      <div className="text-muted-foreground space-y-4 text-sm">
        {error && (
          <div>
            <h2 className="text-foreground mb-1 text-sm font-semibold">
              Error code
            </h2>
            <p className="font-mono text-xs">{error}</p>
          </div>
        )}

        {errorDescription && (
          <div>
            <h2 className="text-foreground mb-1 text-sm font-semibold">
              Description
            </h2>
            <p>{errorDescription}</p>
          </div>
        )}

        {tracking && (
          <div>
            <h2 className="text-foreground mb-1 text-sm font-semibold">
              Tracking ID
            </h2>
            <p className="font-mono text-xs">{tracking}</p>
          </div>
        )}

        {!error && !errorDescription && (
          <p>No error details available. Please try signing in again.</p>
        )}
      </div>

      <div className="text-center">
        <Link to="/sign-in" className="text-primary text-sm underline">
          Back to sign in
        </Link>
      </div>
    </SybilionAuthLayout>
  );
}
