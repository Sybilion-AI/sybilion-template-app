import { PageContent, PageContentSection, PageHeader } from '@sybilion/uilib';

import { WORKSPACE_PATHS } from '../workspace/workspaceNav';

export function AccountPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: WORKSPACE_PATHS.dashboard },
          { label: 'Account', href: WORKSPACE_PATHS.account },
        ]}
        title="Account"
        subheader="Stub page — customize or remove."
      />
      <PageContent>
        <PageContentSection>
          <p className="text-muted-foreground text-sm">Account content goes here.</p>
        </PageContentSection>
      </PageContent>
    </>
  );
}
