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
import { useThemeBuilderState, type GlobalCategory } from "@/docs/hooks/useThemeBuilderState";
import { COMPONENT_TOKENS, getComponentTokens } from "@/docs/data/componentTokenMap";
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
  { token: "--wex-danger-bg", label: "Danger BG", tailwind: "bg-destructive" },
  { token: "--wex-danger-fg", label: "Danger FG", tailwind: "text-destructive-foreground" },
  { token: "--wex-danger-hover", label: "Danger Hover", tailwind: "hover:bg-destructive/90" },
  { token: "--wex-success-bg", label: "Success BG", tailwind: "bg-success" },
  { token: "--wex-success-fg", label: "Success FG", tailwind: "text-success-foreground" },
  { token: "--wex-success-hover", label: "Success Hover", tailwind: "hover:bg-success/90" },
  { token: "--wex-warning-bg", label: "Warning BG", tailwind: "bg-warning" },
  { token: "--wex-warning-fg", label: "Warning FG", tailwind: "text-warning-foreground" },
  { token: "--wex-warning-hover", label: "Warning Hover", tailwind: "hover:bg-warning/90" },
  { token: "--wex-info-bg", label: "Info BG", tailwind: "bg-info" },
  { token: "--wex-info-fg", label: "Info FG", tailwind: "text-info-foreground" },
  { token: "--wex-info-hover", label: "Info Hover", tailwind: "hover:bg-info/90" },
];

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ThemeBuilderPage() {
  const { setToken, getToken, resetAll, hasOverrides, exportAsJSON, isLoaded } = useThemeOverrides();
  const { selection, editMode, setEditMode, issueCounts } = useThemeBuilderState();
  
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

      {/* Tokens Used */}
      <div className="p-4 rounded-lg border border-border bg-muted/30">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Tokens Used ({component.tokens.length})
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {component.tokens.map((token) => (
            <code key={token} className="text-xs bg-background px-2 py-1 rounded border border-border">
              {token}
            </code>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT PREVIEW RENDERS
// ============================================================

function ComponentPreview({ componentKey }: { componentKey: string }) {
  switch (componentKey) {
    case "button":
      return (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <WexButton>Primary</WexButton>
            <WexButton intent="secondary">Secondary</WexButton>
            <WexButton intent="destructive">Destructive</WexButton>
            <WexButton intent="outline">Outline</WexButton>
            <WexButton intent="ghost">Ghost</WexButton>
          </div>
          <div className="flex flex-wrap gap-3">
            <WexButton size="sm">Small</WexButton>
            <WexButton size="md">Medium</WexButton>
            <WexButton size="lg">Large</WexButton>
            <WexButton disabled>Disabled</WexButton>
          </div>
        </div>
      );
    case "badge":
      return (
        <div className="flex flex-wrap gap-3">
          <WexBadge>Default</WexBadge>
          <WexBadge intent="secondary">Secondary</WexBadge>
          <WexBadge intent="destructive">Destructive</WexBadge>
          <WexBadge intent="success">Success</WexBadge>
          <WexBadge intent="warning">Warning</WexBadge>
          <WexBadge intent="info">Info</WexBadge>
          <WexBadge intent="outline">Outline</WexBadge>
        </div>
      );
    case "alert":
      return (
        <div className="space-y-3">
          <WexAlert>
            <Info className="h-4 w-4" />
            <WexAlert.Title>Default Alert</WexAlert.Title>
            <WexAlert.Description>This is a default alert message.</WexAlert.Description>
          </WexAlert>
          <WexAlert intent="success">
            <CheckCircle className="h-4 w-4" />
            <WexAlert.Title>Success</WexAlert.Title>
          </WexAlert>
          <WexAlert intent="warning">
            <AlertTriangle className="h-4 w-4" />
            <WexAlert.Title>Warning</WexAlert.Title>
          </WexAlert>
          <WexAlert intent="destructive">
            <AlertTriangle className="h-4 w-4" />
            <WexAlert.Title>Error</WexAlert.Title>
          </WexAlert>
        </div>
      );
    case "card":
      return (
        <WexCard className="max-w-sm">
          <WexCard.Header>
            <WexCard.Title>Card Title</WexCard.Title>
            <WexCard.Description>Card description text goes here.</WexCard.Description>
          </WexCard.Header>
          <WexCard.Content>
            <p className="text-sm text-muted-foreground">
              This demonstrates surface and text token usage.
            </p>
          </WexCard.Content>
        </WexCard>
      );
    case "input":
      return (
        <div className="space-y-3 max-w-sm">
          <WexInput placeholder="Default input" />
          <WexInput placeholder="Disabled" disabled />
        </div>
      );
    case "checkbox":
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <WexCheckbox id="cb1" />
            <WexLabel htmlFor="cb1">Unchecked</WexLabel>
          </div>
          <div className="flex items-center gap-2">
            <WexCheckbox id="cb2" defaultChecked />
            <WexLabel htmlFor="cb2">Checked</WexLabel>
          </div>
          <div className="flex items-center gap-2">
            <WexCheckbox id="cb3" disabled />
            <WexLabel htmlFor="cb3">Disabled</WexLabel>
          </div>
        </div>
      );
    case "switch":
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <WexSwitch id="sw1" />
            <WexLabel htmlFor="sw1">Off</WexLabel>
          </div>
          <div className="flex items-center gap-2">
            <WexSwitch id="sw2" defaultChecked />
            <WexLabel htmlFor="sw2">On</WexLabel>
          </div>
        </div>
      );
    case "progress":
      return (
        <div className="space-y-3 max-w-md">
          <WexProgress value={25} />
          <WexProgress value={50} />
          <WexProgress value={75} />
          <WexProgress value={100} />
        </div>
      );
    case "tabs":
      return (
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
    <div className="flex items-center gap-6">
      <div className="w-24 h-24 bg-[hsl(var(--wex-brand-red))] rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-xl">WEX</span>
      </div>
      <div>
        <p className="font-semibold text-foreground">WEX Brand Red</p>
        <p className="text-sm text-muted-foreground">Core brand color - typically read-only</p>
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tokensToShow.map((tokenDef) => (
          <ColorInput
            key={tokenDef.token}
            token={tokenDef.token}
            label={tokenDef.label}
            description={tokenDef.description}
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
