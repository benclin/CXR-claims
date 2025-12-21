/**
 * Theme Builder Page V2
 * 
 * Professional design tool for customizing WEX design tokens.
 * 
 * Layout: Figma-style editing experience
 * - Left rail: Component/Global selection (handled by DocsLayout via ThemeBuilderNav)
 * - Center workspace: Preview of selected item with all variants
 * - Right properties: Token editors scoped to selection
 * 
 * Features:
 * - Selection-driven UI (select component → see its tokens)
 * - Global token editing (surfaces, text, borders, focus, radii)
 * - Live component preview with all variants
 * - A11y integration from compliance.json
 * - Export to JSON for package updates
 * - Unsaved changes warning
 */

import * as React from "react";
import { ColorInput } from "@/docs/components/ColorInput";
import { useThemeOverrides } from "@/docs/hooks/useThemeOverrides";
import { useThemeBuilder, type GlobalCategory } from "@/docs/context/ThemeBuilderContext";
import { COMPONENT_TOKENS, getComponentTokens } from "@/docs/data/componentTokenMap";
import { TOKEN_MAPPINGS } from "@/docs/components/TokenMapping";
import { resolveColorVariable } from "@/docs/utils/contrast";
import {
  WexButton,
  WexCard,
  WexAlert,
  WexBadge,
  WexInput,
  WexSwitch,
  WexLabel,
  WexCheckbox,
  WexSeparator,
  WexTooltip,
  WexProgress,
  WexTabs,
} from "@/components/wex";
import { 
  Download, RotateCcw, Sun, Moon, Info, CheckCircle, 
  AlertTriangle, Palette, Type, Layers, Square, Focus, Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import complianceData from "@/docs/registry/compliance.json";
import type { ComplianceResult } from "@/docs/hooks/useA11yCompliance";

// ============================================================
// GLOBAL TOKEN DEFINITIONS
// ============================================================

const GLOBAL_TOKEN_GROUPS: Record<GlobalCategory, {
  label: string;
  icon: React.ReactNode;
  description: string;
  tokens: Array<{ token: string; label: string; description: string; tailwind: string }>;
  previewComponents?: React.ReactNode;
}> = {
  surfaces: {
    label: "Surfaces",
    icon: <Layers className="h-4 w-4" />,
    description: "Background colors for cards, dialogs, and content areas",
    tokens: [
      { token: "--wex-content-bg", label: "Content BG", description: "Page & card backgrounds", tailwind: "bg-background, bg-card" },
      { token: "--wex-surface-subtle", label: "Subtle Surface", description: "Muted areas, hover states", tailwind: "bg-muted, bg-accent" },
    ],
  },
  text: {
    label: "Text",
    icon: <Type className="h-4 w-4" />,
    description: "Typography colors for headings, body text, and labels",
    tokens: [
      { token: "--wex-text", label: "Text", description: "Primary text color", tailwind: "text-foreground" },
      { token: "--wex-text-muted", label: "Muted Text", description: "Secondary text", tailwind: "text-muted-foreground" },
    ],
  },
  borders: {
    label: "Borders",
    icon: <Square className="h-4 w-4" />,
    description: "Border and divider colors",
    tokens: [
      { token: "--wex-content-border", label: "Content Border", description: "Card & divider borders", tailwind: "border-border" },
      { token: "--wex-input-border", label: "Input Border", description: "Form input borders", tailwind: "border-input" },
    ],
  },
  focus: {
    label: "Focus",
    icon: <Focus className="h-4 w-4" />,
    description: "Focus ring colors for keyboard navigation",
    tokens: [
      { token: "--wex-focus-ring-color", label: "Focus Ring", description: "Focus ring color", tailwind: "ring-ring" },
    ],
  },
  radii: {
    label: "Radii",
    icon: <Circle className="h-4 w-4" />,
    description: "Border radius values (non-color tokens)",
    tokens: [
      { token: "--wex-radius-md", label: "Medium Radius", description: "Default corner radius", tailwind: "rounded-md" },
    ],
  },
  brand: {
    label: "Brand Colors",
    icon: <Palette className="h-4 w-4" />,
    description: "Core brand colors (typically read-only)",
    tokens: [
      { token: "--wex-brand-red", label: "WEX Red", description: "Primary brand color", tailwind: "text-brand-red" },
    ],
  },
};

// Semantic color tokens for component editing
const SEMANTIC_TOKENS = [
  { token: "--wex-primary", label: "Primary", tailwind: "bg-primary" },
  { token: "--wex-primary-contrast", label: "Primary Contrast", tailwind: "text-primary-foreground" },
  { token: "--wex-primary-hover", label: "Primary Hover", tailwind: "hover:bg-primary/90" },
  { token: "--wex-destructive", label: "Destructive", tailwind: "bg-destructive" },
  { token: "--wex-destructive-foreground", label: "Destructive Foreground", tailwind: "text-destructive-foreground" },
  { token: "--wex-destructive-hover", label: "Destructive Hover", tailwind: "hover:bg-destructive/90" },
  { token: "--wex-success", label: "Success", tailwind: "bg-success" },
  { token: "--wex-success-foreground", label: "Success Foreground", tailwind: "text-success-foreground" },
  { token: "--wex-success-hover", label: "Success Hover", tailwind: "hover:bg-success/90" },
  { token: "--wex-warning", label: "Warning", tailwind: "bg-warning" },
  { token: "--wex-warning-foreground", label: "Warning Foreground", tailwind: "text-warning-foreground" },
  { token: "--wex-warning-hover", label: "Warning Hover", tailwind: "hover:bg-warning/90" },
  { token: "--wex-info", label: "Info", tailwind: "bg-info" },
  { token: "--wex-info-foreground", label: "Info Foreground", tailwind: "text-info-foreground" },
  { token: "--wex-info-hover", label: "Info Hover", tailwind: "hover:bg-info/90" },
];

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ThemeBuilderPage() {
  const { setToken, getToken, resetAll, hasOverrides, exportAsJSON, isLoaded } = useThemeOverrides();
  const { selection, editMode, setEditMode, issueCounts } = useThemeBuilder();
  
  // Store the original theme to restore on unmount
  const originalThemeRef = React.useRef<string | null>(null);
  
  // Toggle dark mode on the page when editMode changes
  React.useEffect(() => {
    // Save original theme on first render
    if (originalThemeRef.current === null) {
      originalThemeRef.current = document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    
    // Apply the edit mode theme
    if (editMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Restore original theme on unmount
    return () => {
      if (originalThemeRef.current === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
  }, [editMode]);
  
  // Handle beforeunload for unsaved changes
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasOverrides) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasOverrides]);

  // Get current value for a token
  const getTokenValue = React.useCallback((token: string): string => {
    const override = getToken(token, editMode);
    if (override) return override;
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
    a.download = "wex-theme-overrides.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [exportAsJSON]);

  // Handle reset with confirmation
  const handleReset = React.useCallback(() => {
    if (confirm("Discard all changes? This cannot be undone.")) {
      resetAll();
    }
  }, [resetAll]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading Theme Builder...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] bg-background">
      {/* ============================================================
          TOP TOOLBAR
          ============================================================ */}
      <header className="sticky top-0 z-20 h-12 border-b border-border bg-card flex items-center px-4 gap-4">
        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-muted/50 rounded-md p-0.5">
          <button
            onClick={() => setEditMode("light")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors",
              editMode === "light" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sun className="h-3.5 w-3.5" />
            Light
            {issueCounts.light > 0 && (
              <span className="bg-warning/20 text-warning text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                {issueCounts.light}
              </span>
            )}
          </button>
          <button
            onClick={() => setEditMode("dark")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors",
              editMode === "dark" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Moon className="h-3.5 w-3.5" />
            Dark
            {issueCounts.dark > 0 && (
              <span className="bg-destructive/20 text-destructive text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                {issueCounts.dark}
              </span>
            )}
          </button>
        </div>

        <WexSeparator orientation="vertical" className="h-6" />

        {/* Selection Info */}
        <div className="flex-1 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Editing:</span>
          <span className="text-sm font-medium text-foreground">
            {selection.type === "global" 
              ? GLOBAL_TOKEN_GROUPS[selection.category].label
              : COMPONENT_TOKENS[selection.key]?.name ?? selection.key
            }
          </span>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2">
          {hasOverrides && (
            <WexBadge intent="warning" className="text-xs">
              Unsaved
            </WexBadge>
          )}
          <WexTooltip>
            <WexTooltip.Trigger asChild>
              <WexButton 
                intent="ghost" 
                size="sm" 
                onClick={handleReset} 
                disabled={!hasOverrides}
                className="h-8"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </WexButton>
            </WexTooltip.Trigger>
            <WexTooltip.Content>Reset All Changes</WexTooltip.Content>
          </WexTooltip>
          <WexButton 
            size="sm" 
            onClick={handleExport} 
            disabled={!hasOverrides}
            className="h-8"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </WexButton>
        </div>
      </header>

      {/* ============================================================
          MAIN CONTENT: WORKSPACE + PROPERTIES
          ============================================================ */}
      <div className="flex-1 flex overflow-hidden">
        {/* CENTER WORKSPACE */}
        <div className="flex-1 overflow-y-auto p-6 bg-muted/20">
          <GettingStartedGuide />
          {selection.type === "global" ? (
            <GlobalWorkspace 
              category={selection.category} 
              getTokenValue={getTokenValue}
            />
          ) : (
            <ComponentWorkspace 
              componentKey={selection.key}
              editMode={editMode}
            />
          )}
        </div>

        {/* RIGHT PROPERTIES PANEL */}
        <PropertiesPanel
          selection={selection}
          getTokenValue={getTokenValue}
          onTokenChange={handleTokenChange}
        />
      </div>
    </div>
  );
}

// ============================================================
// WORKSPACE COMPONENTS
// ============================================================

// Local storage key for hiding the getting started guide
const STORAGE_KEY_HIDE_GUIDE = "wex-theme-builder-hide-guide";

function GettingStartedGuide() {
  const [isHidden, setIsHidden] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY_HIDE_GUIDE) === "true";
  });

  const handleDismiss = () => {
    setIsHidden(true);
    localStorage.setItem(STORAGE_KEY_HIDE_GUIDE, "true");
  };

  if (isHidden) return null;

  return (
    <div className="mb-6 p-4 rounded-lg border border-primary/30 bg-primary/5">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Info className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Welcome to the Theme Builder</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Use this tool to customize WEX design tokens and see changes in real-time.
            </p>
            <ul className="text-xs text-muted-foreground mt-3 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="font-mono bg-muted px-1 rounded">1</span>
                <span>Select a <strong>Global Token</strong> category or <strong>Component</strong> from the left rail</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono bg-muted px-1 rounded">2</span>
                <span>Edit colors using the <strong>Properties Panel</strong> on the right</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono bg-muted px-1 rounded">3</span>
                <span>Preview changes live in the <strong>center workspace</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono bg-muted px-1 rounded">4</span>
                <span>Click <strong>Export</strong> to download a JSON file for your design tokens package</span>
              </li>
            </ul>
          </div>
        </div>
        <button 
          onClick={handleDismiss} 
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

interface GlobalWorkspaceProps {
  category: GlobalCategory;
  getTokenValue: (token: string) => string;
}

function GlobalWorkspace({ category, getTokenValue }: GlobalWorkspaceProps) {
  const group = GLOBAL_TOKEN_GROUPS[category];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-primary/10 text-primary">
          {group.icon}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{group.label}</h1>
          <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
        </div>
      </div>

      {/* Token Swatches */}
      <div className="grid grid-cols-2 gap-4">
        {group.tokens.map((tokenDef) => (
          <div key={tokenDef.token} className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-lg border border-border shadow-sm"
                style={{ backgroundColor: `hsl(${getTokenValue(tokenDef.token)})` }}
              />
              <div>
                <div className="font-medium text-foreground">{tokenDef.label}</div>
                <code className="text-xs text-muted-foreground">{tokenDef.token}</code>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{tokenDef.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {tokenDef.tailwind.split(", ").map((tw) => (
                <code key={tw} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                  {tw}
                </code>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Components */}
      <div className="p-6 rounded-lg border border-border bg-card">
        <h2 className="text-sm font-medium text-foreground mb-4">Live Preview</h2>
        {category === "surfaces" && <SurfacesPreview />}
        {category === "text" && <TextPreview />}
        {category === "borders" && <BordersPreview />}
        {category === "focus" && <FocusPreview />}
        {category === "radii" && <RadiiPreview />}
        {category === "brand" && <BrandPreview />}
      </div>
    </div>
  );
}

interface ComponentWorkspaceProps {
  componentKey: string;
  editMode: "light" | "dark";
}

function ComponentWorkspace({ componentKey, editMode }: ComponentWorkspaceProps) {
  const component = COMPONENT_TOKENS[componentKey];
  
  if (!component) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Component not found: {componentKey}
      </div>
    );
  }

  // Check a11y status
  const compData = complianceData[componentKey as keyof typeof complianceData] as ComplianceResult | undefined;
  const modeStatus = compData?.modes?.[editMode]?.status ?? compData?.status;
  const hasIssues = modeStatus === "fail" || modeStatus === "partial";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{component.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{component.description}</p>
        </div>
        {compData && (
          <WexBadge intent={hasIssues ? "destructive" : "success"}>
            {modeStatus === "pass" ? "A11y Pass" : modeStatus === "partial" ? "Partial" : "A11y Issues"}
          </WexBadge>
        )}
      </div>

      {/* A11y Warning */}
      {hasIssues && compData?.issues && (
        <WexAlert intent="warning">
          <AlertTriangle className="h-4 w-4" />
          <WexAlert.Title>Accessibility Issues in {editMode} mode</WexAlert.Title>
          <WexAlert.Description>
            {compData.issues.join(", ")}. Adjust tokens in the Properties panel to fix.
          </WexAlert.Description>
        </WexAlert>
      )}

      {/* Component Variants Preview */}
      <div className="p-6 rounded-lg border border-border bg-card">
        <h2 className="text-sm font-medium text-foreground mb-4">Component Variants</h2>
        <ComponentPreview componentKey={componentKey} />
      </div>

      {/* Token to Tailwind Mapping */}
      <div className="p-4 rounded-lg border border-border bg-muted/30">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Token → Tailwind Mapping
        </h3>
        <div className="space-y-2">
          {component.tokens.map((token) => {
            const mapping = TOKEN_MAPPINGS[token];
            return (
              <div key={token} className="flex flex-wrap items-center gap-2 text-xs">
                <code className="font-mono text-primary bg-background px-1.5 py-0.5 rounded border border-border">
                  {token}
                </code>
                <span className="text-muted-foreground">→</span>
                {mapping?.tailwindUtilities?.slice(0, 3).map((util) => (
                  <code key={util} className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">
                    {util}
                  </code>
                )) || <span className="text-muted-foreground">-</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT PREVIEW RENDERS
// ============================================================

/**
 * Wrapper that labels a component example with its token names
 */
function LabeledExample({ 
  label, 
  tokens, 
  children,
  inline = false,
}: { 
  label: string; 
  tokens: string[]; 
  children: React.ReactNode;
  inline?: boolean;
}) {
  return (
    <div className={cn(
      "rounded-lg border border-border/50 bg-muted/10 p-3",
      inline && "inline-flex flex-col"
    )}>
      <div className="mb-2">{children}</div>
      <div className="text-[10px] text-muted-foreground">
        <span className="font-medium">{label}</span>
        {tokens.length > 0 && (
          <span className="ml-1 font-mono">
            {tokens.join(", ")}
          </span>
        )}
      </div>
    </div>
  );
}

function ComponentPreview({ componentKey }: { componentKey: string }) {
  switch (componentKey) {
    case "button":
      return (
        <div className="space-y-4">
          <div className="text-xs font-medium text-muted-foreground mb-2">Variants</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <LabeledExample label="Primary" tokens={["--wex-primary", "--wex-primary-contrast"]}>
              <WexButton>Primary</WexButton>
            </LabeledExample>
            <LabeledExample label="Secondary" tokens={["--wex-surface-subtle", "--wex-text"]}>
              <WexButton intent="secondary">Secondary</WexButton>
            </LabeledExample>
            <LabeledExample label="Destructive" tokens={["--wex-destructive", "--wex-destructive-foreground"]}>
              <WexButton intent="destructive">Destructive</WexButton>
            </LabeledExample>
            <LabeledExample label="Outline" tokens={["--wex-content-border", "--wex-text"]}>
              <WexButton intent="outline">Outline</WexButton>
            </LabeledExample>
            <LabeledExample label="Ghost" tokens={["--wex-surface-subtle"]}>
              <WexButton intent="ghost">Ghost</WexButton>
            </LabeledExample>
          </div>
          <div className="text-xs font-medium text-muted-foreground mb-2 mt-4">States</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <LabeledExample label="Disabled" tokens={["--wex-disabled-opacity"]}>
              <WexButton disabled>Disabled</WexButton>
            </LabeledExample>
            <LabeledExample label="Hover" tokens={["--wex-primary-hover"]}>
              <WexButton className="bg-primary/90">Hover State</WexButton>
            </LabeledExample>
          </div>
        </div>
      );
    case "badge":
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <LabeledExample label="Default" tokens={["--wex-primary", "--wex-primary-contrast"]}>
            <WexBadge>Default</WexBadge>
          </LabeledExample>
          <LabeledExample label="Secondary" tokens={["--wex-surface-subtle"]}>
            <WexBadge intent="secondary">Secondary</WexBadge>
          </LabeledExample>
          <LabeledExample label="Destructive" tokens={["--wex-destructive", "--wex-destructive-foreground"]}>
            <WexBadge intent="destructive">Destructive</WexBadge>
          </LabeledExample>
          <LabeledExample label="Success" tokens={["--wex-success", "--wex-success-foreground"]}>
            <WexBadge intent="success">Success</WexBadge>
          </LabeledExample>
          <LabeledExample label="Warning" tokens={["--wex-warning", "--wex-warning-foreground"]}>
            <WexBadge intent="warning">Warning</WexBadge>
          </LabeledExample>
          <LabeledExample label="Info" tokens={["--wex-info", "--wex-info-foreground"]}>
            <WexBadge intent="info">Info</WexBadge>
          </LabeledExample>
          <LabeledExample label="Outline" tokens={["--wex-content-border"]}>
            <WexBadge intent="outline">Outline</WexBadge>
          </LabeledExample>
        </div>
      );
    case "alert":
      return (
        <div className="space-y-3">
          <LabeledExample label="Default" tokens={["--wex-content-bg", "--wex-content-border"]}>
            <WexAlert>
              <Info className="h-4 w-4" />
              <WexAlert.Title>Default Alert</WexAlert.Title>
              <WexAlert.Description>Default alert styling.</WexAlert.Description>
            </WexAlert>
          </LabeledExample>
          <LabeledExample label="Success" tokens={["--wex-success", "--wex-success-foreground"]}>
            <WexAlert intent="success">
              <CheckCircle className="h-4 w-4" />
              <WexAlert.Title>Success</WexAlert.Title>
            </WexAlert>
          </LabeledExample>
          <LabeledExample label="Warning" tokens={["--wex-warning", "--wex-warning-foreground"]}>
            <WexAlert intent="warning">
              <AlertTriangle className="h-4 w-4" />
              <WexAlert.Title>Warning</WexAlert.Title>
            </WexAlert>
          </LabeledExample>
          <LabeledExample label="Destructive" tokens={["--wex-destructive", "--wex-destructive-foreground"]}>
            <WexAlert intent="destructive">
              <AlertTriangle className="h-4 w-4" />
              <WexAlert.Title>Error</WexAlert.Title>
            </WexAlert>
          </LabeledExample>
          <LabeledExample label="Info" tokens={["--wex-info", "--wex-info-foreground"]}>
            <WexAlert intent="info">
              <Info className="h-4 w-4" />
              <WexAlert.Title>Informational</WexAlert.Title>
            </WexAlert>
          </LabeledExample>
        </div>
      );
    case "card":
      return (
        <LabeledExample label="Card" tokens={["--wex-content-bg", "--wex-content-border", "--wex-text", "--wex-text-muted"]}>
          <WexCard className="max-w-sm">
            <WexCard.Header>
              <WexCard.Title>Card Title</WexCard.Title>
              <WexCard.Description>Card description text.</WexCard.Description>
            </WexCard.Header>
            <WexCard.Content>
              <p className="text-sm text-muted-foreground">Content area.</p>
            </WexCard.Content>
          </WexCard>
        </LabeledExample>
      );
    case "input":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg">
          <LabeledExample label="Default" tokens={["--wex-content-bg", "--wex-input-border"]}>
            <WexInput placeholder="Default input" />
          </LabeledExample>
          <LabeledExample label="Disabled" tokens={["--wex-disabled-opacity"]}>
            <WexInput placeholder="Disabled" disabled />
          </LabeledExample>
          <LabeledExample label="Focus" tokens={["--wex-focus-ring-color"]}>
            <WexInput placeholder="Focus state" className="ring-2 ring-ring" />
          </LabeledExample>
        </div>
      );
    case "checkbox":
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <LabeledExample label="Unchecked" tokens={["--wex-content-bg", "--wex-input-border"]}>
            <div className="flex items-center gap-2">
              <WexCheckbox id="cb1" />
              <WexLabel htmlFor="cb1">Option</WexLabel>
            </div>
          </LabeledExample>
          <LabeledExample label="Checked" tokens={["--wex-primary", "--wex-primary-contrast"]}>
            <div className="flex items-center gap-2">
              <WexCheckbox id="cb2" defaultChecked />
              <WexLabel htmlFor="cb2">Selected</WexLabel>
            </div>
          </LabeledExample>
          <LabeledExample label="Disabled" tokens={["--wex-disabled-opacity"]}>
            <div className="flex items-center gap-2">
              <WexCheckbox id="cb3" disabled />
              <WexLabel htmlFor="cb3">Disabled</WexLabel>
            </div>
          </LabeledExample>
        </div>
      );
    case "switch":
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <LabeledExample label="Off" tokens={["--wex-surface-subtle"]}>
            <div className="flex items-center gap-2">
              <WexSwitch id="sw1" />
              <WexLabel htmlFor="sw1">Off</WexLabel>
            </div>
          </LabeledExample>
          <LabeledExample label="On" tokens={["--wex-primary", "--wex-primary-contrast"]}>
            <div className="flex items-center gap-2">
              <WexSwitch id="sw2" defaultChecked />
              <WexLabel htmlFor="sw2">On</WexLabel>
            </div>
          </LabeledExample>
          <LabeledExample label="Disabled" tokens={["--wex-disabled-opacity"]}>
            <div className="flex items-center gap-2">
              <WexSwitch id="sw3" disabled />
              <WexLabel htmlFor="sw3">Disabled</WexLabel>
            </div>
          </LabeledExample>
        </div>
      );
    case "progress":
      return (
        <div className="space-y-3 max-w-md">
          <LabeledExample label="Progress" tokens={["--wex-primary", "--wex-surface-subtle"]}>
            <div className="space-y-2">
              <WexProgress value={25} />
              <WexProgress value={75} />
            </div>
          </LabeledExample>
        </div>
      );
    case "tabs":
      return (
        <LabeledExample label="Tabs" tokens={["--wex-content-bg", "--wex-surface-subtle", "--wex-text"]}>
          <WexTabs defaultValue="tab1" className="max-w-md">
            <WexTabs.List>
              <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
              <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
              <WexTabs.Trigger value="tab3">Tab 3</WexTabs.Trigger>
            </WexTabs.List>
            <WexTabs.Content value="tab1" className="p-4">Tab 1 content</WexTabs.Content>
            <WexTabs.Content value="tab2" className="p-4">Tab 2 content</WexTabs.Content>
            <WexTabs.Content value="tab3" className="p-4">Tab 3 content</WexTabs.Content>
          </WexTabs>
        </LabeledExample>
      );
    case "separator":
      return (
        <LabeledExample label="Separator" tokens={["--wex-content-border"]}>
          <div className="space-y-4">
            <p className="text-sm">Content above</p>
            <WexSeparator />
            <p className="text-sm">Content below</p>
          </div>
        </LabeledExample>
      );
    case "tooltip":
      return (
        <LabeledExample label="Tooltip" tokens={["--wex-primary", "--wex-primary-contrast"]}>
          <WexTooltip>
            <WexTooltip.Trigger asChild>
              <WexButton intent="outline">Hover me</WexButton>
            </WexTooltip.Trigger>
            <WexTooltip.Content>
              <p>Tooltip content</p>
            </WexTooltip.Content>
          </WexTooltip>
        </LabeledExample>
      );
    case "skeleton":
      return (
        <LabeledExample label="Skeleton" tokens={["--wex-surface-subtle"]}>
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
          </div>
        </LabeledExample>
      );
    case "avatar":
      return (
        <LabeledExample label="Avatar" tokens={["--wex-surface-subtle", "--wex-text-muted"]}>
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
              JD
            </div>
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
              AB
            </div>
          </div>
        </LabeledExample>
      );
    case "slider":
      return (
        <LabeledExample label="Slider" tokens={["--wex-primary", "--wex-surface-subtle"]}>
          <div className="w-64">
            <input type="range" className="w-full accent-primary" />
          </div>
        </LabeledExample>
      );
    case "radioGroup":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <LabeledExample label="Unselected" tokens={["--wex-content-bg", "--wex-input-border"]}>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-input bg-background" />
              <WexLabel>Option A</WexLabel>
            </div>
          </LabeledExample>
          <LabeledExample label="Selected" tokens={["--wex-primary", "--wex-primary-contrast"]}>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
              </div>
              <WexLabel>Option B</WexLabel>
            </div>
          </LabeledExample>
          <LabeledExample label="Disabled" tokens={["--wex-disabled-opacity"]}>
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-4 h-4 rounded-full border-2 border-input bg-background" />
              <WexLabel>Disabled</WexLabel>
            </div>
          </LabeledExample>
        </div>
      );
    case "label":
      return (
        <LabeledExample label="Label" tokens={["--wex-text"]}>
          <WexLabel>Form Label</WexLabel>
        </LabeledExample>
      );
    default:
      return (
        <div className="text-muted-foreground text-sm">
          Preview not available for this component.
        </div>
      );
  }
}

// Global category previews
function SurfacesPreview() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <WexCard>
        <WexCard.Header>
          <WexCard.Title>Card Surface</WexCard.Title>
        </WexCard.Header>
        <WexCard.Content>Uses --wex-content-bg</WexCard.Content>
      </WexCard>
      <div className="p-4 rounded-lg bg-muted">
        <p className="text-sm font-medium">Muted Surface</p>
        <p className="text-xs text-muted-foreground">Uses --wex-surface-subtle</p>
      </div>
    </div>
  );
}

function TextPreview() {
  return (
    <div className="space-y-3">
      <p className="text-lg font-semibold text-foreground">Primary Text (--wex-text)</p>
      <p className="text-sm text-muted-foreground">
        Muted text for descriptions and secondary content (--wex-text-muted)
      </p>
    </div>
  );
}

function BordersPreview() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 border-2 border-border rounded-lg">
        <p className="text-sm">Content Border</p>
        <code className="text-xs text-muted-foreground">--wex-content-border</code>
      </div>
      <WexInput placeholder="Input border" className="border-2" />
    </div>
  );
}

function FocusPreview() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-2">Tab through to see focus rings:</p>
      <div className="flex gap-3">
        <WexButton intent="outline">Focus Me</WexButton>
        <WexInput placeholder="Or me" className="w-32" />
        <WexCheckbox />
      </div>
    </div>
  );
}

function RadiiPreview() {
  return (
    <div className="flex gap-4">
      <div className="w-20 h-20 bg-primary rounded-none flex items-center justify-center text-primary-foreground text-xs">
        none
      </div>
      <div className="w-20 h-20 bg-primary rounded-sm flex items-center justify-center text-primary-foreground text-xs">
        sm
      </div>
      <div className="w-20 h-20 bg-primary rounded-md flex items-center justify-center text-primary-foreground text-xs">
        md
      </div>
      <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-xs">
        lg
      </div>
      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs">
        full
      </div>
    </div>
  );
}

function BrandPreview() {
  return (
    <div className="space-y-6">
      {/* Primary Brand Mark */}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-[hsl(var(--wex-brand-red))] rounded-lg flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-2xl">WEX</span>
        </div>
        <div>
          <p className="font-semibold text-foreground">WEX Brand Red</p>
          <p className="text-sm text-muted-foreground">
            Core brand color (#C8102E) - typically read-only
          </p>
          <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded mt-2 inline-block">
            --wex-brand-red
          </code>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase mb-3">Usage Examples</p>
        <div className="flex flex-wrap gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-[hsl(var(--wex-brand-red))] rounded flex items-center justify-center">
              <span className="text-white font-bold">W</span>
            </div>
            <span className="text-xs text-muted-foreground mt-1 block">Logo</span>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[hsl(var(--wex-brand-red))] rounded flex items-center justify-center">
              <span className="text-[hsl(var(--wex-brand-red))] font-bold">W</span>
            </div>
            <span className="text-xs text-muted-foreground mt-1 block">Border</span>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[hsl(var(--wex-brand-red))]/10 rounded flex items-center justify-center">
              <span className="text-[hsl(var(--wex-brand-red))] font-bold">W</span>
            </div>
            <span className="text-xs text-muted-foreground mt-1 block">Tinted BG</span>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> Brand colors are typically not edited by individual developers.
          Changes to brand colors should go through the central design team and brand guidelines.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// PROPERTIES PANEL
// ============================================================

interface PropertiesPanelProps {
  selection: { type: "global"; category: GlobalCategory } | { type: "component"; key: string };
  getTokenValue: (token: string) => string;
  onTokenChange: (token: string, value: string) => void;
}

function PropertiesPanel({ 
  selection, 
  getTokenValue, 
  onTokenChange,
}: PropertiesPanelProps) {
  // Get tokens to display based on selection
  const tokensToShow = React.useMemo(() => {
    if (selection.type === "global") {
      return GLOBAL_TOKEN_GROUPS[selection.category].tokens;
    } else {
      const componentTokenKeys = getComponentTokens(selection.key);
      // Map token keys to token definitions
      return componentTokenKeys.map((token) => {
        const semantic = SEMANTIC_TOKENS.find((s) => s.token === token);
        if (semantic) {
          return { token: semantic.token, label: semantic.label, description: "", tailwind: semantic.tailwind };
        }
        // Check global tokens
        for (const group of Object.values(GLOBAL_TOKEN_GROUPS)) {
          const found = group.tokens.find((t) => t.token === token);
          if (found) return found;
        }
        return { token, label: token.replace("--wex-", ""), description: "", tailwind: "" };
      });
    }
  }, [selection]);

  return (
    <div className="w-[320px] flex-shrink-0 border-l border-border bg-card flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border bg-muted/30">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Properties
        </h2>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {tokensToShow.length} tokens
        </p>
      </div>
      
      {/* Token Editors */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {tokensToShow.map((tokenDef) => (
          <ColorInput
            key={tokenDef.token}
            token={tokenDef.token}
            label={tokenDef.label}
            value={getTokenValue(tokenDef.token)}
            onChange={(v) => onTokenChange(tokenDef.token, v)}
          />
        ))}
      </div>

      {/* Export Instructions */}
      <div className="flex-shrink-0 p-3 border-t border-border bg-muted/30">
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">How to apply:</p>
          <ol className="list-decimal list-inside space-y-0.5 text-[10px]">
            <li>Export JSON with overrides</li>
            <li>Merge into tokens/ source</li>
            <li>Re-run Style Dictionary</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
