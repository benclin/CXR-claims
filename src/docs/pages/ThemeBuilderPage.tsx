/**
 * Theme Builder Page
 * 
 * Interactive tool for designers to customize WEX design tokens.
 * - Edit all semantic color tokens (Primary, Danger, Success, etc.)
 * - Edit palette ramps (50-900 for all color families)
 * - Live preview of changes
 * - Export to JSON for package integration
 */

import * as React from "react";
import { Section } from "@/docs/components/Section";
import { ColorInput, CompactColorInput } from "@/docs/components/ColorInput";
import { useThemeOverrides } from "@/docs/hooks/useThemeOverrides";
import { resolveColorVariable, getContrastData, formatContrastRatio, type ContrastRating } from "@/docs/utils/contrast";
import {
  WexButton,
  WexCard,
  WexTabs,
  WexAlert,
  WexBadge,
  WexInput,
  WexSwitch,
  WexLabel,
  WexCollapsible,
} from "@/components/wex";
import { Download, RotateCcw, Sun, Moon, ChevronDown, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// Token definitions for the editor
const SEMANTIC_TOKENS = {
  primary: {
    label: "Primary",
    tokens: [
      { token: "--wex-primary", label: "Primary", description: "Main brand color, primary actions" },
      { token: "--wex-primary-contrast", label: "Primary Contrast", description: "Text on primary backgrounds" },
      { token: "--wex-primary-hover", label: "Primary Hover", description: "Hover state for primary" },
    ],
  },
  danger: {
    label: "Danger",
    tokens: [
      { token: "--wex-danger-bg", label: "Danger Background", description: "Destructive actions, errors" },
      { token: "--wex-danger-fg", label: "Danger Foreground", description: "Text on danger backgrounds" },
      { token: "--wex-danger-hover", label: "Danger Hover", description: "Hover state for danger" },
    ],
  },
  success: {
    label: "Success",
    tokens: [
      { token: "--wex-success-bg", label: "Success Background", description: "Positive feedback" },
      { token: "--wex-success-fg", label: "Success Foreground", description: "Text on success backgrounds" },
      { token: "--wex-success-hover", label: "Success Hover", description: "Hover state for success" },
    ],
  },
  warning: {
    label: "Warning",
    tokens: [
      { token: "--wex-warning-bg", label: "Warning Background", description: "Caution states" },
      { token: "--wex-warning-fg", label: "Warning Foreground", description: "Text on warning backgrounds" },
      { token: "--wex-warning-hover", label: "Warning Hover", description: "Hover state for warning" },
    ],
  },
  info: {
    label: "Info",
    tokens: [
      { token: "--wex-info-bg", label: "Info Background", description: "Informational messages" },
      { token: "--wex-info-fg", label: "Info Foreground", description: "Text on info backgrounds" },
      { token: "--wex-info-hover", label: "Info Hover", description: "Hover state for info" },
    ],
  },
  surfaces: {
    label: "Surfaces",
    tokens: [
      { token: "--wex-content-bg", label: "Content Background", description: "Page and card backgrounds" },
      { token: "--wex-content-border", label: "Content Border", description: "Borders and dividers" },
      { token: "--wex-surface-subtle", label: "Surface Subtle", description: "Subtle backgrounds, muted areas" },
    ],
  },
  text: {
    label: "Text",
    tokens: [
      { token: "--wex-text", label: "Text", description: "Primary text color" },
      { token: "--wex-text-muted", label: "Text Muted", description: "Secondary/muted text" },
    ],
  },
};

const PALETTE_RAMPS = ["blue", "green", "amber", "red", "slate"] as const;
const PALETTE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export default function ThemeBuilderPage() {
  const { setToken, getToken, resetAll, hasOverrides, exportAsJSON, isLoaded } = useThemeOverrides();
  const [editMode, setEditMode] = React.useState<"light" | "dark">("light");
  const [expandedPalettes, setExpandedPalettes] = React.useState<Set<string>>(new Set());

  // Get current value for a token (override or computed from CSS)
  const getTokenValue = React.useCallback((token: string): string => {
    const override = getToken(token, editMode);
    if (override) return override;
    
    // Fall back to computed value from CSS
    const computed = resolveColorVariable(token);
    return computed || "0 0% 50%";
  }, [getToken, editMode]);

  // Handle token change
  const handleTokenChange = React.useCallback((token: string, value: string) => {
    setToken(token, value, editMode);
  }, [setToken, editMode]);

  // Export JSON
  const handleExport = React.useCallback(() => {
    const json = exportAsJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "theme-overrides.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [exportAsJSON]);

  // Toggle palette expansion
  const togglePalette = (name: string) => {
    setExpandedPalettes((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  if (!isLoaded) {
    return (
      <article className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading theme builder...</p>
      </article>
    );
  }

  return (
    <article>
      <header className="mb-8 pb-6 border-b border-border">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Theme Builder
        </h1>
        <p className="text-lg text-muted-foreground">
          Customize WEX design tokens and export for package integration.
        </p>
      </header>

      <div className="space-y-8">
        {/* Instructions */}
        <WexAlert intent="info">
          <Info className="h-4 w-4" />
          <WexAlert.Title>How to use</WexAlert.Title>
          <WexAlert.Description>
            Edit colors below using the color picker, hex input, or HSL values. 
            Changes are saved locally and applied instantly. When ready, export 
            as JSON to integrate with your build pipeline.
          </WexAlert.Description>
        </WexAlert>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border border-border bg-muted/30">
          <div className="flex items-center gap-4">
            {/* Mode toggle */}
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <WexSwitch
                checked={editMode === "dark"}
                onCheckedChange={(checked) => setEditMode(checked ? "dark" : "light")}
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
              <WexLabel className="text-sm text-muted-foreground ml-2">
                Editing {editMode} mode
              </WexLabel>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {hasOverrides && (
              <WexBadge intent="secondary" className="mr-2">
                Unsaved changes
              </WexBadge>
            )}
            <WexButton intent="outline" size="sm" onClick={resetAll} disabled={!hasOverrides}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All
            </WexButton>
            <WexButton size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </WexButton>
          </div>
        </div>

        {/* Semantic Colors */}
        <Section
          title="Semantic Colors"
          description="Core design tokens used by components. Edit these to change the overall theme."
        >
          <WexTabs defaultValue="primary">
            <WexTabs.List className="mb-6">
              {Object.entries(SEMANTIC_TOKENS).map(([key, group]) => (
                <WexTabs.Trigger key={key} value={key}>
                  {group.label}
                </WexTabs.Trigger>
              ))}
            </WexTabs.List>
            
            {Object.entries(SEMANTIC_TOKENS).map(([key, group]) => (
              <WexTabs.Content key={key} value={key}>
                <div className="space-y-6">
                  {group.tokens.map((tokenDef) => (
                    <ColorInput
                      key={tokenDef.token}
                      token={tokenDef.token}
                      label={tokenDef.label}
                      description={tokenDef.description}
                      value={getTokenValue(tokenDef.token)}
                      onChange={(value) => handleTokenChange(tokenDef.token, value)}
                    />
                  ))}
                </div>
              </WexTabs.Content>
            ))}
          </WexTabs>
        </Section>

        {/* Palette Ramps */}
        <Section
          title="Palette Ramps (50-900)"
          description="Extended color scales for subtle UI variations. Click to expand each ramp."
        >
          <div className="space-y-3">
            {PALETTE_RAMPS.map((rampName) => (
              <WexCollapsible
                key={rampName}
                open={expandedPalettes.has(rampName)}
                onOpenChange={() => togglePalette(rampName)}
              >
                <WexCollapsible.Trigger asChild>
                  <button className="w-full flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-0.5">
                        {PALETTE_STEPS.slice(0, 5).map((step) => (
                          <div
                            key={step}
                            className="w-4 h-4 rounded-sm border border-border/50"
                            style={{ backgroundColor: `hsl(var(--wex-palette-${rampName}-${step}))` }}
                          />
                        ))}
                      </div>
                      <span className="font-medium capitalize">{rampName}</span>
                    </div>
                    <ChevronDown className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      expandedPalettes.has(rampName) && "rotate-180"
                    )} />
                  </button>
                </WexCollapsible.Trigger>
                <WexCollapsible.Content>
                  <div className="p-4 pt-2">
                    <div className="flex gap-2 justify-between">
                      {PALETTE_STEPS.map((step) => {
                        const token = `--wex-palette-${rampName}-${step}`;
                        return (
                          <CompactColorInput
                            key={step}
                            step={step}
                            value={getTokenValue(token)}
                            onChange={(value) => handleTokenChange(token, value)}
                          />
                        );
                      })}
                    </div>
                  </div>
                </WexCollapsible.Content>
              </WexCollapsible>
            ))}
          </div>
        </Section>

        {/* Live Preview */}
        <Section
          title="Live Preview"
          description="See how your changes affect actual components."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buttons */}
            <WexCard>
              <WexCard.Header>
                <WexCard.Title>Buttons</WexCard.Title>
              </WexCard.Header>
              <WexCard.Content className="flex flex-wrap gap-2">
                <WexButton>Primary</WexButton>
                <WexButton intent="secondary">Secondary</WexButton>
                <WexButton intent="destructive">Destructive</WexButton>
                <WexButton intent="outline">Outline</WexButton>
                <WexButton intent="ghost">Ghost</WexButton>
              </WexCard.Content>
            </WexCard>

            {/* Badges */}
            <WexCard>
              <WexCard.Header>
                <WexCard.Title>Badges</WexCard.Title>
              </WexCard.Header>
              <WexCard.Content className="flex flex-wrap gap-2">
                <WexBadge>Default</WexBadge>
                <WexBadge intent="secondary">Secondary</WexBadge>
                <WexBadge intent="destructive">Destructive</WexBadge>
                <WexBadge intent="success">Success</WexBadge>
                <WexBadge intent="warning">Warning</WexBadge>
                <WexBadge intent="info">Info</WexBadge>
              </WexCard.Content>
            </WexCard>

            {/* Alerts */}
            <WexCard className="md:col-span-2">
              <WexCard.Header>
                <WexCard.Title>Alerts</WexCard.Title>
              </WexCard.Header>
              <WexCard.Content className="space-y-3">
                <WexAlert>
                  <Info className="h-4 w-4" />
                  <WexAlert.Title>Default Alert</WexAlert.Title>
                  <WexAlert.Description>This is a default alert message.</WexAlert.Description>
                </WexAlert>
                <WexAlert intent="success">
                  <CheckCircle className="h-4 w-4" />
                  <WexAlert.Title>Success</WexAlert.Title>
                  <WexAlert.Description>Operation completed successfully.</WexAlert.Description>
                </WexAlert>
                <WexAlert intent="warning">
                  <AlertTriangle className="h-4 w-4" />
                  <WexAlert.Title>Warning</WexAlert.Title>
                  <WexAlert.Description>Please review before proceeding.</WexAlert.Description>
                </WexAlert>
                <WexAlert intent="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <WexAlert.Title>Error</WexAlert.Title>
                  <WexAlert.Description>Something went wrong.</WexAlert.Description>
                </WexAlert>
              </WexCard.Content>
            </WexCard>

            {/* Form Elements */}
            <WexCard className="md:col-span-2">
              <WexCard.Header>
                <WexCard.Title>Form Elements</WexCard.Title>
              </WexCard.Header>
              <WexCard.Content className="flex flex-wrap items-end gap-4">
                <div className="space-y-2">
                  <WexLabel>Input</WexLabel>
                  <WexInput placeholder="Type something..." />
                </div>
                <div className="flex items-center gap-2">
                  <WexSwitch id="preview-switch" />
                  <WexLabel htmlFor="preview-switch">Toggle</WexLabel>
                </div>
              </WexCard.Content>
            </WexCard>
          </div>
        </Section>

        {/* Contrast Warnings */}
        <ContrastWarningsSection />

        {/* Export Instructions */}
        <Section
          title="Integration Instructions"
          description="How to use your exported theme in the @wex/design-tokens package."
        >
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <h4 className="font-semibold text-foreground mb-2">Step 1: Export</h4>
              <p className="text-sm text-muted-foreground">
                Click the "Export JSON" button above to download your theme overrides as 
                <code className="bg-muted px-1.5 py-0.5 rounded mx-1">theme-overrides.json</code>.
              </p>
            </div>
            
            <div className="rounded-lg border border-border bg-card p-4">
              <h4 className="font-semibold text-foreground mb-2">Step 2: Add to Repository</h4>
              <p className="text-sm text-muted-foreground">
                Place the exported file in your tokens directory:
                <code className="bg-muted px-1.5 py-0.5 rounded mx-1 block mt-2">
                  /tokens/theme-overrides.json
                </code>
              </p>
            </div>
            
            <div className="rounded-lg border border-border bg-card p-4">
              <h4 className="font-semibold text-foreground mb-2">Step 3: Build Package</h4>
              <p className="text-sm text-muted-foreground">
                Run the package build command. The build script will merge your overrides 
                with the base tokens to generate the final CSS output.
              </p>
            </div>
            
            <WexAlert intent="warning">
              <AlertTriangle className="h-4 w-4" />
              <WexAlert.Title>Important</WexAlert.Title>
              <WexAlert.Description>
                Changes made here are stored in your browser's localStorage. To persist 
                them permanently, you must export and commit the JSON file to your repository.
              </WexAlert.Description>
            </WexAlert>
          </div>
        </Section>
      </div>
    </article>
  );
}

// Contrast pairings to check
const CONTRAST_PAIRINGS = [
  { label: "Primary Contrast on Primary", fg: "--wex-primary-contrast", bg: "--wex-primary" },
  { label: "Danger Foreground on Danger", fg: "--wex-danger-fg", bg: "--wex-danger-bg" },
  { label: "Success Foreground on Success", fg: "--wex-success-fg", bg: "--wex-success-bg" },
  { label: "Warning Foreground on Warning", fg: "--wex-warning-fg", bg: "--wex-warning-bg" },
  { label: "Info Foreground on Info", fg: "--wex-info-fg", bg: "--wex-info-bg" },
  { label: "Text on Content Background", fg: "--wex-text", bg: "--wex-content-bg" },
  { label: "Muted Text on Content Background", fg: "--wex-text-muted", bg: "--wex-content-bg" },
];

function ContrastWarningsSection() {
  const [contrastResults, setContrastResults] = React.useState<
    Array<{ label: string; ratio: number; rating: ContrastRating; passes: boolean }>
  >([]);

  React.useEffect(() => {
    const checkContrast = () => {
      const results = CONTRAST_PAIRINGS.map((pairing) => {
        const data = getContrastData(pairing.fg, pairing.bg);
        return {
          label: pairing.label,
          ratio: data?.ratio ?? 0,
          rating: data?.rating ?? "Fail" as ContrastRating,
          passes: data ? data.rating !== "Fail" : false,
        };
      });
      setContrastResults(results);
    };

    checkContrast();

    // Re-check when theme changes
    const observer = new MutationObserver(() => checkContrast());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
    
    // Also check periodically to catch CSS variable changes
    const interval = setInterval(checkContrast, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const failingPairings = contrastResults.filter((r) => !r.passes);
  const passingPairings = contrastResults.filter((r) => r.passes);

  return (
    <Section
      title="Contrast Validation"
      description="WCAG contrast checks for common text/background pairings."
    >
      {failingPairings.length > 0 && (
        <WexAlert intent="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <WexAlert.Title>Accessibility Warning</WexAlert.Title>
          <WexAlert.Description>
            {failingPairings.length} color pairing(s) fail WCAG contrast requirements.
            Consider adjusting the colors to improve readability.
          </WexAlert.Description>
        </WexAlert>
      )}

      <div className="space-y-2">
        {contrastResults.map((result) => (
          <div
            key={result.label}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border",
              result.passes
                ? "border-border bg-card"
                : "border-destructive/50 bg-destructive/5"
            )}
          >
            <span className="text-sm text-foreground">{result.label}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-mono">
                {formatContrastRatio(result.ratio)}
              </span>
              <WexBadge
                intent={
                  result.rating === "AAA" || result.rating === "AA"
                    ? "success"
                    : result.rating === "AA-large"
                    ? "warning"
                    : "destructive"
                }
              >
                {result.rating}
              </WexBadge>
            </div>
          </div>
        ))}
      </div>

      {failingPairings.length === 0 && contrastResults.length > 0 && (
        <WexAlert intent="success" className="mt-4">
          <CheckCircle className="h-4 w-4" />
          <WexAlert.Title>All checks passing</WexAlert.Title>
          <WexAlert.Description>
            All color pairings meet WCAG contrast requirements.
          </WexAlert.Description>
        </WexAlert>
      )}
    </Section>
  );
}

