/**
 * Component Token Map
 * 
 * Maps each WEX component to the design tokens it uses.
 * Used by Theme Builder to show only relevant tokens when a component is selected.
 */

export interface ComponentTokenData {
  /** Display name */
  name: string;
  /** Tokens used by this component */
  tokens: string[];
  /** Available variants/intents */
  variants?: string[];
  /** Brief description */
  description: string;
}

/**
 * Map of component keys to their token data
 */
export const COMPONENT_TOKENS: Record<string, ComponentTokenData> = {
  button: {
    name: "Button",
    tokens: [
      "--wex-primary",
      "--wex-primary-contrast",
      "--wex-primary-hover",
      "--wex-danger-bg",
      "--wex-danger-fg",
      "--wex-danger-hover",
      "--wex-content-bg",
      "--wex-content-border",
      "--wex-text",
      "--wex-text-muted",
      "--wex-focus-ring-color",
    ],
    variants: ["primary", "secondary", "destructive", "outline", "ghost", "link"],
    description: "Interactive button component with multiple variants",
  },
  badge: {
    name: "Badge",
    tokens: [
      "--wex-primary",
      "--wex-primary-contrast",
      "--wex-danger-bg",
      "--wex-danger-fg",
      "--wex-success-bg",
      "--wex-success-fg",
      "--wex-warning-bg",
      "--wex-warning-fg",
      "--wex-info-bg",
      "--wex-info-fg",
      "--wex-surface-subtle",
      "--wex-text",
    ],
    variants: ["default", "secondary", "destructive", "success", "warning", "info", "outline"],
    description: "Small status descriptor for UI elements",
  },
  alert: {
    name: "Alert",
    tokens: [
      "--wex-content-bg",
      "--wex-content-border",
      "--wex-text",
      "--wex-danger-bg",
      "--wex-danger-fg",
      "--wex-success-bg",
      "--wex-success-fg",
      "--wex-warning-bg",
      "--wex-warning-fg",
      "--wex-info-bg",
      "--wex-info-fg",
    ],
    variants: ["default", "destructive", "success", "warning", "info"],
    description: "Displays important messages to users",
  },
  card: {
    name: "Card",
    tokens: [
      "--wex-content-bg",
      "--wex-content-border",
      "--wex-text",
      "--wex-text-muted",
    ],
    description: "Container for grouping related content",
  },
  input: {
    name: "Input",
    tokens: [
      "--wex-content-bg",
      "--wex-input-border",
      "--wex-text",
      "--wex-text-muted",
      "--wex-focus-ring-color",
    ],
    description: "Text input field for forms",
  },
  checkbox: {
    name: "Checkbox",
    tokens: [
      "--wex-primary",
      "--wex-primary-contrast",
      "--wex-content-bg",
      "--wex-input-border",
      "--wex-focus-ring-color",
    ],
    description: "Control for toggling boolean values",
  },
  switch: {
    name: "Switch",
    tokens: [
      "--wex-primary",
      "--wex-primary-contrast",
      "--wex-surface-subtle",
      "--wex-focus-ring-color",
    ],
    description: "Toggle between two states",
  },
  select: {
    name: "Select",
    tokens: [
      "--wex-content-bg",
      "--wex-input-border",
      "--wex-text",
      "--wex-text-muted",
      "--wex-surface-subtle",
      "--wex-focus-ring-color",
    ],
    description: "Dropdown selection control",
  },
  dialog: {
    name: "Dialog",
    tokens: [
      "--wex-content-bg",
      "--wex-content-border",
      "--wex-text",
      "--wex-text-muted",
      "--wex-overlay-bg",
    ],
    description: "Modal dialog for focused content",
  },
  sheet: {
    name: "Sheet",
    tokens: [
      "--wex-content-bg",
      "--wex-content-border",
      "--wex-text",
      "--wex-overlay-bg",
    ],
    description: "Slide-out panel from screen edge",
  },
  progress: {
    name: "Progress",
    tokens: [
      "--wex-primary",
      "--wex-surface-subtle",
    ],
    description: "Progress indicator for tasks",
  },
  tabs: {
    name: "Tabs",
    tokens: [
      "--wex-content-bg",
      "--wex-surface-subtle",
      "--wex-text",
      "--wex-text-muted",
      "--wex-content-border",
    ],
    description: "Tabbed content panels",
  },
  separator: {
    name: "Separator",
    tokens: [
      "--wex-content-border",
    ],
    description: "Visual divider between content",
  },
  tooltip: {
    name: "Tooltip",
    tokens: [
      "--wex-primary",
      "--wex-primary-contrast",
    ],
    description: "Popup info on hover/focus",
  },
  popover: {
    name: "Popover",
    tokens: [
      "--wex-content-bg",
      "--wex-content-border",
      "--wex-text",
    ],
    description: "Floating content triggered by a button",
  },
  dropdown: {
    name: "Dropdown Menu",
    tokens: [
      "--wex-content-bg",
      "--wex-content-border",
      "--wex-surface-subtle",
      "--wex-text",
      "--wex-text-muted",
    ],
    description: "Menu triggered by a button",
  },
  avatar: {
    name: "Avatar",
    tokens: [
      "--wex-surface-subtle",
      "--wex-text-muted",
    ],
    description: "Image element with fallback for user profiles",
  },
  skeleton: {
    name: "Skeleton",
    tokens: [
      "--wex-surface-subtle",
    ],
    description: "Loading placeholder for content",
  },
  slider: {
    name: "Slider",
    tokens: [
      "--wex-primary",
      "--wex-surface-subtle",
      "--wex-content-bg",
    ],
    description: "Range input for selecting values",
  },
  accordion: {
    name: "Accordion",
    tokens: [
      "--wex-content-bg",
      "--wex-content-border",
      "--wex-text",
    ],
    description: "Vertically stacked set of interactive headings",
  },
  table: {
    name: "Table",
    tokens: [
      "--wex-content-bg",
      "--wex-content-border",
      "--wex-text",
      "--wex-text-muted",
      "--wex-surface-subtle",
    ],
    description: "Tabular data display",
  },
};

/**
 * Get all unique tokens used by a component
 */
export function getComponentTokens(componentKey: string): string[] {
  return COMPONENT_TOKENS[componentKey]?.tokens ?? [];
}

/**
 * Get all component keys
 */
export function getAllComponentKeys(): string[] {
  return Object.keys(COMPONENT_TOKENS);
}

/**
 * Get component display name
 */
export function getComponentName(componentKey: string): string {
  return COMPONENT_TOKENS[componentKey]?.name ?? componentKey;
}

