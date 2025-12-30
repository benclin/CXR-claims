import * as React from "react";
import { Section } from "@/docs/components/Section";
import { CodeBlock } from "@/docs/components/CodeBlock";
import { WexCard, WexAlert, WexButton, WexTabs } from "@/components/wex";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Shield, 
  RefreshCw, 
  Zap, 
  Package, 
  CheckCircle,
  ArrowRight,
  Code2,
  FileCode,
  Moon,
  RotateCcw
} from "lucide-react";

/**
 * Architecture Page - Explains WEX component strategy and enterprise value
 */
export default function ArchitecturePage() {
  return (
    <article>
      <header className="mb-8 pb-6 border-b border-border">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Architecture
        </h1>
        <p className="text-lg text-muted-foreground">
          Understanding the WEX Design System component strategy and how it benefits enterprise teams.
        </p>
      </header>

      <Section title="Overview" className="mb-16">
        <p className="text-foreground mb-6">
          The WEX Design System provides two complementary packages that work together to deliver 
          a consistent, brand-compliant UI experience across all WEX applications:
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <WexCard className="p-5">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <WexCard.Title className="text-base mb-2">@wex/components</WexCard.Title>
                <WexCard.Description className="leading-relaxed">
                  Full component library with WEX-branded variants, namespace patterns, 
                  and curated updates from upstream dependencies.
                </WexCard.Description>
              </div>
            </div>
          </WexCard>
          <WexCard className="p-5">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-info/10">
                <Zap className="h-5 w-5 text-info" />
              </div>
              <div>
                <WexCard.Title className="text-base mb-2">@wex/design-tokens</WexCard.Title>
                <WexCard.Description className="leading-relaxed">
                  Theme-only package with CSS variables, Tailwind preset, and shadcn bridge 
                  for teams needing more control.
                </WexCard.Description>
              </div>
            </div>
          </WexCard>
        </div>
        <WexAlert intent="info">
          <WexAlert.Title>Recommended for most teams</WexAlert.Title>
          <WexAlert.Description>
            Use <code className="bg-muted px-1.5 py-0.5 rounded text-sm">@wex/components</code> for 
            the simplest integration path. The theme-only package is available for power users 
            with specific requirements.
          </WexAlert.Description>
        </WexAlert>
      </Section>

      <Section title="Why WEX Components?" description="Enterprise benefits of using the WEX component library." className="mb-16">
        <div className="grid md:grid-cols-2 gap-6 mt-2">
          <BenefitCard
            icon={<Building2 className="h-5 w-5" />}
            iconColor="text-primary"
            title="Consistency at Scale"
            description="All teams use the same component versions with identical APIs and behaviors. 
              No more Team A using v1.2 while Team B uses v1.4 with different bugs."
          />
          <BenefitCard
            icon={<Shield className="h-5 w-5" />}
            iconColor="text-success"
            title="Brand Compliance Built-In"
            description="Developers can't accidentally go off-brand. The intent variants (primary, 
              success, warning) ensure the right colors are used every time."
          />
          <BenefitCard
            icon={<RefreshCw className="h-5 w-5" />}
            iconColor="text-info"
            title="Controlled Updates"
            description="The WEX team evaluates upstream changes, runs full test suites, and 
              publishes migration guides. App teams update with confidence."
          />
          <BenefitCard
            icon={<Zap className="h-5 w-5" />}
            iconColor="text-warning"
            title="Reduced Onboarding"
            description="New developers ship WEX-compliant features on day one. No complex 
              setup, no configuration, no learning curve."
          />
        </div>
      </Section>

      <Section 
        title="Developer Experience Comparison" 
        description="See the difference: same button, same result, different effort."
        className="mb-16"
      >
        {/* Live Button Comparison */}
        <div className="mt-2 mb-8">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Live Result (identical appearance):</h4>
          <div className="flex gap-8 items-center p-6 rounded-lg bg-muted/30 border border-border">
            <div className="text-center">
              <WexButton intent="destructive">Delete Account</WexButton>
              <p className="text-xs text-muted-foreground mt-2">WexButton</p>
            </div>
            <div className="text-center">
              <Button
                className="
                  inline-flex items-center justify-center gap-2
                  h-11 min-h-[44px] px-4 py-2 rounded-md
                  text-sm font-medium transition-colors
                  bg-wex-button-destructive-bg
                  text-wex-button-destructive-fg
                  border border-wex-button-destructive-border
                  hover:bg-wex-button-destructive-hover-bg
                  active:bg-wex-button-destructive-active-bg
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                  focus-visible:ring-wex-button-destructive-focus-ring
                  disabled:pointer-events-none disabled:opacity-50
                  disabled:bg-wex-button-destructive-disabled-bg
                  disabled:text-wex-button-destructive-disabled-fg
                "
              >
                Delete Account
              </Button>
              <p className="text-xs text-muted-foreground mt-2">shadcn + tokens</p>
            </div>
          </div>
        </div>

        {/* Code Comparison Tabs */}
        <WexTabs defaultValue="wex" className="mb-8">
          <WexTabs.List className="mb-4">
            <WexTabs.Trigger value="wex" className="gap-2">
              <Code2 className="h-4 w-4" />
              With @wex/components
            </WexTabs.Trigger>
            <WexTabs.Trigger value="shadcn" className="gap-2">
              <Code2 className="h-4 w-4" />
              With shadcn + tokens
            </WexTabs.Trigger>
          </WexTabs.List>
          
          <WexTabs.Content value="wex">
            <CodeBlock 
              language="tsx"
              filename="MyComponent.tsx"
              code={`import { WexButton } from '@wex/components';

<WexButton intent="destructive">Delete Account</WexButton>`}
            />
            <p className="text-sm text-muted-foreground mt-3">
              <span className="font-semibold text-success">3 lines</span> — Import and use. That's it.
            </p>
          </WexTabs.Content>
          
          <WexTabs.Content value="shadcn">
            <CodeBlock 
              language="tsx"
              filename="MyComponent.tsx"
              code={`import { Button } from '@/components/ui/button';
import './button-variants.css';

<Button className="btn-destructive">Delete Account</Button>`}
            />
            
            <p className="text-xs font-medium text-muted-foreground mt-6 mb-3 uppercase tracking-wide">
              Plus the CSS you write and maintain (using Tailwind @apply with WEX utilities):
            </p>
            
            <CodeBlock 
              language="css"
              filename="button-variants.css"
              code={`.btn-destructive {
  @apply inline-flex items-center justify-center gap-2;
  @apply h-11 min-h-[44px] px-4 py-2 rounded-md;
  @apply text-sm font-medium transition-colors;
  @apply bg-wex-button-destructive-bg;
  @apply text-wex-button-destructive-fg;
  @apply border border-wex-button-destructive-border;
}

.btn-destructive:hover {
  @apply bg-wex-button-destructive-hover-bg;
}

.btn-destructive:active {
  @apply bg-wex-button-destructive-active-bg;
}

.btn-destructive:focus-visible {
  @apply outline-none ring-2 ring-offset-2;
  @apply ring-wex-button-destructive-focus-ring;
}

.btn-destructive:disabled {
  @apply pointer-events-none opacity-50;
  @apply bg-wex-button-destructive-disabled-bg;
  @apply text-wex-button-destructive-disabled-fg;
}`}
            />
            <p className="text-sm text-muted-foreground mt-3">
              <span className="font-semibold text-destructive">~20 lines of CSS</span> — for just one button variant.
            </p>
          </WexTabs.Content>
        </WexTabs>

        {/* Metrics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={<Code2 className="h-5 w-5" />}
            label="Component Code"
            wexValue="3 lines"
            manualValue="4 lines"
          />
          <MetricCard
            icon={<FileCode className="h-5 w-5" />}
            label="CSS to Write"
            wexValue="0 lines"
            manualValue="~20 lines"
          />
          <MetricCard
            icon={<Moon className="h-5 w-5" />}
            label="Dark Mode"
            wexValue="Automatic"
            manualValue="Manual"
          />
          <MetricCard
            icon={<RotateCcw className="h-5 w-5" />}
            label="Token Updates"
            wexValue="Automatic"
            manualValue="Manual sync"
          />
        </div>

        {/* Value Callout */}
        <WexAlert intent="success">
          <WexAlert.Title>Same usage, zero maintenance</WexAlert.Title>
          <WexAlert.Description>
            Both approaches look similar at the component level — but WEX components eliminate 
            the ~20 lines of CSS per variant you'd otherwise write and maintain. Dark mode, 
            accessibility, and future token updates are handled for you.
          </WexAlert.Description>
        </WexAlert>
      </Section>

      <Section title="Dependency Model" description="How WEX components relate to underlying libraries." className="mb-16">
        <div className="bg-muted/30 border border-border rounded-lg p-8 mb-6 mt-2">
          <div className="flex flex-col items-center gap-5">
            {/* Your Application */}
            <DependencyNode 
              label="Your Application" 
              sublabel="React + Tailwind" 
              highlight 
            />
            
            <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
            
            {/* WEX Layer */}
            <div className="flex gap-6 items-center">
              <DependencyNode 
                label="@wex/components" 
                sublabel="Component Library" 
                primary
              />
              <span className="text-muted-foreground text-sm font-medium">or</span>
              <DependencyNode 
                label="@wex/design-tokens" 
                sublabel="Theme Only" 
              />
            </div>
            
            <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
            
            {/* shadcn Layer */}
            <DependencyNode 
              label="shadcn/ui" 
              sublabel="Component Primitives" 
            />
            
            <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
            
            {/* Radix Layer */}
            <DependencyNode 
              label="@radix-ui" 
              sublabel="Headless Primitives" 
            />
          </div>
        </div>
        
        <p className="text-muted-foreground">
          WEX components wrap shadcn/ui, which wraps Radix UI primitives. This layered approach 
          means you get accessibility, keyboard navigation, and proper ARIA attributes out of the box, 
          with WEX branding applied on top.
        </p>
      </Section>

      <Section title="Update Path" description="How upstream improvements reach your application." className="mb-16">
        <div className="space-y-5 mt-2">
          <UpdateStep 
            number={1}
            title="Upstream Release"
            description="shadcn/ui or Radix releases a new version with improvements or fixes."
          />
          <UpdateStep 
            number={2}
            title="WEX Evaluation"
            description="The WEX team evaluates compatibility, runs accessibility tests, and checks for breaking changes."
          />
          <UpdateStep 
            number={3}
            title="Internal Update"
            description="WEX updates the internal dependency and runs the full test suite across all components."
          />
          <UpdateStep 
            number={4}
            title="Release & Migration Guide"
            description="New @wex/components version is published with changelog and any migration notes."
          />
          <UpdateStep 
            number={5}
            title="Team Adoption"
            description="App teams update at their own pace with confidence that changes have been vetted."
          />
        </div>
        
        <WexAlert className="mt-8" intent="success">
          <WexAlert.Title>You're not locked in</WexAlert.Title>
          <WexAlert.Description>
            WEX components wrap upstream libraries—they don't fork them. You still get all 
            improvements from shadcn and Radix, just with an extra layer of quality assurance.
          </WexAlert.Description>
        </WexAlert>
      </Section>

      <Section title="Package Comparison" description="Choose the right package for your team's needs.">
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">Feature</th>
                <th className="text-left py-3 px-4 font-medium">@wex/components</th>
                <th className="text-left py-3 px-4 font-medium">@wex/design-tokens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <ComparisonRow 
                feature="Ready-to-use components" 
                components={true} 
                tokens={false} 
              />
              <ComparisonRow 
                feature="WEX intent variants (success, warning, etc.)" 
                components={true} 
                tokens={false} 
              />
              <ComparisonRow 
                feature="Namespace pattern (WexDialog.Content)" 
                components={true} 
                tokens={false} 
              />
              <ComparisonRow 
                feature="CSS design tokens" 
                components={true} 
                tokens={true} 
              />
              <ComparisonRow 
                feature="Tailwind preset" 
                components={true} 
                tokens={true} 
              />
              <ComparisonRow 
                feature="Use with raw shadcn CLI" 
                components={false} 
                tokens={true} 
              />
              <ComparisonRow 
                feature="Full control over components" 
                components={false} 
                tokens={true} 
              />
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 p-5 rounded-lg bg-muted/30 border border-border">
          <h4 className="font-medium mb-3">When to use @wex/design-tokens alone:</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
            <li>You need to customize component behavior beyond what WEX provides</li>
            <li>You're integrating with an existing shadcn setup</li>
            <li>You require specific shadcn versions for compatibility reasons</li>
            <li>You're building a new component library on top of WEX tokens</li>
          </ul>
        </div>
      </Section>

      <Section 
        title="Component Implementation Patterns" 
        description="How WEX components are built under the hood."
        className="mb-16 mt-16"
      >
        <p className="text-muted-foreground mb-6 mt-2">
          WEX components follow two implementation patterns depending on whether shadcn's 
          built-in variants meet WEX requirements:
        </p>
        
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">Pattern</th>
                <th className="text-left py-3 px-4 font-medium">Count</th>
                <th className="text-left py-3 px-4 font-medium">Components</th>
                <th className="text-left py-3 px-4 font-medium">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-info" />
                    Extended CVA
                  </span>
                </td>
                <td className="py-4 px-4 font-medium">3</td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">Button</code>,{" "}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">Badge</code>,{" "}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">Alert</code>
                </td>
                <td className="py-4 px-4 text-muted-foreground">
                  Need WEX intents (success, info, warning, help, contrast) beyond shadcn defaults
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    shadcn Wrapper
                  </span>
                </td>
                <td className="py-4 px-4 font-medium">55</td>
                <td className="py-4 px-4 whitespace-nowrap text-muted-foreground">
                  All other components
                </td>
                <td className="py-4 px-4 text-muted-foreground">
                  shadcn variants are sufficient; just add namespace pattern
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <WexAlert intent="info">
          <WexAlert.Title>CVA = Class Variance Authority</WexAlert.Title>
          <WexAlert.Description>
            CVA is a library for defining component variants declaratively with Tailwind. 
            When shadcn's built-in variants don't cover WEX's semantic intents, we extend 
            with custom CVA configurations rather than forking the entire component.
          </WexAlert.Description>
        </WexAlert>
      </Section>

      <Section 
        title="Industry Validation" 
        description="This pattern is used by leading design systems."
        className="mb-16"
      >
        <p className="text-muted-foreground mb-6 mt-2">
          The layered approach—headless primitives → styled components → brand layer—is 
          the industry standard for enterprise design systems:
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <ValidationCard
            company="Vercel"
            logo={
              <svg viewBox="0 0 76 65" fill="currentColor" className="h-5 w-5">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
            }
            description="Builds on Radix + Tailwind for their internal design system and Geist UI."
          />
          <ValidationCard
            company="Shopify"
            logo={
              <svg viewBox="0 0 109 124" fill="currentColor" className="h-5 w-5">
                <path d="M95.8 28.3c-.1-.6-.6-1-1.1-1-.5 0-9.3-.2-9.3-.2s-7.4-7.2-8.1-7.9c-.8-.8-2.3-.5-2.9-.4-.1 0-1.6.5-4.1 1.3-2.4-7-6.7-13.4-14.2-13.4h-.7c-2.1-2.8-4.8-4-7-4C35.2 2.7 28.6 19.2 26.4 28c-5.8 1.8-9.9 3.1-10.4 3.2-3.2 1-3.3 1.1-3.7 4.1-.3 2.3-8.7 67.1-8.7 67.1l69.5 12.9 37.6-8.2S96 28.9 95.8 28.3zm-32.6-6c-2 .6-4.2 1.3-6.6 2V23c0-2.8-.4-5.1-1-6.9 2.5.4 4.2 3.2 7.6 5.2zm-12.5-4c.7 2.1 1.1 4.9 1.1 8.8v.8c-4.3 1.3-8.9 2.7-13.5 4.2 2.6-10.1 7.5-15 12.4-13.8zm-5.7-7.9c.8 0 1.6.3 2.4.8-5.9 2.8-12.3 9.8-15 23.8-3.7 1.1-7.2 2.2-10.5 3.2 2.9-10 10-27.8 23.1-27.8z"/>
              </svg>
            }
            description="Uses headless primitives with a brand layer on top for consistent merchant experiences."
          />
          <ValidationCard
            company="Stripe"
            logo={
              <svg viewBox="0 0 60 25" fill="currentColor" className="h-4 w-auto">
                <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a10.3 10.3 0 0 1-4.56.98c-4.01 0-6.83-2.5-6.83-7.28 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.28 0 .55-.03 1.09-.06 1.62zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM41.49 20.3c-1.53 0-2.54-.64-3.2-1.13l-.03 5.12-4.35.93V5.75h3.82l.16 1.02c.68-.58 1.82-1.22 3.47-1.22 3.09 0 5.88 2.74 5.88 7.15 0 4.93-2.73 7.6-5.75 7.6zm-.8-11.35c-.94 0-1.6.34-2.03.72l.06 6.22c.4.35 1.03.7 1.97.7 1.52 0 2.52-1.56 2.52-3.87 0-2.22-1.01-3.77-2.52-3.77zM28.24 2.23l4.38-.92v4.26h3.38v3.52h-3.38v5.47c0 1.34.6 1.67 1.55 1.67.5 0 1.08-.09 1.6-.22v3.46a8.2 8.2 0 0 1-2.85.46c-3.06 0-4.65-1.6-4.65-4.73V9.09h-1.65V5.75h1.62V2.23zM20.1 5.57c1.13 0 2.04.19 2.66.41v3.64a6 6 0 0 0-2.34-.46c-1.78 0-2.68 1.22-2.68 3.15v7.69h-4.37V5.75h3.84l.2 1.5c.6-1.09 1.53-1.68 2.69-1.68zM10.23 5.75h4.37v14.25h-4.37V5.75zm.03-2.16l4.35-.93V5.2l-4.35.93V3.59zM4.37 12.23c0-2.79 1.9-5.29 5.14-6.06l-.73 3.58c-1.31.38-2.06 1.28-2.06 2.48 0 2.06 1.58 3.04 3.49 3.45L9.55 19.4c-3.42-.8-5.18-3.73-5.18-7.17z"/>
              </svg>
            }
            description="Wraps Radix components with custom styling for their dashboard and documentation."
          />
        </div>

        <div className="p-5 rounded-lg bg-muted/30 border border-border">
          <h4 className="font-medium mb-2">Why this pattern works</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
            <li><strong>Accessibility guaranteed</strong> — Radix provides WCAG-compliant primitives</li>
            <li><strong>Brand consistency</strong> — Token layer ensures visual alignment</li>
            <li><strong>Upgrade path</strong> — Upstream improvements flow through without friction</li>
            <li><strong>Developer experience</strong> — Familiar patterns, minimal learning curve</li>
          </ul>
        </div>
      </Section>

    </article>
  );
}

// Helper Components

function BenefitCard({ 
  icon, 
  iconColor, 
  title, 
  description 
}: { 
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-5 rounded-lg border border-border bg-card">
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-lg bg-muted ${iconColor}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

function DependencyNode({ 
  label, 
  sublabel, 
  highlight = false,
  primary = false
}: { 
  label: string;
  sublabel: string;
  highlight?: boolean;
  primary?: boolean;
}) {
  return (
    <div className={`
      px-5 py-3 rounded-lg border text-center min-w-[200px]
      ${highlight ? 'bg-primary/10 border-primary/30' : ''}
      ${primary ? 'bg-info/10 border-info/30' : ''}
      ${!highlight && !primary ? 'bg-card border-border' : ''}
    `}>
      <div className="font-medium text-sm mb-0.5">{label}</div>
      <div className="text-xs text-muted-foreground">{sublabel}</div>
    </div>
  );
}

function UpdateStep({ 
  number, 
  title, 
  description 
}: { 
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
        {number}
      </div>
      <div className="pt-0.5">
        <h4 className="font-medium text-foreground mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function ComparisonRow({ 
  feature, 
  components, 
  tokens 
}: { 
  feature: string;
  components: boolean;
  tokens: boolean;
}) {
  return (
    <tr>
      <td className="py-4 px-4">{feature}</td>
      <td className="py-4 px-4">
        {components ? (
          <CheckCircle className="h-4 w-4 text-success" />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="py-4 px-4">
        {tokens ? (
          <CheckCircle className="h-4 w-4 text-success" />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
    </tr>
  );
}

function MetricCard({
  icon,
  label,
  wexValue,
  manualValue,
}: {
  icon: React.ReactNode;
  label: string;
  wexValue: string;
  manualValue: string;
}) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 text-muted-foreground mb-3">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">WEX</span>
          <span className="text-sm font-medium text-success">{wexValue}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Manual</span>
          <span className="text-sm font-medium text-destructive">{manualValue}</span>
        </div>
      </div>
    </div>
  );
}

function ValidationCard({
  company,
  logo,
  description,
}: {
  company: string;
  logo?: React.ReactNode;
  description: string;
}) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 mb-2">
        {logo && (
          <span className="text-foreground">{logo}</span>
        )}
        <h4 className="font-medium text-foreground">{company}</h4>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

