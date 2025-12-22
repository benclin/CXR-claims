import { ComponentPage } from "@/docs/components/ComponentPage";
import { Section } from "@/docs/components/Section";
import { ExampleCard } from "@/docs/components/ExampleCard";
import { CodeBlock } from "@/docs/components/CodeBlock";
import { Guidance } from "@/docs/components/ProseBlock";
import { TokenReference, type TokenRow } from "@/docs/components/TokenReference";
import {
  WexCard,
  WexButton,
  WexInput,
  WexLabel,
  WexSwitch,
  WexAvatar,
} from "@/components/wex";
import { Bell, CreditCard, Settings, User } from "lucide-react";

// Token mappings for WexCard
// Layer 3 component tokens
const cardTokens: TokenRow[] = [
  { element: "Container", property: "Background", token: "--wex-component-card-bg" },
  { element: "Container", property: "Text", token: "--wex-component-card-fg" },
  { element: "Container", property: "Border", token: "--wex-component-card-border" },
  { element: "Header/Title", property: "Text", token: "--wex-component-card-header-fg" },
  { element: "Footer", property: "Text", token: "--wex-component-card-footer-fg" },
];

export default function CardPage() {
  return (
    <ComponentPage
      title="Card"
      description="Displays content in a contained, styled container with optional header and footer."
      status="stable"
      registryKey="card"
    >
      <Section title="Overview">
        <ExampleCard>
          <WexCard className="w-full max-w-sm">
            <WexCard.Header>
              <WexCard.Title>Card Title</WexCard.Title>
              <WexCard.Description>Card Description</WexCard.Description>
            </WexCard.Header>
            <WexCard.Content>
              <p>Card content goes here. Use cards to group related information.</p>
            </WexCard.Content>
            <WexCard.Footer>
              <WexButton>Action</WexButton>
            </WexCard.Footer>
          </WexCard>
        </ExampleCard>
        <Guidance>
          Cards are versatile containers for grouping related content. They work 
          well for list items, settings panels, and feature highlights.
        </Guidance>
      </Section>

      <Section title="Variants" description="Different card configurations.">
        <div className="grid gap-6 md:grid-cols-2">
          <ExampleCard title="Simple" description="Just content, no header or footer.">
            <WexCard>
              <WexCard.Content className="pt-6">
                <p className="text-sm text-muted-foreground">
                  This is a simple card with just content. No header or footer.
                </p>
              </WexCard.Content>
            </WexCard>
          </ExampleCard>

          <ExampleCard title="With Header Only" description="Header and content.">
            <WexCard>
              <WexCard.Header>
                <WexCard.Title>Notifications</WexCard.Title>
                <WexCard.Description>You have 3 unread messages.</WexCard.Description>
              </WexCard.Header>
              <WexCard.Content>
                <p className="text-sm">Check your inbox for updates.</p>
              </WexCard.Content>
            </WexCard>
          </ExampleCard>

          <ExampleCard title="With Footer Actions" description="Multiple action buttons.">
            <WexCard className="w-full max-w-sm">
              <WexCard.Header>
                <WexCard.Title>Upgrade Plan</WexCard.Title>
                <WexCard.Description>
                  You're currently on the free plan.
                </WexCard.Description>
              </WexCard.Header>
              <WexCard.Content>
                <p className="text-sm">
                  Upgrade to Pro for unlimited features and priority support.
                </p>
              </WexCard.Content>
              <WexCard.Footer className="flex justify-between">
                <WexButton intent="outline">Cancel</WexButton>
                <WexButton>Upgrade</WexButton>
              </WexCard.Footer>
            </WexCard>
          </ExampleCard>

          <ExampleCard title="Form Card" description="Card containing a form.">
            <WexCard className="w-full max-w-sm">
              <WexCard.Header>
                <WexCard.Title>Create Account</WexCard.Title>
                <WexCard.Description>
                  Enter your details to create an account.
                </WexCard.Description>
              </WexCard.Header>
              <WexCard.Content className="space-y-4">
                <div className="space-y-2">
                  <WexLabel htmlFor="email">Email</WexLabel>
                  <WexInput id="email" type="email" placeholder="m@example.com" />
                </div>
                <div className="space-y-2">
                  <WexLabel htmlFor="password">Password</WexLabel>
                  <WexInput id="password" type="password" />
                </div>
              </WexCard.Content>
              <WexCard.Footer>
                <WexButton className="w-full">Create Account</WexButton>
              </WexCard.Footer>
            </WexCard>
          </ExampleCard>

          <ExampleCard title="Settings Card" description="Toggle settings.">
            <WexCard className="w-full max-w-sm">
              <WexCard.Header>
                <WexCard.Title>Notifications</WexCard.Title>
                <WexCard.Description>
                  Manage your notification preferences.
                </WexCard.Description>
              </WexCard.Header>
              <WexCard.Content className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <WexLabel id="email-notif-label">Email notifications</WexLabel>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about activity.
                    </p>
                  </div>
                  <WexSwitch defaultChecked aria-labelledby="email-notif-label" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <WexLabel id="push-notif-label">Push notifications</WexLabel>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications.
                    </p>
                  </div>
                  <WexSwitch aria-labelledby="push-notif-label" />
                </div>
              </WexCard.Content>
            </WexCard>
          </ExampleCard>

          <ExampleCard title="User Profile Card" description="Displaying user information.">
            <WexCard className="w-full max-w-sm">
              <WexCard.Header>
                <div className="flex items-center gap-4">
                  <WexAvatar>
                    <WexAvatar.Fallback>JD</WexAvatar.Fallback>
                  </WexAvatar>
                  <div>
                    <WexCard.Title>John Doe</WexCard.Title>
                    <WexCard.Description>@johndoe</WexCard.Description>
                  </div>
                </div>
              </WexCard.Header>
              <WexCard.Content>
                <p className="text-sm text-muted-foreground">
                  Software engineer at WEX. Building great products.
                </p>
              </WexCard.Content>
              <WexCard.Footer className="flex gap-2">
                <WexButton intent="outline" size="sm">Message</WexButton>
                <WexButton size="sm">Follow</WexButton>
              </WexCard.Footer>
            </WexCard>
          </ExampleCard>

          <ExampleCard title="Feature Card" description="Highlighting a feature.">
            <WexCard className="w-full max-w-sm">
              <WexCard.Header>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <WexCard.Title>Real-time Updates</WexCard.Title>
                  </div>
                </div>
              </WexCard.Header>
              <WexCard.Content>
                <p className="text-sm text-muted-foreground">
                  Get instant notifications when something important happens 
                  in your account.
                </p>
              </WexCard.Content>
            </WexCard>
          </ExampleCard>

          <ExampleCard title="Stats Card" description="Displaying metrics.">
            <WexCard className="w-full max-w-sm">
              <WexCard.Header className="pb-2">
                <WexCard.Description>Total Revenue</WexCard.Description>
                <WexCard.Title className="text-3xl">$45,231.89</WexCard.Title>
              </WexCard.Header>
              <WexCard.Content>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+20.1%</span> from last month
                </p>
              </WexCard.Content>
            </WexCard>
          </ExampleCard>
        </div>
      </Section>

      <Section title="Card Grid" description="Multiple cards in a grid layout.">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: User, title: "Account", description: "Manage your account settings" },
            { icon: CreditCard, title: "Billing", description: "View billing information" },
            { icon: Settings, title: "Settings", description: "Configure preferences" },
          ].map((item) => (
            <WexCard key={item.title} className="cursor-pointer hover:bg-accent/50 transition-colors">
              <WexCard.Header>
                <item.icon className="h-8 w-8 text-primary mb-2" />
                <WexCard.Title className="text-lg">{item.title}</WexCard.Title>
                <WexCard.Description>{item.description}</WexCard.Description>
              </WexCard.Header>
            </WexCard>
          ))}
        </div>
      </Section>

      <Section title="Sizes" description="WexCard does not support size variants.">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Size variants are not supported. Use className to customize dimensions.
          </p>
        </div>
      </Section>

      <Section title="Accessibility">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-medium mb-2">Semantic Structure</h3>
          <p className="text-sm text-muted-foreground">
            Cards use div elements by default. For interactive cards, wrap the 
            Card in a button or anchor tag, or make the card itself focusable.
          </p>
        </div>
      </Section>

      <Section title="Usage">
        <CodeBlock
          code={`import { WexCard, WexButton } from "@/components/wex";

// Full card
<WexCard>
  <WexCard.Header>
    <WexCard.Title>Title</WexCard.Title>
    <WexCard.Description>Description</WexCard.Description>
  </WexCard.Header>
  <WexCard.Content>
    Content goes here
  </WexCard.Content>
  <WexCard.Footer>
    <WexButton>Action</WexButton>
  </WexCard.Footer>
</WexCard>

// Simple content card
<WexCard>
  <WexCard.Content className="pt-6">
    Just content, no header or footer.
  </WexCard.Content>
</WexCard>

// Interactive card
<WexCard className="cursor-pointer hover:bg-accent/50 transition-colors">
  <WexCard.Header>
    <WexCard.Title>Click me</WexCard.Title>
  </WexCard.Header>
</WexCard>`}
        />
      </Section>

      <TokenReference tokens={cardTokens} className="mt-12" />
    </ComponentPage>
  );
}
