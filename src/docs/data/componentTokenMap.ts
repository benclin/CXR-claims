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
      "--wex-destructive",
      "--wex-destructive-foreground",
      "--wex-destructive-hover",
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
      "--wex-destructive",
      "--wex-destructive-foreground",
      "--wex-success",
      "--wex-success-foreground",
      "--wex-warning",
      "--wex-warning-foreground",
      "--wex-info",
      "--wex-info-foreground",
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
      "--wex-destructive",
      "--wex-destructive-foreground",
      "--wex-success",
      "--wex-success-foreground",
      "--wex-warning",
      "--wex-warning-foreground",
      "--wex-info",
      "--wex-info-foreground",
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
  
  // Additional components
  textarea: {
    name: "Textarea",
    tokens: [
      "--wex-content-bg",
      "--wex-input-border",
      "--wex-text",
      "--wex-text-muted",
      "--wex-focus-ring-color",
    ],
    description: "Multi-line text input",
  },
  radioGroup: {
    name: "Radio Group",
    tokens: [
      "--wex-primary",
      "--wex-primary-contrast",
      "--wex-content-bg",
      "--wex-input-border",
      "--wex-focus-ring-color",
    ],
    description: "Group of radio buttons for single selection",
  },
  form: {
    name: "Form",
    tokens: [
      "--wex-text",
      "--wex-text-muted",
      "--wex-destructive-foreground",
    ],
    description: "Form wrapper with validation context",
  },
  field: {
    name: "Field",
    tokens: [
      "--wex-text",
      "--wex-text-muted",
      "--wex-destructive-foreground",
    ],
    description: "Form field with label and error display",
  },
  inputGroup: {
    name: "Input Group",
    tokens: [
      "--wex-content-bg",
      "--wex-input-border",
      "--wex-text",
      "--wex-surface-subtle",
    ],
    description: "Grouped input with addons",
  },
  inputOTP: {
    name: "Input OTP",
    tokens: [
      "--wex-content-bg",
      "--wex-input-border",
      "--wex-text",
      "--wex-focus-ring-color",
    ],
    description: "One-time password input",
  },
  calendar: {
    name: "Calendar",
    tokens: [
      "--wex-primary",
      "--wex-primary-contrast",
      "--wex-content-bg",
      "--wex-surface-subtle",
      "--wex-text",
      "--wex-text-muted",
    ],
    description: "Date picker calendar",
  },
  alertDialog: {
    name: "Alert Dialog",
    tokens: [
      "--wex-content-bg",
      "--wex-content-border",
      "--wex-text",
      "--wex-text-muted",
      "--wex-overlay-bg",
      "--wex-destructive",
      "--wex-destructive-foreground",
    ],
    description: "Confirmation dialog requiring user action",
  },
  drawer: {
    name: "Drawer",
    tokens: [
      "--wex-content-bg",
      "--wex-content-border",
      "--wex-text",
      "--wex-overlay-bg",
    ],
    description: "Drawer panel sliding from edge",
  },
  hoverCard: {
    name: "Hover Card",
    tokens: [
      "--wex-content-bg",
      "--wex-content-border",
      "--wex-text",
    ],
    description: "Rich preview on hover",
  },
  contextMenu: {
    name: "Context Menu",
    tokens: [
      "--wex-content-bg",
      "--wex-content-border",
      "--wex-surface-subtle",
      "--wex-text",
      "--wex-text-muted",
    ],
    description: "Right-click context menu",
  },
  menubar: {
    name: "Menubar",
    tokens: [
      "--wex-content-bg",
      "--wex-content-border",
      "--wex-surface-subtle",
      "--wex-text",
    ],
    description: "Horizontal menu bar",
  },
  navigationMenu: {
    name: "Navigation Menu",
    tokens: [
      "--wex-content-bg",
      "--wex-surface-subtle",
      "--wex-text",
      "--wex-text-muted",
    ],
    description: "Navigation with dropdown sections",
  },
  command: {
    name: "Command",
    tokens: [
      "--wex-content-bg",
      "--wex-content-border",
      "--wex-surface-subtle",
      "--wex-text",
      "--wex-text-muted",
    ],
    description: "Command palette / search",
  },
  scrollArea: {
    name: "Scroll Area",
    tokens: [
      "--wex-surface-subtle",
    ],
    description: "Custom styled scrollable area",
  },
  resizable: {
    name: "Resizable",
    tokens: [
      "--wex-content-border",
    ],
    description: "Resizable split panels",
  },
  aspectRatio: {
    name: "Aspect Ratio",
    tokens: [],
    description: "Maintains aspect ratio for content",
  },
  collapsible: {
    name: "Collapsible",
    tokens: [
      "--wex-content-bg",
    ],
    description: "Expandable/collapsible section",
  },
  sidebar: {
    name: "Sidebar",
    tokens: [
      "--wex-content-bg",
      "--wex-content-border",
      "--wex-surface-subtle",
      "--wex-text",
    ],
    description: "Application sidebar layout",
  },
  breadcrumb: {
    name: "Breadcrumb",
    tokens: [
      "--wex-text",
      "--wex-text-muted",
    ],
    description: "Navigation breadcrumb trail",
  },
  pagination: {
    name: "Pagination",
    tokens: [
      "--wex-primary",
      "--wex-content-bg",
      "--wex-text",
      "--wex-text-muted",
      "--wex-surface-subtle",
    ],
    description: "Page navigation controls",
  },
  spinner: {
    name: "Spinner",
    tokens: [
      "--wex-primary",
    ],
    description: "Loading indicator",
  },
  carousel: {
    name: "Carousel",
    tokens: [
      "--wex-content-bg",
      "--wex-surface-subtle",
    ],
    description: "Slideshow component",
  },
  empty: {
    name: "Empty",
    tokens: [
      "--wex-text",
      "--wex-text-muted",
      "--wex-surface-subtle",
    ],
    description: "Empty state placeholder",
  },
  item: {
    name: "Item",
    tokens: [
      "--wex-content-bg",
      "--wex-surface-subtle",
      "--wex-text",
    ],
    description: "Generic list item",
  },
  kbd: {
    name: "Kbd",
    tokens: [
      "--wex-surface-subtle",
      "--wex-content-border",
      "--wex-text",
    ],
    description: "Keyboard key indicator",
  },
  toggle: {
    name: "Toggle",
    tokens: [
      "--wex-surface-subtle",
      "--wex-text",
    ],
    variants: ["default", "outline"],
    description: "Toggle button with pressed state",
  },
  toggleGroup: {
    name: "Toggle Group",
    tokens: [
      "--wex-surface-subtle",
      "--wex-text",
      "--wex-content-border",
    ],
    variants: ["default", "outline"],
    description: "Group of toggle buttons",
  },
  buttonGroup: {
    name: "Button Group",
    tokens: [
      "--wex-primary",
      "--wex-content-border",
    ],
    description: "Grouped action buttons",
  },
  toast: {
    name: "Toast",
    tokens: [
      "--wex-content-bg",
      "--wex-content-border",
      "--wex-text",
      "--wex-text-muted",
      "--wex-success",
      "--wex-destructive",
      "--wex-warning",
      "--wex-info",
    ],
    variants: ["default", "success", "error", "warning", "info"],
    description: "Notification toast messages",
  },
  chart: {
    name: "Chart",
    tokens: [
      "--chart-1",
      "--chart-2",
      "--chart-3",
      "--chart-4",
      "--chart-5",
      "--wex-content-bg",
      "--wex-content-border",
    ],
    description: "Data visualization charts",
  },
  label: {
    name: "Label",
    tokens: [
      "--wex-text",
    ],
    description: "Form label element",
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

