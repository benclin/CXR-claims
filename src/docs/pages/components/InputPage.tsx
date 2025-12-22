import { ComponentPage } from "@/docs/components/ComponentPage";
import { Section } from "@/docs/components/Section";
import { ExampleCard } from "@/docs/components/ExampleCard";
import { CodeBlock } from "@/docs/components/CodeBlock";
import { TokenReference, type TokenRow } from "@/docs/components/TokenReference";
import { WexInput, WexLabel } from "@/components/wex";

// Token mappings for WexInput - Layer 3 component tokens
const inputTokens: TokenRow[] = [
  { element: "Input", property: "Background", token: "--wex-component-input-bg" },
  { element: "Input", property: "Text", token: "--wex-component-input-fg" },
  { element: "Input", property: "Placeholder", token: "--wex-component-input-placeholder" },
  { element: "Input", property: "Border", token: "--wex-component-input-border" },
  { element: "Input", property: "Border (Hover)", token: "--wex-component-input-border-hover" },
  { element: "Input", property: "Border (Focus)", token: "--wex-component-input-border-focus" },
  { element: "Focus Ring", property: "Color", token: "--wex-component-input-focus-ring" },
  { element: "Disabled", property: "Background", token: "--wex-component-input-disabled-bg" },
  { element: "Disabled", property: "Text", token: "--wex-component-input-disabled-fg" },
  { element: "Disabled", property: "Border", token: "--wex-component-input-disabled-border" },
  { element: "Disabled", property: "Opacity", token: "--wex-component-input-disabled-opacity" },
];

export default function InputPage() {
  return (
    <ComponentPage
      title="Input"
      description="Text input field for forms with accessible sizing and focus states."
      status="stable"
      registryKey="input"
    >
      <Section title="Overview">
        <ExampleCard>
          <div className="w-full max-w-sm space-y-2">
            <WexLabel htmlFor="demo-input">Email address</WexLabel>
            <WexInput id="demo-input" type="email" placeholder="you@example.com" />
          </div>
        </ExampleCard>
      </Section>

      <Section title="Types" description="Input supports various HTML5 input types.">
        <div className="space-y-4">
          <ExampleCard title="Text" description="Default text input.">
            <div className="w-full max-w-sm space-y-2">
              <WexLabel htmlFor="text-type">Full Name</WexLabel>
              <WexInput id="text-type" type="text" placeholder="John Doe" />
            </div>
          </ExampleCard>

          <ExampleCard title="Email" description="Input optimized for email addresses.">
            <div className="w-full max-w-sm space-y-2">
              <WexLabel htmlFor="email-type">Email</WexLabel>
              <WexInput id="email-type" type="email" placeholder="name@company.com" />
            </div>
          </ExampleCard>

          <ExampleCard title="Password" description="Masked input for sensitive data.">
            <div className="w-full max-w-sm space-y-2">
              <WexLabel htmlFor="password-type">Password</WexLabel>
              <WexInput id="password-type" type="password" placeholder="Enter password" />
            </div>
          </ExampleCard>

          <ExampleCard title="Number" description="Numeric input with spinner controls.">
            <div className="w-full max-w-sm space-y-2">
              <WexLabel htmlFor="number-type">Quantity</WexLabel>
              <WexInput id="number-type" type="number" placeholder="0" min={0} max={100} />
            </div>
          </ExampleCard>

          <ExampleCard title="Search" description="Search input with clear button support.">
            <div className="w-full max-w-sm space-y-2">
              <WexLabel htmlFor="search-type">Search</WexLabel>
              <WexInput id="search-type" type="search" placeholder="Search..." />
            </div>
          </ExampleCard>

          <ExampleCard title="URL" description="Input for web addresses.">
            <div className="w-full max-w-sm space-y-2">
              <WexLabel htmlFor="url-type">Website</WexLabel>
              <WexInput id="url-type" type="url" placeholder="https://example.com" />
            </div>
          </ExampleCard>

          <ExampleCard title="Tel" description="Input for phone numbers.">
            <div className="w-full max-w-sm space-y-2">
              <WexLabel htmlFor="tel-type">Phone Number</WexLabel>
              <WexInput id="tel-type" type="tel" placeholder="+1 (555) 123-4567" />
            </div>
          </ExampleCard>

          <ExampleCard title="Date" description="Date picker input.">
            <div className="w-full max-w-sm space-y-2">
              <WexLabel htmlFor="date-type">Date</WexLabel>
              <WexInput id="date-type" type="date" />
            </div>
          </ExampleCard>
        </div>
      </Section>

      <Section title="States" description="Interactive and visual states.">
        <div className="space-y-4">
          <ExampleCard title="Default" description="Normal input state.">
            <WexInput placeholder="Default input" aria-label="Default input example" className="max-w-sm" />
          </ExampleCard>

          <ExampleCard title="With Value" description="Input with existing value.">
            <WexInput defaultValue="existing@email.com" aria-label="Email with value example" className="max-w-sm" />
          </ExampleCard>

          <ExampleCard title="Focused" description="Try clicking or tabbing to this input.">
            <WexInput placeholder="Click or tab to focus" aria-label="Focus demonstration input" className="max-w-sm" />
          </ExampleCard>

          <ExampleCard title="Disabled" description="Non-interactive disabled state.">
            <WexInput disabled placeholder="Cannot edit this field" aria-label="Disabled input example" className="max-w-sm" />
          </ExampleCard>

          <ExampleCard title="Read Only" description="Visible but not editable.">
            <WexInput readOnly defaultValue="Read-only value" aria-label="Read-only input example" className="max-w-sm" />
          </ExampleCard>
        </div>
      </Section>

      <Section title="With Labels" description="Proper label association for accessibility.">
        <div className="space-y-4">
          <ExampleCard title="Standard Label">
            <div className="w-full max-w-sm space-y-2">
              <WexLabel htmlFor="labeled-input">Username</WexLabel>
              <WexInput id="labeled-input" placeholder="Choose a username" />
            </div>
          </ExampleCard>

          <ExampleCard title="Required Field">
            <div className="w-full max-w-sm space-y-2">
              <WexLabel htmlFor="required-input">
                Email <span className="text-destructive">*</span>
              </WexLabel>
              <WexInput id="required-input" type="email" placeholder="Required field" required />
            </div>
          </ExampleCard>

          <ExampleCard title="With Helper Text">
            <div className="w-full max-w-sm space-y-2">
              <WexLabel htmlFor="helper-input">API Key</WexLabel>
              <WexInput id="helper-input" placeholder="sk_live_..." />
              <p className="text-sm text-muted-foreground">
                You can find your API key in the dashboard settings.
              </p>
            </div>
          </ExampleCard>
        </div>
      </Section>

      <Section title="Sizing">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-medium mb-2">Accessible Height</h3>
          <p className="text-sm text-muted-foreground">
            All inputs are 44px (h-11) to meet WCAG 2.5.5 touch target requirements.
            This ensures usability on touch devices and for users with motor impairments.
          </p>
        </div>
      </Section>

      <Section title="Accessibility">
        <div className="space-y-4 text-foreground">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-medium mb-2">Label Association</h3>
            <p className="text-sm text-muted-foreground">
              Always use Label with matching{" "}
              <code className="bg-muted px-1 rounded">htmlFor</code> and{" "}
              <code className="bg-muted px-1 rounded">id</code> attributes.
              This enables screen readers to announce the label when the input is focused.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-medium mb-2">Focus Ring</h3>
            <p className="text-sm text-muted-foreground">
              Inputs display a visible focus ring when navigated via keyboard,
              meeting WCAG 2.4.7 requirements.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-medium mb-2">Placeholder Text</h3>
            <p className="text-sm text-muted-foreground">
              Placeholder text should provide examples, not instructions.
              Important information should be in the label or helper text,
              as placeholder text disappears when typing.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Usage">
        <CodeBlock
          code={`import { WexInput, WexLabel } from "@/components/wex";

// Basic input
<WexInput placeholder="Enter text..." />

// With label (recommended)
<div className="space-y-2">
  <WexLabel htmlFor="email">Email</WexLabel>
  <WexInput id="email" type="email" placeholder="you@example.com" />
</div>

// Controlled input
const [value, setValue] = useState("");
<WexInput 
  value={value} 
  onChange={(e) => setValue(e.target.value)} 
/>

// With helper text
<div className="space-y-2">
  <WexLabel htmlFor="password">Password</WexLabel>
  <WexInput id="password" type="password" />
  <p className="text-sm text-muted-foreground">
    Must be at least 8 characters.
  </p>
</div>`}
        />
      </Section>

      <TokenReference tokens={inputTokens} className="mt-12" />
    </ComponentPage>
  );
}
