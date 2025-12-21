/**
 * ThemeBuilderNav Component
 * 
 * Left rail navigation for Theme Builder mode.
 * Replaces the standard SidebarNav when in Theme Builder.
 * 
 * Structure:
 * - Exit button (returns to last visited page)
 * - Global tokens section (Surfaces, Text, Borders, Focus, Radii, Brand)
 * - Components list with a11y badges
 * - Token Map link
 */

import * as React from "react";
import { WexSeparator } from "@/components/wex";
import { 
  ArrowLeft, 
  Layers, 
  Type, 
  Square, 
  Focus as FocusIcon, 
  Circle, 
  Palette,
  Map,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  useThemeBuilderState, 
  getComponentsWithIssues,
  type GlobalCategory,
} from "@/docs/hooks/useThemeBuilderState";
import { COMPONENT_TOKENS, getAllComponentKeys } from "@/docs/data/componentTokenMap";

interface ThemeBuilderNavProps {
  onOpenTokenMap: () => void;
}

// Global category configuration
const GLOBAL_CATEGORIES: Array<{
  key: GlobalCategory;
  label: string;
  icon: React.ReactNode;
}> = [
  { key: "surfaces", label: "Surfaces", icon: <Layers className="h-4 w-4" /> },
  { key: "text", label: "Text", icon: <Type className="h-4 w-4" /> },
  { key: "borders", label: "Borders", icon: <Square className="h-4 w-4" /> },
  { key: "focus", label: "Focus", icon: <FocusIcon className="h-4 w-4" /> },
  { key: "radii", label: "Radii", icon: <Circle className="h-4 w-4" /> },
  { key: "brand", label: "Brand Colors", icon: <Palette className="h-4 w-4" /> },
];

export function ThemeBuilderNav({ onOpenTokenMap }: ThemeBuilderNavProps) {
  const { 
    selection, 
    selectGlobal, 
    selectComponent, 
    exitThemeBuilder,
    editMode,
  } = useThemeBuilderState();

  const [componentsExpanded, setComponentsExpanded] = React.useState(true);
  
  // Get components with issues for current mode
  const failingComponents = React.useMemo(() => {
    return new Set(getComponentsWithIssues(editMode));
  }, [editMode]);

  // Get all component keys
  const componentKeys = React.useMemo(() => getAllComponentKeys(), []);

  return (
    <div className="h-full flex flex-col">
      {/* Exit Button */}
      <div className="p-3 border-b border-border">
        <button
          onClick={exitThemeBuilder}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit Theme Builder
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Global Tokens Section */}
        <div className="p-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
            Global Tokens
          </div>
          <div className="space-y-1">
            {GLOBAL_CATEGORIES.map((cat) => {
              const isActive = selection.type === "global" && selection.category === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => selectGlobal(cat.key)}
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <span className={isActive ? "text-primary" : "text-muted-foreground"}>
                    {cat.icon}
                  </span>
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <WexSeparator />

        {/* Components Section */}
        <div className="p-3">
          <button
            onClick={() => setComponentsExpanded(!componentsExpanded)}
            className="flex items-center justify-between w-full text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 hover:text-foreground transition-colors"
          >
            <span>Components ({componentKeys.length})</span>
            <ChevronDown className={cn("h-3 w-3 transition-transform", componentsExpanded && "rotate-180")} />
          </button>
          
          {componentsExpanded && (
            <div className="space-y-1">
              {componentKeys.map((key) => {
                const component = COMPONENT_TOKENS[key];
                const isActive = selection.type === "component" && selection.key === key;
                const hasIssues = failingComponents.has(key);

                return (
                  <button
                    key={key}
                    onClick={() => selectComponent(key)}
                    className={cn(
                      "flex items-center justify-between gap-2 w-full px-3 py-1.5 text-sm rounded-md transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span className="truncate">{component.name}</span>
                    {hasIssues && (
                      <AlertTriangle className="h-3 w-3 text-warning flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer - Token Map Link */}
      <div className="p-3 border-t border-border">
        <button
          onClick={onOpenTokenMap}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
        >
          <Map className="h-4 w-4" />
          Token Map Reference
        </button>
      </div>
    </div>
  );
}

