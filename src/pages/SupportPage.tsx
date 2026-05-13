import { Link } from 'react-router-dom';

import { SybilionAuthLayout } from '@sybilion/uilib';

export function SupportPage() {
  return (
    <SybilionAuthLayout
      title="Support"
      subtitle="We're here to help you with any questions or issues."
      logoSize="md"
    >
      <div className="text-muted-foreground space-y-4 text-center text-sm">
        <div>
          <h2 className="text-foreground mb-2 text-base font-semibold">
            Contact us
          </h2>
          <p>If you need assistance, please reach out:</p>
          <a href="mailto:support@sybilion.com" className="text-primary underline">
            support@sybilion.com
          </a>
        </div>
      </div>

      <div className="text-center">
        <Link to="/sign-in" className="text-primary text-sm underline">
          Back to sign in
        </Link>
      </div>
    </SybilionAuthLayout>
  );
}
