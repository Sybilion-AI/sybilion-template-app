import { useAuth0 } from '@auth0/auth0-react';
import {
  ChatSheet,
  PageContent,
  PageContentSection,
  PageHeader,
} from '@sybilion/uilib';

import { MessageSquareIcon } from 'lucide-react';

import { auth0SubToChatUserKey } from '../lib/auth0SubChatUserKey';
import { WORKSPACE_PATHS } from '../workspace/workspaceNav';

export function DashboardPage() {
  const { user, isAuthenticated } = useAuth0();
  const chatUserKey = auth0SubToChatUserKey(
    isAuthenticated ? user?.sub : undefined,
  );

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: WORKSPACE_PATHS.dashboard },
        ]}
        title="Dashboard"
        subheader="Example route: title, subtitle, and header actions."
        actions={
          <ChatSheet
            scopeId={
              chatUserKey != null ? `${chatUserKey}-dashboard` : undefined
            }
            triggerLabel={
              <>
                <MessageSquareIcon size={20} />
                &nbsp;AI Assistant
              </>
            }
            // presets={dashboardPresets}
          />
        }
      />
      <PageContent>
        <PageContentSection>
          <p className="text-muted-foreground text-sm">
            Replace this section with your feature UI. Add routes in{' '}
            <code className="text-xs">src/App.tsx</code> and nav items in{' '}
            <code className="text-xs">src/AppSidebar.tsx</code>.
          </p>
        </PageContentSection>
      </PageContent>
    </>
  );
}
