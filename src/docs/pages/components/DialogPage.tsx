import * as React from "react";
import { ComponentPage } from "@/docs/components/ComponentPage";
import { Section } from "@/docs/components/Section";
import { ExampleCard } from "@/docs/components/ExampleCard";
import { CodeBlock } from "@/docs/components/CodeBlock";
import { Guidance } from "@/docs/components/ProseBlock";
import { TokenReference, type TokenRow } from "@/docs/components/TokenReference";
import { WexDialog, WexButton, WexInput, WexLabel } from "@/components/wex";

// Token mappings for WexDialog
// Layer 3 component tokens
const dialogTokens: TokenRow[] = [
  { element: "Overlay", property: "Background", token: "--wex-component-dialog-overlay-bg" },
  { element: "Overlay", property: "Opacity", token: "--wex-component-dialog-overlay-opacity" },
  { element: "Content", property: "Background", token: "--wex-component-dialog-bg" },
  { element: "Content", property: "Text", token: "--wex-component-dialog-fg" },
  { element: "Content", property: "Border", token: "--wex-component-dialog-border" },
  { element: "Header/Title", property: "Text", token: "--wex-component-dialog-header-fg" },
  { element: "Description", property: "Text", token: "--wex-component-dialog-footer-fg" },
  { element: "Close Button", property: "Hover BG", token: "--wex-component-dialog-close-hover-bg" },
  { element: "Focus Ring", property: "Color", token: "--wex-component-dialog-focus-ring" },
];

export default function DialogPage() {
  const [open, setOpen] = React.useState(false);

  return (
    <ComponentPage
      title="Dialog"
      description="A modal dialog that displays content on top of the main view."
      status="stable"
      registryKey="dialog"
    >
      <Section title="Overview">
        <ExampleCard>
          <WexDialog>
            <WexDialog.Trigger asChild>
              <WexButton intent="outline">Open Dialog</WexButton>
            </WexDialog.Trigger>
            <WexDialog.Content>
              <WexDialog.Header>
                <WexDialog.Title>Dialog Title</WexDialog.Title>
                <WexDialog.Description>
                  This is a dialog description. It provides context for the dialog content.
                </WexDialog.Description>
              </WexDialog.Header>
              <p className="text-sm text-muted-foreground">
                Dialog content goes here.
              </p>
            </WexDialog.Content>
          </WexDialog>
        </ExampleCard>
        <Guidance>
          Use WexDialog for content that requires user attention but doesn't require an 
          immediate decision. For confirmations, use WexAlertDialog instead.
        </Guidance>
      </Section>

      <Section title="Variants" description="Different dialog configurations for various use cases.">
        <div className="space-y-6">
          <ExampleCard title="Simple" description="Basic informational dialog.">
            <WexDialog>
              <WexDialog.Trigger asChild>
                <WexButton intent="outline">Simple Dialog</WexButton>
              </WexDialog.Trigger>
              <WexDialog.Content>
                <WexDialog.Header>
                  <WexDialog.Title>Welcome!</WexDialog.Title>
                  <WexDialog.Description>
                    Thanks for signing up. Let's get you started.
                  </WexDialog.Description>
                </WexDialog.Header>
              </WexDialog.Content>
            </WexDialog>
          </ExampleCard>

          <ExampleCard title="With Form" description="Dialog containing a form.">
            <WexDialog>
              <WexDialog.Trigger asChild>
                <WexButton intent="outline">Edit Profile</WexButton>
              </WexDialog.Trigger>
              <WexDialog.Content className="sm:max-w-[425px]">
                <WexDialog.Header>
                  <WexDialog.Title>Edit Profile</WexDialog.Title>
                  <WexDialog.Description>
                    Make changes to your profile here. Click save when you're done.
                  </WexDialog.Description>
                </WexDialog.Header>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <WexLabel htmlFor="name" className="text-right">
                      Name
                    </WexLabel>
                    <WexInput id="name" defaultValue="John Doe" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <WexLabel htmlFor="username" className="text-right">
                      Username
                    </WexLabel>
                    <WexInput id="username" defaultValue="@johndoe" className="col-span-3" />
                  </div>
                </div>
                <WexDialog.Footer>
                  <WexButton>Save changes</WexButton>
                </WexDialog.Footer>
              </WexDialog.Content>
            </WexDialog>
          </ExampleCard>

          <ExampleCard title="With Footer Actions" description="Dialog with action buttons.">
            <WexDialog>
              <WexDialog.Trigger asChild>
                <WexButton intent="outline">Confirm Subscription</WexButton>
              </WexDialog.Trigger>
              <WexDialog.Content>
                <WexDialog.Header>
                  <WexDialog.Title>Subscribe to Newsletter</WexDialog.Title>
                  <WexDialog.Description>
                    You'll receive weekly updates about new features and tips.
                  </WexDialog.Description>
                </WexDialog.Header>
                <WexDialog.Footer className="sm:justify-start">
                  <WexDialog.Close asChild>
                    <WexButton intent="secondary">Cancel</WexButton>
                  </WexDialog.Close>
                  <WexButton>Subscribe</WexButton>
                </WexDialog.Footer>
              </WexDialog.Content>
            </WexDialog>
          </ExampleCard>

          <ExampleCard title="Scrollable Content" description="Dialog with long scrollable content.">
            <WexDialog>
              <WexDialog.Trigger asChild>
                <WexButton intent="outline">Terms of Service</WexButton>
              </WexDialog.Trigger>
              <WexDialog.Content className="max-h-[80vh] overflow-y-auto">
                <WexDialog.Header>
                  <WexDialog.Title>Terms of Service</WexDialog.Title>
                  <WexDialog.Description>
                    Please read and accept the terms of service.
                  </WexDialog.Description>
                </WexDialog.Header>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do 
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <p>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                    nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse 
                    cillum dolore eu fugiat nulla pariatur.
                  </p>
                  <p>
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui 
                    officia deserunt mollit anim id est laborum.
                  </p>
                </div>
                <WexDialog.Footer>
                  <WexDialog.Close asChild>
                    <WexButton intent="outline">Decline</WexButton>
                  </WexDialog.Close>
                  <WexButton>Accept</WexButton>
                </WexDialog.Footer>
              </WexDialog.Content>
            </WexDialog>
          </ExampleCard>

          <ExampleCard title="Controlled" description="Programmatically control open state.">
            <div className="flex gap-2">
              <WexButton intent="outline" onClick={() => setOpen(true)}>
                Open via State
              </WexButton>
              <WexDialog open={open} onOpenChange={setOpen}>
                <WexDialog.Content>
                  <WexDialog.Header>
                    <WexDialog.Title>Controlled Dialog</WexDialog.Title>
                    <WexDialog.Description>
                      This dialog is controlled via React state.
                    </WexDialog.Description>
                  </WexDialog.Header>
                  <WexDialog.Footer>
                    <WexButton onClick={() => setOpen(false)}>Close</WexButton>
                  </WexDialog.Footer>
                </WexDialog.Content>
              </WexDialog>
            </div>
          </ExampleCard>
        </div>
      </Section>

      <Section title="Sizes" description="WexDialog does not support size variants.">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Size variants are not supported. Use className to customize width:
            <code className="bg-muted px-1 rounded ml-1">className="sm:max-w-[425px]"</code>
          </p>
        </div>
      </Section>

      <Section title="States" description="Dialog interaction states.">
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-medium mb-2">Open State</h3>
            <p className="text-sm text-muted-foreground">
              Dialog can be opened via trigger click or controlled via the <code className="bg-muted px-1 rounded">open</code> prop.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-medium mb-2">Focus State</h3>
            <p className="text-sm text-muted-foreground">
              When open, focus is trapped within the dialog. The close button and 
              interactive elements show focus rings on keyboard navigation.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Accessibility">
        <div className="space-y-4 text-foreground">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-medium mb-2">Focus Management</h3>
            <p className="text-sm text-muted-foreground">
              Focus is trapped within the dialog when open. Pressing Escape closes
              the dialog and returns focus to the trigger.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-medium mb-2">Keyboard Navigation</h3>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Tab: Move focus to next focusable element</li>
              <li>Shift + Tab: Move focus to previous element</li>
              <li>Escape: Close the dialog</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-medium mb-2">Screen Readers</h3>
            <p className="text-sm text-muted-foreground">
              The dialog title and description are announced when opened. 
              Use WexDialog.Title and WexDialog.Description for proper announcements.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Usage">
        <CodeBlock
          code={`import { WexDialog, WexButton, WexInput, WexLabel } from "@/components/wex";

// Basic dialog
<WexDialog>
  <WexDialog.Trigger asChild>
    <WexButton>Open</WexButton>
  </WexDialog.Trigger>
  <WexDialog.Content>
    <WexDialog.Header>
      <WexDialog.Title>Title</WexDialog.Title>
      <WexDialog.Description>Description</WexDialog.Description>
    </WexDialog.Header>
    Content here
    <WexDialog.Footer>
      <WexDialog.Close asChild>
        <WexButton intent="outline">Cancel</WexButton>
      </WexDialog.Close>
      <WexButton>Confirm</WexButton>
    </WexDialog.Footer>
  </WexDialog.Content>
</WexDialog>

// Controlled dialog
const [open, setOpen] = useState(false);

<WexDialog open={open} onOpenChange={setOpen}>
  <WexDialog.Trigger asChild>
    <WexButton>Open</WexButton>
  </WexDialog.Trigger>
  <WexDialog.Content>
    <WexDialog.Header>
      <WexDialog.Title>Controlled</WexDialog.Title>
    </WexDialog.Header>
    <WexButton onClick={() => setOpen(false)}>
      Close
    </WexButton>
  </WexDialog.Content>
</WexDialog>`}
        />
      </Section>

      <TokenReference tokens={dialogTokens} className="mt-12" />
    </ComponentPage>
  );
}
