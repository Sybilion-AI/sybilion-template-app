import { PageContent, PageContentSection, PageHeader } from '@sybilion/uilib';

import { WORKSPACE_PATHS } from '../workspace/workspaceNav';

export function SettingsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: WORKSPACE_PATHS.dashboard },
          { label: 'Settings', href: WORKSPACE_PATHS.settings },
        ]}
        title="Settings"
        subheader="Stub page — customize or remove."
      />
      <PageContent>
        <PageContentSection>
          <p className="text-muted-foreground text-sm">Settings content goes here.</p>
        </PageContentSection>
      </PageContent>
    </>
  );
}
