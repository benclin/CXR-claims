import * as React from "react";
import { ComponentPage } from "@/docs/components/ComponentPage";
import { Section } from "@/docs/components/Section";
import { ExampleCard } from "@/docs/components/ExampleCard";
import { CodeBlock } from "@/docs/components/CodeBlock";
import { Guidance } from "@/docs/components/ProseBlock";
import { TokenReference, type TokenRow } from "@/docs/components/TokenReference";
import { WexTabs, WexCard, WexButton, WexInput, WexLabel } from "@/components/wex";

// Token mappings for WexTabs
// Layer 3 component tokens
const tabsTokens: TokenRow[] = [
  { element: "Trigger", property: "Text", token: "--wex-component-tabs-trigger-fg" },
  { element: "Trigger (Hover)", property: "Background", token: "--wex-component-tabs-trigger-hover-bg" },
  { element: "Trigger (Active)", property: "Text", token: "--wex-component-tabs-trigger-active-fg" },
  { element: "Indicator", property: "Color", token: "--wex-component-tabs-indicator" },
  { element: "Divider", property: "Border", token: "--wex-component-tabs-divider" },
  { element: "Focus Ring", property: "Color", token: "--wex-component-tabs-focus-ring" },
];

export default function TabsPage() {
  const [activeTab, setActiveTab] = React.useState("account");

  return (
    <ComponentPage
      title="Tabs"
      description="Tabbed content panels for organizing related content."
      status="stable"
      registryKey="tabs"
    >
      <Section title="Overview">
        <ExampleCard>
          <WexTabs defaultValue="account" className="w-full max-w-md">
            <WexTabs.List>
              <WexTabs.Trigger value="account">Account</WexTabs.Trigger>
              <WexTabs.Trigger value="password">Password</WexTabs.Trigger>
            </WexTabs.List>
            <WexTabs.Content value="account" className="p-4">
              <p className="text-sm text-muted-foreground">Account settings content.</p>
            </WexTabs.Content>
            <WexTabs.Content value="password" className="p-4">
              <p className="text-sm text-muted-foreground">Password settings content.</p>
            </WexTabs.Content>
          </WexTabs>
        </ExampleCard>
        <Guidance>
          Use tabs to organize related content into panels. Each panel should 
          contain self-contained content that makes sense without the others.
        </Guidance>
      </Section>

      <Section title="Variants" description="Different tab configurations.">
        <div className="space-y-8">
          <ExampleCard title="Full-Width Tabs" description="Tabs spanning container width.">
            <WexTabs defaultValue="overview" className="w-full">
              <WexTabs.List className="grid w-full grid-cols-3">
                <WexTabs.Trigger value="overview">Overview</WexTabs.Trigger>
                <WexTabs.Trigger value="analytics">Analytics</WexTabs.Trigger>
                <WexTabs.Trigger value="reports">Reports</WexTabs.Trigger>
              </WexTabs.List>
              <WexTabs.Content value="overview" className="p-4">
                <p className="text-sm text-muted-foreground">Overview dashboard content.</p>
              </WexTabs.Content>
              <WexTabs.Content value="analytics" className="p-4">
                <p className="text-sm text-muted-foreground">Detailed analytics data.</p>
              </WexTabs.Content>
              <WexTabs.Content value="reports" className="p-4">
                <p className="text-sm text-muted-foreground">Generated reports.</p>
              </WexTabs.Content>
            </WexTabs>
          </ExampleCard>

          <ExampleCard title="Tabs in Card" description="Integrated with card layout.">
            <WexCard className="w-full max-w-md">
              <WexCard.Header>
                <WexCard.Title>Account Settings</WexCard.Title>
                <WexCard.Description>Manage your account preferences.</WexCard.Description>
              </WexCard.Header>
              <WexCard.Content className="p-0">
                <WexTabs defaultValue="profile">
                  <WexTabs.List className="w-full rounded-none border-b">
                    <WexTabs.Trigger value="profile" className="rounded-none">Profile</WexTabs.Trigger>
                    <WexTabs.Trigger value="notifications" className="rounded-none">Notifications</WexTabs.Trigger>
                  </WexTabs.List>
                  <WexTabs.Content value="profile" className="p-6 space-y-4">
                    <div className="space-y-2">
                      <WexLabel htmlFor="tab-name">Name</WexLabel>
                      <WexInput id="tab-name" defaultValue="Wex User" />
                    </div>
                    <WexButton>Save Profile</WexButton>
                  </WexTabs.Content>
                  <WexTabs.Content value="notifications" className="p-6">
                    <p className="text-sm text-muted-foreground">Notification settings.</p>
                  </WexTabs.Content>
                </WexTabs>
              </WexCard.Content>
            </WexCard>
          </ExampleCard>

          <ExampleCard title="Disabled Tab" description="Prevent interaction with specific tabs.">
            <WexTabs defaultValue="active" className="w-full max-w-md">
              <WexTabs.List>
                <WexTabs.Trigger value="active">Active</WexTabs.Trigger>
                <WexTabs.Trigger value="disabled" disabled>Disabled</WexTabs.Trigger>
                <WexTabs.Trigger value="pending">Pending</WexTabs.Trigger>
              </WexTabs.List>
              <WexTabs.Content value="active" className="p-4">
                <p className="text-sm text-muted-foreground">Content for active tab.</p>
              </WexTabs.Content>
              <WexTabs.Content value="pending" className="p-4">
                <p className="text-sm text-muted-foreground">Content for pending tab.</p>
              </WexTabs.Content>
            </WexTabs>
          </ExampleCard>

          <ExampleCard title="Controlled Tabs" description="Programmatic tab control.">
            <div className="w-full max-w-md space-y-4">
              <WexTabs value={activeTab} onValueChange={setActiveTab}>
                <WexTabs.List>
                  <WexTabs.Trigger value="home">Home</WexTabs.Trigger>
                  <WexTabs.Trigger value="dashboard">Dashboard</WexTabs.Trigger>
                </WexTabs.List>
                <WexTabs.Content value="home" className="p-4">
                  <p className="text-sm text-muted-foreground">Home content.</p>
                </WexTabs.Content>
                <WexTabs.Content value="dashboard" className="p-4">
                  <p className="text-sm text-muted-foreground">Dashboard content.</p>
                </WexTabs.Content>
              </WexTabs>
              <div className="flex gap-2">
                <WexButton intent="outline" onClick={() => setActiveTab("home")}>Go to Home</WexButton>
                <WexButton intent="outline" onClick={() => setActiveTab("dashboard")}>Go to Dashboard</WexButton>
              </div>
            </div>
          </ExampleCard>
        </div>
      </Section>

      <Section title="Accessibility">
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-medium mb-2">Keyboard Navigation</h3>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Arrow Left/Right: Navigate between tabs</li>
              <li>Enter/Space: Activate tab</li>
              <li>Home/End: Jump to first/last tab</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-medium mb-2">ARIA Roles</h3>
            <p className="text-sm text-muted-foreground">
              WexTabs uses tablist, tab, and tabpanel roles automatically.
              Each tab has aria-selected and aria-controls attributes.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Usage">
        <CodeBlock
          code={`import { WexTabs } from "@/components/wex";

// Basic tabs
<WexTabs defaultValue="tab1">
  <WexTabs.List>
    <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
    <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
  </WexTabs.List>
  <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
  <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
</WexTabs>

// Controlled tabs
const [tab, setTab] = useState("home");

<WexTabs value={tab} onValueChange={setTab}>
  <WexTabs.List>
    <WexTabs.Trigger value="home">Home</WexTabs.Trigger>
    <WexTabs.Trigger value="settings">Settings</WexTabs.Trigger>
  </WexTabs.List>
  <WexTabs.Content value="home">Home</WexTabs.Content>
  <WexTabs.Content value="settings">Settings</WexTabs.Content>
</WexTabs>`}
        />
      </Section>

      <TokenReference tokens={tabsTokens} className="mt-12" />
    </ComponentPage>
  );
}
